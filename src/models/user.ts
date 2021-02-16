export type TUser= {
    email: string
    firstName: string
    lastName: string
}

export type DBUser = {
    id: number,
    isOwner: boolean,
    shopId?: number
} & TUser
