import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

export default {
  getShop: async (request: Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;

    // get user shop
    try {
      const shop = await prisma.shop.findMany({
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });
      return h.response({
        data: {
          shop: shop[0],
        },
      }).code(200);
    } catch (error) {
      return Boom.badImplementation('error while fetching shop', {
        error,
      });
    }
  },
};
