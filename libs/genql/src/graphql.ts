import { createClient } from './generated';
import { fetch } from 'undici';
import { config } from 'dotenv';
config();

export const client = createClient({
  url: process.env.GRAPHQL_ENDPOINT,
  fetch,
});

export const createAuthorizeClient = (authorization: string) =>
  createClient({
    url: process.env.GRAPHQL_ENDPOINT,
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
