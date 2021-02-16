import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

export default {
  acceptOrder: async (request:Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const { activeUser } = request.auth.credentials;

    const orderId = parseInt(request.params.orderId, 10);
    // make sure orderId is a number
    if (Number.isNaN(orderId) && orderId > 0) {
      return Boom.badRequest('the request you send to the server must be a number', {
        error: {
          message: `${request.params.orderId} could not be parse into a number`,
        },
      });
    }

    // check if the authenticated user is the owner
    if (!activeUser.isOwner) {
      return Boom.forbidden('only shop owner can accept  orders');
    }

    // get the order
    try {
      const fetchedOrdder = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          OrderLines: {
            include: {
              Product: {
                select: {
                  stockQuantity: true,
                  Shop: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!fetchedOrdder) {
        return Boom.badRequest(`the order with id ${orderId} does not exist`, {
          error: {
            message: `the order with id ${orderId} does not exist`,
          },
        });
      }
      // set the order status to accepted
      const updatedOrder = await prisma.order.update({
        where: { id: fetchedOrdder.id },
        data: {
          status: 'ACCEPTED',
        },
      });
      console.log(updatedOrder);

      // update all the products

      const updatedProducts = await Promise.all(
        // for each order line update the corresponding product quantity
        fetchedOrdder.OrderLines.map((orderLine) => {
          const currentProduct = fetchedOrdder.OrderLines.find(
            (item) => item.id === orderLine.id,
          )!.Product;

          return prisma.product.update({
            where: { id: orderLine.productId },
            data: {
              stockQuantity: currentProduct!.stockQuantity - orderLine.quantity,
            },
          });
        }),
      );
      console.log(updatedProducts);

      // once all the product are updated notify the user
      const notification = await prisma.notification.create({
        data: {
          about: 'Order Was Accepted',
          message: `The owner of the shop accepted the order with id ${fetchedOrdder.id} you made the ${fetchedOrdder.createdAt}`,
          readed: false,
          user: {
            connect: {
              id: fetchedOrdder.userId,
            },
          },
        },
      });

      console.log(notification);
      return h.response().code(204);
    } catch (error) {
      console.log(error);
      return Boom.badImplementation('error occured', {
        error: {
          message: error.message,
        },
      });
    }
  },
};
