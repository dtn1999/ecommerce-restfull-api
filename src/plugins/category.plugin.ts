/* eslint-disable no-return-assign */
import Hapi from '@hapi/hapi';
import { categoryController } from '../controllers';
import { API_AUTH_STRATEGEY } from '../models/auth';

const categoryPlugin: Hapi.Plugin<undefined> = {
  name: 'app/categories',
  dependencies: ['app/prisma', 'hapi-auth-jwt2'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        path: '/categories',
        method: 'GET',
        handler: categoryController.getAllCategories,
        options: {
          auth: {
            mode: 'optional',
          },
        },
      },
      {
        path: '/categories/{categoryId}',
        method: 'PUT',
        handler: categoryController.updateCategory,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
      {
        path: '/categories',
        method: 'POST',
        handler: categoryController.createCategory,
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

export default categoryPlugin;
