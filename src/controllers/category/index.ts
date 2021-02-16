import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

export type APIERROR = {
  error : any
}

export default {
  createCategory: async (request: Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const payload = request.payload as any;
    const { activeUser } = request.auth.credentials;
    // check if the authenticated user is the owner
    if (!activeUser.isOwner) {
      return Boom.forbidden('only shop owner can add products, contact our service if you are the owner');
    }

    try {
      const existingCategory = await prisma.category.findUnique({
        where: { name: payload.name },
      });
      if (existingCategory) {
        const apiResponse = Boom.badRequest<APIERROR>('following error occured ', {
          error: {
            message: 'The category you want to create already exist',
          },
        });
        return h.response({
          message: apiResponse.message,
          ...apiResponse.data,
        }).code(apiResponse.output.statusCode);
      }
      const category = await prisma.category.create({
        data: {
          name: payload.name,
        },
      });
      return h.response({ data: { category } }).code(201);
    } catch (error) {
      console.log(error);
      const apiResponse = Boom.badImplementation<APIERROR>('following error occured ', {
        error: {
          message: error.message,
        },
      });
      return formatApiErrorResponse(apiResponse, h);
    }
  },
  /*  */
  updateCategory: async (request: Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const { activeUser } = request.auth.credentials;
    const categoryId = parseInt(request.params.categoryId, 10);
    // check if the request parameter is correct
    if (Number.isNaN(categoryId)) {
      const apiResponse = Boom.badRequest<APIERROR>('the request you send to the server must be a number', {
        error: {
          message: `${request.params.categoryId} could not be parse into a number`,
        },
      });
      return formatApiErrorResponse(apiResponse, h);
    }
    const payload = request.payload as any;
    // check if the authenticated user is the owner
    if (!activeUser.isOwner) {
      return Boom.forbidden('only shop owner can add products, contact our service if you are the owner');
    }

    // update category
    try {
      const category = await prisma.category.update({
        data: {
          name: payload.name,
        },
        where: { id: categoryId },
      });
      return h.response({ data: { category } }).code(204);
    } catch (error) {
      const apiResponse = Boom.badImplementation<APIERROR>('following error occured ', {
        error: {
          message: error,
        },
      });
      return h.response({
        message: apiResponse.message,
        ...apiResponse.data,
      }).code(apiResponse.output.statusCode);
    }
  },
  /*  */
  getAllCategories: async (request: Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    try {
      const categories = await prisma.category.findMany({
        include: {
          products: true,
        },
      });
      return h.response({
        data: {
          categories,
        },
      }).code(200);
    } catch (error) {
      const apiError = Boom.badImplementation<APIERROR>('following error occured ', {
        error: {
          message: error,
        },
      });
      return formatApiErrorResponse(apiError, h);
    }
  },
};

export function formatApiErrorResponse(boomData:any, h:Hapi.ResponseToolkit) {
  return h.response({
    message: boomData.message,
    ...boomData.data,
  }).code(boomData.output.statusCode);
}
