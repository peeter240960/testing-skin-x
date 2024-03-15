import { config } from 'dotenv';
import { createClient } from './generated';
import { fetch } from 'undici';

config();

export const client = createClient({
  url: process.env.GRAPHQL_ENDPOINT,
  fetch,
});

export const createAuthorizeClient = (
  authorization: string,
  projectId?: string
) =>
  createClient({
    url: process.env.GRAPHQL_ENDPOINT,
    fetch,
    headers: {
      authorization,
    },
  });

export async function authorizeGraphqlClient() {
  const username = `username-${Date.now()}`;

  const account = await client.mutation({
    createAccount: {
      __scalar: true,
      __args: {
        input: {
          username,
          password: '12345678',
        },
      },
    },
  });

  const loginResponse = await client.mutation({
    login: {
      __scalar: true,
      __args: {
        username: account.createAccount.username,
        password: '12345678',
      },
    },
  });
  return createAuthorizeClient(loginResponse.login.token);
}
