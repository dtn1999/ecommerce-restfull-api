import Hapi from '@hapi/hapi';
import { ordersController } from '../controllers';
import { API_AUTH_STRATEGEY } from '../models/auth';

const orderPlugin:Hapi.Plugin<undefined> = {
  name: 'app/orders',
  dependencies: ['app/prisma', 'hapi-auth-jwt2'],
  register: async (server:Hapi.Server) => {
    server.route([
      {
        path: '/orders',
        method: 'GET',
        handler: ordersController.getAllOrders,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
      {
        path: '/orders-admin',
        method: 'GET',
        handler: ordersController.getAllOrdersAdmin,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
      {
        path: '/orders/{orderId}',
        method: 'UPDATE',
        handler: ordersController.getOrderById,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
      {
        path: '/orders-cancel/{orderId}',
        method: 'PUT',
        handler: ordersController.getOrderById,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
      {
        path: '/orders-accept/{orderId}',
        method: 'PUT',
        handler: ordersController.getOrderById,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
      {
        path: '/orders',
        method: 'POST',
        handler: ordersController.createOrder,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
    ]);
  },
};

export default orderPlugin;
