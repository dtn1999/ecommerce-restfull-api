import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { APIERROR, formatApiErrorResponse } from '../../category';

export type HandlerParams = {
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
};

export default {
  getAllNotifications: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    // get  Prisma instance
    const { prisma } = request.server.app;
    //
    const { activeUser } = request.auth.credentials;
    // fetch all products
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId: activeUser.id },
      });

      return h.response({
        data: {
          notifications,
          count: notifications.length,
        },
      }).code(200);
    } catch (error) {
      const apiError = Boom.badImplementation<APIERROR>('error occured during transaction', {
        error,
      });
      return formatApiErrorResponse(apiError, h);
    }
  },
};
