import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';

export default {
  deleteProductById: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    const productId = parseInt(request.params.productId, 10);
    // check if request parameter correct
    if (Number.isNaN(productId)) {
      return Boom.badRequest('the request you send to the server must be a number', {
        error: {
          message: `${request.params.productId} could not be parse into a number`,
        },
      });
    }
    // get prisma
    const { prisma } = request.server.app;

    try {
      await prisma.product.delete({
        where: { id: productId },
      });
      return h.response({ data: { success: true } }).code(201);
    } catch (error) {
      return Boom.badImplementation('Error occured ', {
        error,
      });
    }
  },
};
