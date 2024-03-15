import { AuthenticationError } from '../errors/authentication';
import { ForbiddenError } from '../errors/forbidden';
import { GraphqlContext } from './@types';
import { IJwtAuthInfo, jwtVerify } from '@blogs/utils';
import { prismaClient, redisClient } from '@blogs/database';

type GetAccountInfoPayload = {
  token: string;
  accountId: string;
};

async function getAccountInfo({ token, accountId }: GetAccountInfoPayload): Promise<IJwtAuthInfo> {
  const accountInfo = await redisClient.get(token);

  if (accountInfo) {
    return JSON.parse(accountInfo);
  }

  const account = await prismaClient.account.findUnique({
    select: {
      id: true,
    },
    where: {
      id: accountId,
    },
  });

  if (!account) {
    throw new AuthenticationError('Invalid token');
  }


  const accountInfoResult = {
    accountId: account.id,
  };

  await redisClient.set(token, JSON.stringify(accountInfoResult));

  return accountInfoResult;
}

type ValidateLocalPayload = {
  projectId?: string;
  token: string;
};

export async function verifyLocalAuth({ projectId, token }: ValidateLocalPayload): Promise<GraphqlContext> {
  if (!token && !!projectId) {
    throw new ForbiddenError('Your operation is not allow');
  }

  if (!token) {
    return {
      accountId: null,
      authorization: null,
    };
  }

  const { isValid, userInfo } = jwtVerify(token.replace('Bearer ', ''));

  if (!isValid || !userInfo) {
    throw new AuthenticationError('Invalid token');
  }

  const accountInfo = await getAccountInfo({
    token,
    accountId: userInfo.accountId,
  });

  return {
    authorization: token,
    accountId: accountInfo.accountId,
  };
}
