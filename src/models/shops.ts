import { TUser } from './user';

export type TShop = {
    name: string
    phoneNumber: string
    addressStreet: string
    addressCity: string
    addressCountry: string
    addressZipCode: number
  }

export type DBShop = {
    id: number
    product: TProduct[]
} & TShop

export type TProduct= {
    name: string
    description: string
    stockQuantity: number
    unitPrice: number
    category: string
    images : any[]
  }

export type DBProduct ={
      id: number,
      shop: TShop,
      productImages: any[]
  } & TProduct

export type TReview = {
    rating: number,
    comment: string
}

export type DBReview = {
    id: number,
    product: TProduct,
    user: TUser
} & TReview

export type ShopInput = {
    name: string,

}
