import { redisClient } from '@blogs/database';
import { AuthenticationError } from '../errors/authentication';
import { GraphqlContext } from './@types';
import { IJwtAuthInfo, jwtVerify } from '@blogs/utils';

export async function verifyLocalAuth(
  token: string | null
): Promise<GraphqlContext> {
  if (!token) {
    return {
      accountId: null,
      authorization: null,
    };
  }
  const { isValid, userInfo } = jwtVerify(token.replace('Bearer ', ''));
  if (!isValid || !userInfo) {
    return {
      accountId: null,
      authorization: null,
    };
  }
  const cacheAccountInfo = await redisClient.get(token);
  if (cacheAccountInfo) {
    const account = JSON.parse(cacheAccountInfo) as IJwtAuthInfo;
    return {
      authorization: token,
      accountId: account.accountId,
    };
  }
}
