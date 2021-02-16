import Hapi from '@hapi/hapi';
import { notificationController } from '../controllers';
import { API_AUTH_STRATEGEY } from '../models/auth';

const notificationPlugin:Hapi.Plugin<undefined> = {
  name: 'app/notifications',
  dependencies: ['app/prisma', 'hapi-auth-jwt2'],
  register: async (server:Hapi.Server) => {
    server.route([
      {
        path: '/notifications',
        method: 'GET',
        handler: notificationController.getAllNotifications,
        options: {
          auth: {
            mode: 'optional',
          },
        },
      },
      {
        path: '/notifications',
        method: 'POST',
        handler: notificationController.getAllNotifications,
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

export default notificationPlugin;
