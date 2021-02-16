import Joi from '@hapi/joi';
import { TUser } from '../models';

const createUserPayloadSchema = Joi.object<TUser>().keys({
  lastName: Joi.string(),
  firstName: Joi.string(),
  email: Joi.string().email().required(),
  social: Joi.object({
    facebook: Joi.string().optional(),
    tweeter: Joi.string().optional(),
    tiktok: Joi.string().optional(),
    website: Joi.string().uri().optional(),
    github: Joi.string().optional(),
  }).optional(),
});
const UserIdParamSchema = Joi.object({
  userId: Joi.string().pattern(/^\d+$/),
});
export { createUserPayloadSchema, UserIdParamSchema };
