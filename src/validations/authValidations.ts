import Joi from '@hapi/joi';

const LoginInputSchema = Joi.object({
  email: Joi.string().email().required(),
  lastName: Joi.string().optional(),
  firstName: Joi.string().optional(),
});
const AuthenticateInputSchema = Joi.object({
  email: Joi.string().email().required(),
  emailToken: Joi.string().alphanum(),
});

const apiTokenSchema = Joi.object({
  tokenId: Joi.number().integer().required(),
  iat: Joi.any(),
  exp: Joi.any(),
});

export {
  LoginInputSchema,
  AuthenticateInputSchema,
  apiTokenSchema,
};
