import { client, createAuthorizeClient } from '@blogs/genql';
import { expectUnauthorizedError } from '@blogs/genql';
import { nanoid } from 'nanoid';

describe('Authentication', () => {
  it('login', async () => {
    const username = `username-${nanoid()}`;

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

    expect(loginResponse.login.token).toBeDefined();
    expect(loginResponse.login.refreshToken).toBeDefined();
  });

  it('throws authentication error when login with wrong username', async () => {
    expectUnauthorizedError(
      client.mutation({
        login: {
          __scalar: true,
          __args: {
            username: nanoid(),
            password: '12345678',
          },
        },
      })
    );
  });

  it('throws authentication error when login with correct username but wrong password', async () => {
    const username = `username-${nanoid()}`;

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

    expectUnauthorizedError(
      client.mutation({
        login: {
          __scalar: true,
          __args: {
            username: account.createAccount.username,
            password: '1234567',
          },
        },
      })
    );
  });

  it('throws authentication error when request does not contains authentication token', async () => {
    const randomRefreshToken = `refresh_token-${nanoid()}`;

    expectUnauthorizedError(
      client.mutation({
        refreshToken: {
          __scalar: true,
          __args: {
            refreshToken: randomRefreshToken,
          },
        },
      })
    );
  });

  it('refresh token', async () => {
    const username = `username-${nanoid()}`;

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

    const authorizeClient = createAuthorizeClient(loginResponse.login.token);
    const newToken = await authorizeClient.mutation({
      refreshToken: {
        __scalar: true,
        __args: {
          refreshToken: loginResponse.login.refreshToken,
        },
      },
    });

    expect(newToken.refreshToken.token).toBeDefined();
    expect(newToken.refreshToken.refreshToken).toBeDefined();
    expect(newToken.refreshToken.token).not.toEqual(
      loginResponse.login.refreshToken
    );
    expect(newToken.refreshToken.token).not.toEqual(loginResponse.login.token);
  });

  it('Verify the correct access_token and grant access.', async () => {
    const username = `username-${nanoid()}`;

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
    const authorizeClient = createAuthorizeClient(loginResponse.login.token);

    const accountInfo = await authorizeClient.query({
      profile: {
        __scalar: true,
      },
    });
    expect(accountInfo.profile.id).toBeDefined();
    expect(accountInfo.profile.username).toBeDefined();
  });

  it('Throws an error when the access_token is invalid.', async () => {
    const randomAccessToken = `access_token-${nanoid()}`;
    const authorizeClient = createAuthorizeClient(randomAccessToken);

    expectUnauthorizedError(
      authorizeClient.query({
        profile: {
          __scalar: true,
        },
      })
    );
  });
});
