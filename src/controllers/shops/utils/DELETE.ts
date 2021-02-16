import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

export default {
  deleteShop: async (request:Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;

    const { activeUser } = request.auth.credentials;
    // check if the authenticated user is the owner
    if (!activeUser.isOwner) {
      return Boom.forbidden('only shop owner can add products, contact our service if you are the owner');
    }

    // check if the user own the shop
    try {
      const existingShop = await prisma.shop.findUnique({
        where: {
          userId: activeUser.id,
        },
      });

      if (!existingShop) {
        return Boom.badRequest('you do not own any shop yet', {
          message: 'you do not own any shop now',
        });
      }
      await prisma.shop.delete({
        where: { userId: activeUser.id },
      });
      return h.response({
        data: {
          success: true,
        },
      }).code(204);
    } catch (error) {
      console.log(error);
      return Boom.badImplementation('error occured ', {
        error,
      });
    }
  },
};
