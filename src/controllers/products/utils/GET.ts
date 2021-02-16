import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { APIERROR, formatApiErrorResponse } from '../../category';

export type HandlerParams = {
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
};

export default {
  getAllProducts: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    // get  Prisma instance
    const { prisma } = request.server.app;
    let limite:number;
    if (request.query.limite) {
      limite = parseInt(request.query.limite, 10);
      if (Number.isNaN(limite) || limite <= 0) {
        return Boom.badRequest('the limit argument must be valid', {
          error: {
            message: 'limit parameter most be an integer greater than 0',
          },
        });
      }
    } else {
      limite = 10;
    }
    // fetch all products
    try {
      const products = await prisma.product.findMany({
        include: {
          productImages: true,
          category: true,
          reviews: true,
          reductions: true,
          Shop: {
            select: {
              currency: true,
            },
          },
        },
        take: limite,
      });
      const responseProducts = formatProductsResponse(request.url.origin, products);
      return h.response({
        data: {
          products: responseProducts,
          count: responseProducts.length,
        },
      }).code(200);
    } catch (error) {
      return Boom.badImplementation('error occured during transaction', {
        error,
      });
    }
  },

  getProductById: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    // get productId from request
    const productId = parseInt(request.params.productId, 10);
    // check if the request parameter is correct
    if (Number.isNaN(productId)) {
      return Boom.badRequest('the request you send to the server must be a number', {
        error: {
          message: `${request.params.productId} could not be parse into a number`,
        },
      });
    }

    // get prisma
    const { prisma } = request.server.app;
    // fetch product with the given id
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          productImages: true,
          category: true,
          reviews: true,
          Shop: {
            select: {
              currency: true,
            },
          },
        },
      });
      if (!product) {
        throw new Error('NO_PRODUCT_EXCEPTION');
      }

      const responseProduct = formatSingleProductResponse(request.url.origin, product);
      return h.response({
        data: {
          product: {
            ...responseProduct,
          },
        },
      }).code(200);
    } catch (error) {
      if (error.message === 'NO_PRODUCT_EXCEPTION') {
        const apiError = Boom.badImplementation<APIERROR>('following error occured ', {
          error: {
            message: `product with id ${productId} exist`,
          },
        });
        return formatApiErrorResponse(apiError, h);
      }
      const apiError = Boom.badImplementation<APIERROR>('Error occured ', {
        error,
      });
      return formatApiErrorResponse(apiError, h);
    }
  },
};

function formatSingleProductResponse(host:string, product:any) {
  return {
    ...product,
    mainImage: `${host}${product.productImages[0].url}`,
    productImages: product.productImages.map((image:any) => ({ url: `${host}${image.url}` })),
  };
}

function formatProductsResponse(host:string, products:any[]) {
  return products.map((product) => formatSingleProductResponse(host, product));
}
