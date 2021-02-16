export type TUser= {
    email: string
    firstName: string
    lastName: string
    social?: {
        facebook?: string
        tweeter?: string
        github?: string
        tiktok?: string
    }
}

export type DBUser = {
    id: number
} & TUser
