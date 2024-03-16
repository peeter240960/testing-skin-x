import { createClient } from './generated';
import { fetch } from 'undici';

export const client = createClient({
  url: 'http://0.0.0.0:3000/graphql',
  fetch,
});

export const createAuthorizeClient = (authorization: string) =>
  createClient({
    url: 'http://0.0.0.0:3000/graphql',
    fetch,
    headers: {
      authorization,
    },
  });

export async function authorizeGraphqlClient() {
  const loginResponse = await client.mutation({
    login: {
      __scalar: true,
      __args: {
        username: 'user',
        password: 'user@1234',
      },
    },
  });
  return createAuthorizeClient(loginResponse.login.token);
}
