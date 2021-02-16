export const JWT_SECRET = process.env.JWT_SECRET || 'THIS IS A RANDOM SECRET TOKEN ADD YOUR OWN';
export const API_AUTH_STRATEGEY = 'API';
export const JWT_ALGORITHM = 'HS256';

export const EMAIL_TOKEN_EXPIRATION_MINUTE = 10;
export const AUTHENTICATION_TOKEN_EXPRIRATION_HOURS = 12;

export type APITokenPayload = {
    tokenId: number,
    iat: string,
    exp: string
}

export type LoginInput = {
    email: string
}

export type AuthenticateInput= {
    email: string,
    emailToken: string
}
