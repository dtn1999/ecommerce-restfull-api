import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { Order, OrderLine } from '@prisma/client';
import { CreateOrderSchema } from '../../../validations/orderValidations';
import { CreateOrderPayload } from '../../../models/orders';

type ProcessedCartItem ={
    productId: number,
    quantity: number,
    oldStockQuantity: number,
    newStockQuantity: number
}

export default {
  createOrder: async (request:Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const { activeUser } = request.auth.credentials;
    const payload = request.payload as CreateOrderPayload;

    const { error } = CreateOrderSchema.validate(payload);
    // validate payload
    if (error) {
      return Boom.badRequest(' the payload of the request is not correct see error: ', error);
    }

    // some global variables

    let createOrder:Order; // the new created order
    let createdOrderLines:OrderLine[] = [];
    let processedCartItems:ProcessedCartItem[] = [];

    // 1 check if the product in the cart really exist
    try {
      processedCartItems = await Promise.all(payload.cart.map(async (cartItem:any) => {
        const product = await prisma.product.findUnique({
          where: { id: cartItem.productId },
        });
        if (!product) {
          throw new Error(`NO_PRODUCT=${cartItem.productId}`);
        }

        return {
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          oldStockQuantity: product.stockQuantity,
          newStockQuantity: product.stockQuantity - cartItem.quantity,
        };
      }));
    } catch (errorTotalComputation) {
      const parts = errorTotalComputation.message.split('=');
      if (parts[0] === 'NO_PRODUCT') {
        return Boom.badRequest('error occured', {
          error: {
            message: `The product with Id ${parts[1]} doesn't exist`,
          },
        });
      }
      return Boom.badRequest('error occured', {
        error: {
          message: errorTotalComputation.message,
        },
      });
    }
    // 2 create order
    try {
      // create Order entity
      createOrder = await prisma.order.create({
        data: {
          status: 'CREATED',
          User: {
            connect: {
              id: activeUser.id,
            },
          },
        },
      });
    } catch (errorOrderCreation) {
      console.log(errorOrderCreation);
      return Boom.badImplementation('error occured', {
        error: {
          message: errorOrderCreation.message,
        },
      });
    }

    // 3 create order lines
    try {
      createdOrderLines = await Promise.all(
        processedCartItems.map(async (orderLine) => {
          console.log(orderLine);

          // check if the quantity if greater than 0

          if (orderLine.newStockQuantity < 0) {
            throw Error(`PRODUCT_NOT_IN_STOCK=${orderLine.productId}`);
          }
          // create order lines
          return prisma.orderLine.create({
            data: {
              Order: {
                connect: {
                  id: createOrder.id,
                },
              },
              Product: {
                connect: {
                  id: orderLine.productId,
                },
              },
              quantity: orderLine.quantity,
            },
          });
        }),
      );
      return h.response({
        data: {
          order: {
            ...createOrder,
            orderLines: createdOrderLines,
          },
        },
      }).code(201);
    } catch (errorOrderLineCreation) {
      const parts = errorOrderLineCreation.message.split('=');
      if (parts[0] === 'PRODUCT_NOT_IN_STOCK') {
        await prisma.order.delete({
          where: {
            id: createOrder.id,
          },
        });
        return Boom.badRequest('error occured', {
          error: {
            message: `The product with Id ${parts[1]} not availaible for the required quantity`,
          },
        });
      }
      return Boom.badImplementation('error occured', {
        error: {
          message: errorOrderLineCreation.message,
        },
      });
    }
  },
};
