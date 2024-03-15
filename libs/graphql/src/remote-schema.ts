import { AsyncExecutor, observableToAsyncIterable } from '@graphql-tools/utils';
import { wrapSchema } from '@graphql-tools/wrap';
import { fetch } from 'undici';
import { buildSchema, getOperationAST, GraphQLSchema, OperationTypeNode, print } from 'graphql';
import { createClient } from 'graphql-ws';
import WebSocket from 'ws';

export type ExecuteRemoteSchemaParam = {
  host?: string;
  port?: number;
  graphqlEndpoint?: string;
  supscriptionEndpoint?: string;
  graphqlPath?: string;
  supportWs?: boolean;
};

export const executeRemoteSchema = async ({
  host,
  port,
  graphqlEndpoint,
  supscriptionEndpoint,
  graphqlPath = 'graphql',
  supportWs = false,
}: ExecuteRemoteSchemaParam) => {
  const httpEndpoint = graphqlEndpoint ?? `http://${host}:${port}/${graphqlPath}`;

  let subscriptionClient = null;
  let wsExecutor: AsyncExecutor;

  if (supportWs || supscriptionEndpoint) {
    const wsEndpoint = supscriptionEndpoint ?? `ws://${host}:${port}/${graphqlPath}`;

    subscriptionClient = createClient({
      url: wsEndpoint,
      webSocketImpl: WebSocket,
    });

    wsExecutor = async ({ document, variables, operationName, extensions }) =>
      observableToAsyncIterable({
        subscribe: (observer) => ({
          unsubscribe: subscriptionClient.subscribe(
            {
              query: print(document),
              variables,
              operationName,
              extensions,
            },
            {
              next: (data) => observer.next && observer.next(data as unknown),
              error: (err) => {
                if (!observer.error) return;
                if (err instanceof Error) {
                  observer.error(err);
                } else if (Array.isArray(err)) {
                  // GraphQLError[]
                  observer.error(new Error(err.map(({ message }) => message).join(', ')));
                }
              },
              complete: () => observer.complete && observer.complete(),
            }
          ),
        }),
      });
  }

  const httpExecutor: AsyncExecutor = async ({ document, variables, operationName, extensions, context }) => {
    const query = typeof document === 'string' ? document : print(document);
    const headers = {
      'Content-Type': 'application/json',
      ...(context?.clientId && { clientId: context?.clientId }),
      ...(context?.permissions?.length > 0 && {
        permissions: context?.permissions,
      }),
      ...(context?.accountId && { 'x-account-id': context?.accountId }),
      ...(context?.projectId && { 'x-project-id': context?.projectId }),
      ...(context?.role && { role: context?.role }),
      ...(context?.authorization && {
        authorization: context?.authorization,
      }),
      ...(context?.clientIp && {
        'x-client-ip': context?.clientIp,
      }),
    };

    const fetchResult = await fetch(httpEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables, operationName, extensions }),
    });

    return fetchResult.json();
  };

  const executor: AsyncExecutor = async (args) => {
    // fetch schema stiching type from each service
    if ((args.document as unknown as string) === '{ _sdl }') {
      return httpExecutor(args);
    }

    const operation = getOperationAST(args.document, args.operationName ? args.operationName : undefined);

    if (operation?.operation === OperationTypeNode.SUBSCRIPTION && supportWs) {
      return wsExecutor && wsExecutor(args);
    }

    return httpExecutor(args);
  };

  async function fetchRemoteSchema(executor): Promise<GraphQLSchema> {
    const result = await executor({ document: '{ _sdl }' });
    return buildSchema(result.data._sdl);
  }

  const schema = wrapSchema({
    schema: await fetchRemoteSchema(executor),
    executor,
  });

  return schema;
};
