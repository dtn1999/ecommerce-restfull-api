import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { TProduct } from '../../../models/shops';
import { UPLOAD_PATH } from '../../../server';
import { FileDetails, imageFilter, imageUploader } from '../../../utils/handleFileUpload';
import { CreateProductInputSchema } from '../../../validations/shopValidations';
import { APIERROR, formatApiErrorResponse } from '../../category';

type DBImage = {
    url: string,
    mimetype: string,
    originalName: string,
    size:number,
}
export default {
  createProduct: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    const payload = parseRequestPayload(request.payload);
    const { activeUser } = request.auth.credentials;

    // get prisma
    const { prisma } = request.server.app;

    // check if the authenticated user is the owner
    if (!activeUser.isOwner) {
      return Boom.forbidden('only shop owner can add products, contact our service if you are the owner');
    }
    // validate the payload of the user
    const { error: payloadError } = CreateProductInputSchema.validate(payload);
    // check if any error on the payload
    if (payloadError) {
      console.log(payloadError);
      const apiError = Boom.badRequest<APIERROR>('The payload you gave is not correct', {
        error: payloadError,
      });
      return formatApiErrorResponse(apiError, h);
    }

    // upload all the images to the server
    let imageDetails:DBImage[];
    try {
      imageDetails = await Promise.all(
        payload.images.map(async (imageFile) => {
          const fileDetails = await imageUploader(imageFile, {
            dest: `${UPLOAD_PATH}/`,
            fileFilter: imageFilter,
          }) as FileDetails;
          return {
            url: `/uploads/${fileDetails.filename}`,
            mimetype: fileDetails.mimetype,
            originalName: fileDetails.originalName,
            size: fileDetails.size,

          };
        }),
      );
    } catch (uploadsError) {
      console.log(uploadsError);
      const apiError = Boom.badImplementation<APIERROR>('An error occured while uploading files to the server', {
        error: uploadsError,
      });
      return formatApiErrorResponse(apiError, h);
    }

    // if files are successfully uploaded
    // create the product
    console.log(activeUser);
    try {
      const product = await prisma.product.create({
        data: {
          category: {
            connect: {
              name: payload.category,
            },
          },
          Shop: {
            connect: {
              id: activeUser.shopId,
            },
          },
          description: payload.description,
          name: payload.name,
          stockQuantity: payload.stockQuantity,
          unitPrice: payload.unitPrice,
        },
      });

      // once the product is created , connect with images
      const productImages = await Promise.all(
        imageDetails.map(async (image) => prisma.productImages.create({
          data: {
            ...image,
            product: {
              connect: {
                id: product.id,
              },
            },
          },
        })),
      );
      // return response to the user if no error
      return h.response({
        data: {
          product: {
            ...product,
            images: productImages,
          },
        },
      }).code(201);
    } catch (error) {
      console.log(error);
      const apiError = Boom.badImplementation('An error occurecd while creating the product', {
        error: {
          message: error,
        },
      });
      return formatApiErrorResponse(apiError, h);
    }
  },
  uploadProductImage: async (request:Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const { activeUser } = request.auth.credentials;
    const productId = parseInt(request.params.productId, 10);
    const payload = parseImageUploadRequestPayload(request.payload);

    if (Number.isNaN(productId)) {
      const apiError = Boom.badRequest<APIERROR>('the request you send to the server must be a number', {
        error: {
          message: `${request.params.productId} could not be parse into a number`,
        },
      });
      return formatApiErrorResponse(apiError, h);
    }
    // check if the authenticated user is the owner
    if (!activeUser.isOwner) {
      return Boom.forbidden('only shop owner can add products, contact our service if you are the owner');
    }

    let imageDetails:DBImage[];
    try {
      imageDetails = await Promise.all(
        payload.images.map(async (imageFile:any) => {
          const fileDetails = await imageUploader(imageFile, {
            dest: `${UPLOAD_PATH}/`,
            fileFilter: imageFilter,
          }) as FileDetails;
          return {
            url: `/uploads/${fileDetails.filename}`,
            mimetype: fileDetails.mimetype,
            originalName: fileDetails.originalName,
            size: fileDetails.size,

          };
        }),
      );
    } catch (uploadsError) {
      console.log(uploadsError);
      const apiError = Boom.badImplementation<APIERROR>('An error occured while uploading files to the server', {
        error: uploadsError,
      });
      return formatApiErrorResponse(apiError, h);
    }

    try {
      const productImages = await Promise.all(
        imageDetails.map(async (image) => prisma.productImages.create({
          data: {
            ...image,
            product: {
              connect: {
                id: productId,
              },
            },
          },
        })),
      );
      return h.response({
        data: {
          product: {
            images: productImages,
          },
        },
      });
    } catch (error) {
      console.log(error);
      const apiError = Boom.badImplementation<APIERROR>('An error occurecd while creating the product', {
        error: {
          message: error,
        },
      });
      return formatApiErrorResponse(apiError, h);
    }
  },
};

const parseRequestPayload = (payload:any) => {
  const result:TProduct = {
    name: payload.name,
    category: payload.category,
    description: payload.description,
    stockQuantity: parseInt(payload.stockQuantity, 10),
    unitPrice: parseFloat(payload.unitPrice),
    images: Array.isArray(payload.images) ? payload.images
      : [payload.images],
  };
  return result;
};

const parseImageUploadRequestPayload = (payload:any) => (Array.isArray(payload.images) ? {
  images: payload.images,
} : {
  images: [payload.images],
});
