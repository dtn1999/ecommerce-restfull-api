import jwt from 'jsonwebtoken';
import Hapi from '@hapi/hapi';
import { APITokenPayload, JWT_ALGORITHM, JWT_SECRET } from '../models/auth';
import { apiTokenSchema } from '../validations';

export function generateApiToken(tokenId:number) {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
  });
}

// Generate a random 8 digit number as the email token
export function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export async function validateAPIToken(
  decoded: APITokenPayload,
  request:Hapi.Request,
  // eslint-disable-next-line no-unused-vars
  h:Hapi.ResponseToolkit,
) {
  console.log('---------------------start auth validation');
  const { prisma } = request.server.app;
  const { error, errors } = apiTokenSchema.validate(decoded);
  if (error || errors) {
    return { isValid: false };
  }
  const { tokenId } = decoded;
  try {
    const fetchedToken = await prisma.token.findUnique({
      where: {
        id: tokenId,
      },
      include: {
        user: {
          include: {
            Shop: true,
          },
        },
      },
    });
    if (!fetchedToken || !fetchedToken.valid) {
      return {
        isValid: false,
      };
    }

    if (fetchedToken.expiration < new Date()) {
      return {
        isValid: false,
        errorMessage: 'Token expired',
      };
    }
    const { user } = fetchedToken;
    // const get shop owner informations
    const admin = await prisma.admin.findUnique({
      where: { email: user.email },
    });
    // token is still valid
    return {
      isValid: true,
      credentials: {
        tokenId,
        activeUser: {
          ...fetchedToken.user,
          shopId: fetchedToken.user.Shop.length > 0 ? fetchedToken.user.Shop[0].id : undefined,
          isOwner: !!(admin),
        },
      },
    };
  // eslint-disable-next-line no-shadow
  } catch (error) {
    return { isValid: false };
  }
}
