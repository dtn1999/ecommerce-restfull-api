import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

export default {
  cancelOrder: async (request:Hapi.Request, h: Hapi.ResponseToolkit) => {
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

    // get the order
    try {
      const fetchedOrdder = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          OrderLines: {
            include: {
              Product: {
                select: {
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
      // check if the user own the order
      if ((fetchedOrdder.userId !== activeUser.id) || (!activeUser.isOwner)) {
        return Boom.badRequest('you cannot update an order you do not own', {
          error: {
            message: `you don't own the order with id ${orderId} `,
          },
        });
      }
      // set the order status to deleted
      const updatedOrder = await prisma.order.update({
        where: { id: fetchedOrdder.id },
        data: {
          status: 'CANCELLED',
        },
      });

      // if active user is owner notify the user that his order was cancelled
      if (activeUser.isOwner) {
        const notification = await prisma.notification.create({
          data: {
            about: 'Order Was Cancelled',
            message: `The owner of the shop cancelled at ${Date.now()} the order with id ${fetchedOrdder.id} you made the ${fetchedOrdder.createdAt}`,
            readed: false,
            user: {
              connect: {
                id: fetchedOrdder.userId,
              },
            },
          },
        });
        console.log(notification);
      } else {
        const notification = await prisma.notification.create({
          data: {
            about: 'Order Was Cancelled',
            message: `The owner of the shop cancelled at ${Date.now()} the order with id ${fetchedOrdder.id} you made the ${fetchedOrdder.createdAt}`,
            readed: false,
            user: {
              connect: {
                id: fetchedOrdder.OrderLines[0].Product.Shop.userId,
              },
            },
          },
        });
        console.log(notification);
      }
      console.log(updatedOrder);
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
