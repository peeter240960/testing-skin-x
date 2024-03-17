import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
  FetchResult,
  ServerError,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLError } from 'graphql';
import { clearStorage, getStorage, setStorage } from '../utils';
import { AUTH_KEY } from '../auth/const';
import { RefreshTokenDocument, RefreshTokenMutation } from './generated';

export const apolloCache = new InMemoryCache({});
export const apolloClient = () => {
  const errorLink = onError(({ networkError, operation, forward }) => {
    const networkErrors = networkError as ServerError;
    if (networkErrors?.statusCode === 401) {
      if (operation.operationName === 'refreshToken') return;

      const observable = new Observable<FetchResult<Record<string, unknown>>>(
        (observer) => {
          (async () => {
            try {
              const refreshToken =
                JSON.parse(getStorage(AUTH_KEY) || '{}')?.refreshToken || '';

              const accessToken = await callRefreshToken(refreshToken);
              if (!accessToken)
                throw new GraphQLError('Invalid or expire token!');

              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };

              forward(operation).subscribe(subscriber);
            } catch (err) {
              observer.error(err);
            }
          })();
        }
      );

      return observable;
    }
  });
  const getAuthContext = (operationName?: string) => {
    const auth = JSON.parse(getStorage(AUTH_KEY) || '{}')
    const token = auth?.token || '';

    return {
      authorization: token,
    };
  };

  const authLink = setContext((operation, { headers }) => {
    return {
      headers: {
        ...headers,
        ...getAuthContext(operation.operationName),
      },
    };
  });

  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
    headers: getAuthContext(),
  });

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: apolloCache,
  });

  const callRefreshToken = async (refreshToken: string) => {
    try {
      const refreshTokenResponse =
        await apolloClient.mutate<RefreshTokenMutation>({
          mutation: RefreshTokenDocument,
          variables: {
            refreshToken,
          },
        });
      if (refreshTokenResponse.data) {
        setStorage(AUTH_KEY, JSON.stringify(refreshTokenResponse.data.refreshToken));
      }
      return refreshTokenResponse.data?.refreshToken.token ?? '';
    } catch (err) {
      clearStorage();
      window.location.reload();
      throw err;
    }
  };

  return apolloClient;
};
const client = apolloClient();
export default client;
