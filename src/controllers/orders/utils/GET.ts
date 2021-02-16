import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { formatApiErrorResponse } from '../../category';

export default {
  getOrderById: async (request: Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const { activeUser } = request.auth.credentials;
    // request parameter
    const orderId = parseInt(request.params.orderId, 10);
    // check if param correct
    if (Number.isNaN(orderId) && orderId > 0) {
      return Boom.badRequest('the request param you send to the server must be a positive number', {
        error: {
          message: `${request.params.orderId} could not be parse into a number`,
        },
      });
    }
    // get all orders
    try {
      const order = (await prisma.order.findMany({
        where: { userId: activeUser.id },
        include: {
          OrderLines: true,
        },
      })).find((ord) => ord.id === orderId);
      return h.response({
        data: {
          order,
        },
      }).code(200);
    } catch (error) {
      const apiError = Boom.badImplementation('error while fetching orders', {
        error,
      });
      return formatApiErrorResponse(apiError, h);
    }
  },
  getAllOrders: async (request: Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const { activeUser } = request.auth.credentials;
    // get user shop
    try {
      const orders = await prisma.order.findMany({
        where: { userId: activeUser.id },
        include: {
          OrderLines: true,
        },
      });
      return h.response({
        data: {
          orders,
        },
      }).code(200);
    } catch (error) {
      const apiError = Boom.badImplementation('error while fetching orders', {
        error,
      });
      return formatApiErrorResponse(apiError, h);
    }
  },
  getAllOrdersAdmin: async (request: Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const { activeUser } = request.auth.credentials;
    // check if the authenticated user is the owner
    if (!activeUser.isOwner) {
      return Boom.forbidden('only shop owner can  get all orders');
    }
    // get user shop
    try {
      const orders = await prisma.order.findMany({
        include: {
          OrderLines: true,
          User: true,
        },
      });
      return h.response({
        data: {
          orders,
        },
      }).code(200);
    } catch (error) {
      const apiError = Boom.badImplementation('error while fetching orders', {
        error,
      });
      return formatApiErrorResponse(apiError, h);
    }
  },
};
