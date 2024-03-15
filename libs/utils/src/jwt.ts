import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';
config();

const secret = process.env.JWT_SECRET as string;
const issuer = process.env.JWT_ISSER as string;

export interface IJwtAuthInfo extends jwt.JwtPayload {
  accountId: string;
}

export const sign = ({
  payload,
  expiresIn = '2d',
}: {
  payload: IJwtAuthInfo;
  expiresIn?: string | number;
}): string => {
  return jwt.sign(payload, secret, { expiresIn, issuer });
};

export const verify = <T extends IJwtAuthInfo & { exp: number }>(
  token?: string
) => {
  try {
    if (!token) {
      return { isValid: false };
    }

    const userInfo = jwt.verify(token, secret, { issuer }) as T;

    return { isValid: true, userInfo, expires: userInfo.exp };
  } catch (err) {
    return { isValid: false };
  }
};
