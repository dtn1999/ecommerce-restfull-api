import Boom from '@hapi/boom';
import { Product } from '@prisma/client';
import Hapi from '@hapi/hapi';
import { UPLOAD_PATH } from '../../../server';
import { FileDetails, imageFilter, imageUploader } from '../../../utils/handleFileUpload';
import { UpdateProductSchema } from '../../../validations/shopValidations';

type DBImageUpdate = {
    url: string,
    mimetype: string,
    originalName: string,
    size:number,
    oldUrl: string
}
export default {
  updateProduct: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    const payload = parseRequestPayload(request.payload);
    const productId = parseInt(request.params.productId, 10);
    // check if request parameter correct
    if (Number.isNaN(productId)) {
      return Boom.badRequest('the request you send to the server must be a number', {
        error: {
          message: `${request.params.productId} could not be parse into a number`,
        },
      });
    }
    // get active owner
    const { activeUser } = request.auth.credentials;

    // get prisma
    const { prisma } = request.server.app;

    // check if the authenticated user is the owner
    if (!activeUser.isOwner) {
      return Boom.forbidden('only shop owner can add products, contact our service if you are the owner');
    }
    // validate the payload of the user
    const { error: payloadError } = UpdateProductSchema.validate(payload);
    // check if any error on the payload
    if (payloadError) {
      return Boom.badRequest('The payload you gave is not correct', {
        error: payloadError,
      });
    }

    // check if the product exist
    let product:Product | null;
    try {
      product = await prisma.product.findUnique({
        where: { id: productId },
      });

      // check if product really exist
      if (!product) {
        return Boom.badRequest('The product you try to update doesn\'t exist', {
          error: {
            message: `the product with id ${productId} doesn't exist`,
          },
        });
      }

      // if product exist try to update
      // upload first the new images
      let imageDetails:DBImageUpdate[];
      try {
        imageDetails = await Promise.all(
          payload.images.map(async (imageFile:any) => {
            const fileDetails = await imageUploader(imageFile.new, {
              dest: `${UPLOAD_PATH}/`,
              fileFilter: imageFilter,
            }) as FileDetails;
            return {
              url: `${request.url.origin}/uploads/${fileDetails.filename}`,
              mimetype: fileDetails.mimetype,
              originalName: fileDetails.originalName,
              size: fileDetails.size,
              oldUrl: imageFile.old,
            };
          }),
        );
      } catch (uploadsError) {
        return Boom.badImplementation('An error occured while uploading files to the server', {
          error: uploadsError,
        });
      }

      // if no error then update the images
      const updatedProduct = await prisma.product.update({
        data: {
          category: {
            update: {
              name: payload.category,
            },
          },
          description: payload.description,
          name: payload.name,
          stockQuantity: payload.stockQuantity,
          unitPrice: payload.unitPrice,
        },
        where: { id: product.id },
      });

      // update images associated
      const productImages = await Promise.all(
        imageDetails.map(async (image) => prisma.productImages.update({
          data: {
            ...image,
            product: {
              connect: {
                id: product!.id,
              },
            },
          },
          where: { url: image.oldUrl },
        })),
      );
      return h.response({
        data: {
          product: {
            ...updatedProduct,
            images: productImages,
          },
        },
      });
    } catch (errorProduct) {
      return Boom.badImplementation('An error occurecd while creating the product', {
        errorProduct,
      });
    }
  },
};

const parseRequestPayload = (payload:any) => {
  const result = {
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
