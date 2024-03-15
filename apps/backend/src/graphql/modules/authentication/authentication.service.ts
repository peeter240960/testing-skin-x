import { PrimaryRepository } from '@blogs/database';

import { GraphqlContext } from '@blogs/graphql';
import { verify } from 'argon2';
import { IJwtAuthInfo, jwtSign, jwtVerify } from '@blogs/utils';
import { MutationLoginArgs } from '../../codegen-generated';

const ONE_HOUR_IN_SECONDS = 3600;
const ONE_DAY_IN_SECONDS = 86400;

export class AuthenticationService extends PrimaryRepository<GraphqlContext> {
  async login(input: MutationLoginArgs) {
    const account = await this.db.account.findFirst({
      where: {
        username: input.username,
      },
    });

    if (!account) {
      throw new Error('wrong username or password');
    }

    const isCorrectPassword = await verify(account.password, input.password);

    if (!isCorrectPassword) {
      throw new Error('wrong username or password');
    }

    const payload = {
      accountId: account.id,
    };

    const token = jwtSign({
      payload,
      expiresIn: '1h',
    });

    const refreshToken = jwtSign({
      payload,
      expiresIn: '1d',
    });

    await Promise.all([
      this.redis.set(token, JSON.stringify(payload), 'EX', ONE_HOUR_IN_SECONDS),
      this.redis.set(
        refreshToken,
        JSON.stringify(payload),
        'EX',
        ONE_DAY_IN_SECONDS
      ),
    ]);

    return {
      account,
      token,
      refreshToken,
      expire: jwtVerify(token).expires.toString(),
      expireRefreshToken: jwtVerify(refreshToken).expires.toString(),
    };
  }

  async refreshToken(refreshToken: string) {
    const cacheAccount = await this.redis.get(refreshToken);
    if (!cacheAccount) throw new Error('Invalid token');
    const payload = JSON.parse(cacheAccount) as IJwtAuthInfo;

    const newToken = jwtSign({
      payload,
      expiresIn: '1h',
    });

    const newRefreshToken = jwtSign({
      payload,
      expiresIn: '1d',
    });

    await Promise.all([
      this.redis.set(
        newToken,
        JSON.stringify(payload),
        'EX',
        ONE_HOUR_IN_SECONDS
      ),
      this.redis.set(
        refreshToken,
        JSON.stringify(payload),
        'EX',
        ONE_DAY_IN_SECONDS
      ),
    ]);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      expire: jwtVerify(newToken).expires.toString(),
      expireRefreshToken: jwtVerify(newRefreshToken).expires.toString(),
    };
  }

  async logout(refreshToken: string) {
    const result = await Promise.all([
      this.redis.del(refreshToken),
      this.redis.del(this.context.authorization),
    ]);
    return result;
  }
}
