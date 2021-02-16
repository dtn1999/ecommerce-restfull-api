/* eslint-disable import/prefer-default-export */
import Joi from '@hapi/joi';

export const CreateOrderSchema = Joi.object({
  cart: Joi.array().min(1).single({
    productId: Joi.number().required(),
    quantity: Joi.number().greater(0).required(),
  }),
});
