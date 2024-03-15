import Fastify from 'fastify';
import mercurius from 'mercurius';
import schema from './graphql';
import { AppContext } from './graphql/@types/context';
import { logger } from '@blogs/utils';
import { graphqlLogger, verifyLocalAuth } from '@blogs/graphql';
import { prismaClient, redisClient } from '@blogs/database';
import { config } from 'dotenv';
import { AuthenticationService } from './graphql/modules/authentication/authentication.service';
import cors from '@fastify/cors';

config();

const host = '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3030;

export async function main() {
  const server = Fastify();

  await server.register(cors, {
    origin: '*',
  });

  await server.register(mercurius, {
    graphiql: false,
    ide: false,
    path: '/graphql',
    schema,
    errorFormatter(execution, context) {
      const defaultError = mercurius.defaultErrorFormatter(execution, context);
      logger.error({
        service: 'Backend',
        ...defaultError,
      });
      return defaultError;
    },
    async context(request): Promise<AppContext> {
      const graphqlContext = {
        accountId: '',
        authorization: request.headers['authorization']?.replace(
          'Bearer ',
          ''
        ) as string,
      };
      const token = request.headers['authorization']?.replace('Bearer ', '') ?? null;
      if (token) {
        const localAuth = await verifyLocalAuth(token);
        graphqlContext.accountId = localAuth.accountId;
      }

      return {
        ...graphqlContext,
        authenticationService: new AuthenticationService(graphqlContext),
      };
    },
  });

  server.graphql.addHook('preExecution', graphqlLogger('Backend'));

  async function gracefulShutdown() {
    await server.close();
    redisClient.disconnect();
    await prismaClient.$disconnect();
    process.exit(1);
  }

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  server.listen({ port, host }, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    } else {
      logger.info(`[ Backend Ready ] http://${host}:${port}`);
    }
  });
}
