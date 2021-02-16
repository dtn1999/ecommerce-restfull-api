export type OrderLine ={
    quantity: number
    productId: number
}

export type Order ={
    total: number
    status: string
}

export type CreateOrderPayload = {
    cart: OrderLine[]
}
