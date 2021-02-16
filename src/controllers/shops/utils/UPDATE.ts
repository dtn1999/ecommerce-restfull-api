import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { UpdateShopInputSchema } from '../../../validations/shopValidations';

export default {
  updateShop: async (request:Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const { activeUser } = request.auth.credentials;
    const payload = request.payload as any;

    // check if the authenticated user is the owner
    if (!activeUser.isOwner) {
      return Boom.forbidden('only shop owner can add products, contact our service if you are the owner');
    }

    // validate payload
    const { error } = UpdateShopInputSchema.validate(payload);
    if (error) {
      return Boom.badRequest(' the payload of the request is not correct see error: ', error);
    }

    // if payload is check if user already has a shop
    const existingShop = await prisma.shop.findUnique({
      where: { userId: activeUser.id },
    });

    if (!existingShop) {
      return Boom.badRequest('you have no shop yet', {
        error: {
          message: 'shop doesn\'t exist',
        },
      });
    }

    // all constraints satisfy
    try {
      const updatedShop = await prisma.shop.update({
        data: {
          name: payload.name || existingShop.name,
          phoneNumber: payload.phoneNumber || existingShop.phoneNumber,
          currency: payload.currency || existingShop.currency,
          address_city: payload.addressCity || existingShop.address_city,
          address_street: payload.addressStreet || existingShop.address_street,
          address_country: payload.addressCountry || existingShop.address_country,
          address_zipCode: payload.addressZipCode || existingShop.address_zipCode,
        },
        where: {
          id: existingShop.id,
        },
      });

      console.log(`the following shop: ${updatedShop} was updated`);
      return h.response({
        data: {
          shop: updatedShop,
        },
      }).code(204);
    } catch (dBerror) {
      return Boom.badImplementation('error occured', {
        error: dBerror,
      });
    }
  },
};
