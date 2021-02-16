import Joi from '@hapi/joi';

export const CreateShopInputSchema = Joi.object({
  name: Joi.string().required(),
  addressCity: Joi.string().required(),
  addressCountry: Joi.string().required(),
  addressStreet: Joi.string().required(),
  addressZipCode: Joi.number().required(),
  currency: Joi.string().equal('€').equal('$').optional(),
  phoneNumber: Joi.string().required(),
});
export const UpdateShopInputSchema = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().optional(),
  addressCity: Joi.string().optional(),
  addressCountry: Joi.string().optional(),
  addressStreet: Joi.string().optional(),
  addressZipCode: Joi.number().optional(),
  currency: Joi.string().equal('USD').equal('EUR').optional(),
  phoneNumber: Joi.string().optional(),
});
/**
 * model Shop {
    id Int @default( autoincrement() ) @id
    name String
    address_street String
    address_city String
    address_country String
    address_zipCode Int
    userId Int
    user User @relation(fields: [userId], references:[id])

    products Product[]

}

*/
export const CreateProductInputSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  stockQuantity: Joi.number().required(),
  unitPrice: Joi.number().required(),
  category: Joi.string().required(),
  images: Joi.array().min(1).max(4).required(),
});

export const UpdateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  stockQuantity: Joi.number().optional(),
  unitPrice: Joi.number().optional(),
  category: Joi.string().optional(),
  images: Joi.array().min(1).max(4).optional(),
});

/*
model Product {
  id Int @default( autoincrement()) @id
  name String
  description String
  stockQuantity Int
  unitPrice Float
  imageUrl String
  shopId Int
  shop Shop @relation( fields:[shopId], references:[id])

  reviews Review[]
}

 *
 *
 *
 */
