/* eslint-disable no-shadow */
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { TUser } from '../models/user';
import { createUserPayloadSchema, UserIdParamSchema } from '../validations';

export default {
  /**
   * create new user
   */
  createUserHandler: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const payload = request.payload as TUser;
    const { error, errors } = createUserPayloadSchema.validate(payload);
    console.log('error , errors', error, errors);
    if (error || errors) {
      return Boom.badRequest('Make sure the data you gave in the payload of your request are correct');
    }

    try {
      const createdUser = await prisma.user.create({
        data: {
          ...payload,
        },
      });
      console.log(createdUser);
      return h.response({ user: createdUser }).code(201);
    } catch (error) {
      console.log(error.message);
      return Boom.badData('the user you want to create seems to already exist');
    }
  },
  /**
   * get user by his user id
   */
  getUserAllHandler: async (
    request:Hapi.Request,
    h:Hapi.ResponseToolkit,
  ) => {
    const { prisma } = request.server.app;
    try {
      const users = await prisma.user.findMany();
      return h.response({ users }).code(200);
    } catch (error) {
      console.error(error);
      return Boom.badImplementation();
    }
  },

  /**
   * delete user based on his id
   */
  deleteUserByIdHandler: async (
    request:Hapi.Request,
    h:Hapi.ResponseToolkit,
  ) => {
    const { prisma } = request.server.app;
    const { params } = request;
    const { error, errors } = UserIdParamSchema.validate(params);

    if (error || errors) {
      return Boom.badRequest('Make sure the data you gave in the payload of your request are correct');
    }

    const userId = parseInt(params.userId, 10);
    try {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return h.response().code(204);
    } catch (error) {
      return Boom.badImplementation();
    }
  },
  /**
   * get user bases on his id
   */
  getUserByIdHandler: async (
    request:Hapi.Request,
    h:Hapi.ResponseToolkit,
  ) => {
    const { prisma } = request.server.app;
    const { params } = request;
    const { error, errors } = UserIdParamSchema.validate(params);

    if (error || errors) {
      return Boom.badRequest('Make sure the data you gave in the payload of your request are correct');
    }

    const userId = parseInt(params.userId, 10);
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return h.response({ user }).code(200);
    } catch (error) {
      return Boom.badImplementation();
    }
  },
};
