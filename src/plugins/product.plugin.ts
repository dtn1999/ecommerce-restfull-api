/* eslint-disable no-return-assign */
import Hapi from '@hapi/hapi';
import { productController } from '../controllers';
import { API_AUTH_STRATEGEY } from '../models/auth';

const productPlugin: Hapi.Plugin<undefined> = {
  name: 'app/products',
  dependencies: ['app/prisma', 'hapi-auth-jwt2'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        path: '/products',
        method: 'GET',
        handler: productController.getAllProducts,
        options: {
          auth: {
            mode: 'optional',
          },
        },
      },
      {
        path: '/products/{productId}',
        method: 'GET',
        handler: productController.getProductById,
        options: {
          auth: {
            mode: 'optional',
          },
        },
      },
      {
        path: '/products/{productId}',
        method: 'DELETE',
        handler: productController.deleteProductById,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
      {
        path: 'products/{productId}',
        method: 'PUT',
        handler: productController.updateProduct,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
      },
      {
        path: '/products',
        method: 'POST',
        handler: productController.createProduct,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
          payload: {
            multipart: {
              output: 'stream',
            },
            maxBytes: 4048576,
          },
        },
      },
      {
        path: '/images/{productId}',
        method: 'POST',
        handler: productController.uploadProductImage,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
          payload: {
            multipart: {
              output: 'stream',
            },
            maxBytes: 4048576,
          },
        },
      },
    ]);
  },
};

export default productPlugin;
