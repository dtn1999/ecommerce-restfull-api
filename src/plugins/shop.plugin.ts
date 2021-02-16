import Hapi from '@hapi/hapi';
import { shopController } from '../controllers';
import { API_AUTH_STRATEGEY } from '../models/auth';

const shopPlugin:Hapi.Plugin<undefined> = {
  name: 'app/shops',
  dependencies: ['app/prisma', 'hapi-auth-jwt2'],
  register: async (server:Hapi.Server) => {
    server.route([
      {
        path: '/shops',
        method: 'GET',
        handler: shopController.getShop,
        options: {
          auth: {
            mode: 'optional',
          },
        },
      },
      {
        path: '/shops',
        method: 'DELETE',
        handler: shopController.deleteShop,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
      {
        path: '/shops',
        method: 'PUT',
        handler: shopController.updateShop,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
      {
        path: '/shops',
        method: 'POST',
        handler: shopController.createShop,
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

export default shopPlugin;
