import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { CreateShopInputSchema } from '../../../validations/shopValidations';

export default {
  createShop: async (request:Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const { activeUser } = request.auth.credentials;
    const payload = request.payload as any;
    console.log('start creation shop');
    // check if the authenticated user is the owner
    if (!activeUser.isOwner) {
      return Boom.forbidden('only shop owner can add products, contact our service if you are the owner');
    }
    // validate payload
    const { error } = CreateShopInputSchema.validate(payload);
    if (error) {
      return Boom.badRequest(' the payload of the request is not correct see error: ', error);
    }

    // if payload is check if user already has a shop
    const existingShop = await prisma.shop.findUnique({
      where: { userId: activeUser.id },
    });
    if (existingShop) {
      return Boom.badRequest('you cannot create more than one shop', {
        error: {
          message: 'you own already a shop',
        },
      });
    }

    // all constraints satisfy
    try {
      const createdShop = await prisma.shop.create({
        data: {
          name: payload.name,
          phoneNumber: payload.phoneNumber,
          address_city: payload.addressCity,
          address_street: payload.addressStreet,
          address_country: payload.addressCountry,
          address_zipCode: payload.addressZipCode,
          currency: payload.currency,
          user: {
            connect: {
              id: activeUser.id,
            },
          },
        },
      });

      console.log(`the following shop: ${createdShop} was created`);
      return h.response({
        data: {
          shop: createdShop,
        },
      }).code(201);
    } catch (dBerror) {
      return Boom.badImplementation(`
        an error occured while processing the request try again or contact support. The following error occured : ${dBerror}`);
    }
  },

};
