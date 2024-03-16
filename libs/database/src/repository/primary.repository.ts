import { Redis } from 'ioredis';
import { redisClient } from '../clients/redis.client';
import { PrismaClient, prismaClient } from '..';

export interface ICommand {
  readonly sql: string;
  readonly parameters: ReadonlyArray<unknown>;
}

export class PrimaryRepository<Context = never> {
  context: Context;
  protected db: PrismaClient;
  protected redis: Redis;

  constructor(...params: Context extends never ? [] : [Context]) {
    this.context = params[0] as Context;
    this.db = prismaClient;
    this.redis = redisClient;
  }
}
