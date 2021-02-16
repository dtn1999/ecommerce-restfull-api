/* eslint-disable no-shadow */
import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { add } from 'date-fns';
import { generateApiToken, generateEmailToken } from '../auth';
import {
  AuthenticateInput,
  AUTHENTICATION_TOKEN_EXPRIRATION_HOURS,
  EMAIL_TOKEN_EXPIRATION_MINUTE, LoginInput,
} from '../models/auth';
import { AuthenticateInputSchema, LoginInputSchema } from '../validations';

export default {
  loginHandler: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma, sendEmailToken } = request.server.app;
    const payload = request.payload as LoginInput;
    console.log(payload);
    const { errors, error } = LoginInputSchema.validate(payload);
    if (errors || error) {
      return Boom.badRequest('make use you are passing your email in the request payload');
    }
    const emailToken = generateEmailToken();
    const tokenExpiration = add(new Date(), { minutes: EMAIL_TOKEN_EXPIRATION_MINUTE });

    try {
      const createdToken = await prisma.token.create({
        data: {
          emailToken,
          expiration: tokenExpiration,
          tokenType: 'EMAIL',
          user: {
            connectOrCreate: {
              create: {
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
              },
              where: {
                email: payload.email,
              },
            },
          },
        },
      });

      // TODO remove todo after
      console.log(createdToken);
      await sendEmailToken(payload.email, payload.firstName, emailToken);
      return h.response({ data: { success: true } }).code(200);
    } catch (error) {
      console.error(error);
      return Boom.badImplementation(error.message);
    }
  },

  authenticateHandler: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const payload = request.payload as AuthenticateInput;
    const { error, errors } = AuthenticateInputSchema.validate(payload);
    console.log(payload);
    console.log('Authentication');
    if (errors || error) {
      return Boom.badRequest('make use you are passing your email in the request payload');
    }
    const { email, emailToken } = payload;

    try {
      const fetchedEmailToken = await prisma.token.findUnique({
        where: {
          emailToken,
        },
        include: {
          user: true,
        },
      });
      if (!fetchedEmailToken?.valid) {
        return Boom.unauthorized('Invalid token');
      }

      // check expiration
      if (fetchedEmailToken.expiration < new Date()) {
        return Boom.unauthorized('Token has expired');
      }
      if (fetchedEmailToken && fetchedEmailToken.user.email === email) {
        const tokenExpiration = add(new Date(),
          { hours: AUTHENTICATION_TOKEN_EXPRIRATION_HOURS });

        // create new longlive token (to be reference in the jwt payload)
        const createdToken = await prisma.token.create({
          data: {
            tokenType: 'API',
            expiration: tokenExpiration,
            user: {
              connect: {
                email,
              },
            },
          },
        });

        // invalidate email token
        await prisma.token.update({
          where: {
            id: fetchedEmailToken.id,
          },
          data: {
            valid: false,
          },
        });

        // create jwt token
        const authToken = generateApiToken(createdToken.id);
        return h.response({
          accessToken: authToken,
        })
          .code(200)
          .header('Authorization', authToken);
      }
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
    return Boom.notFound('No user found with the given authentication details');
  },

};
