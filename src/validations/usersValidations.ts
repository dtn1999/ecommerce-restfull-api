import Joi from '@hapi/joi';
import { TUser } from '../models';

const createUserPayloadSchema = Joi.object<TUser>().keys({
  lastName: Joi.string(),
  firstName: Joi.string(),
  email: Joi.string().email().required(),
});
const UserIdParamSchema = Joi.object({
  userId: Joi.string().pattern(/^\d+$/),
});
export { createUserPayloadSchema, UserIdParamSchema };
