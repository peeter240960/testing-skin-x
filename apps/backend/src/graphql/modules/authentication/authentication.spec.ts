import {
  authorizeGraphqlClient,
  client,
} from '@blogs/genql';
import { expectUnauthorizedError } from '@blogs/genql';
const randomStr = () => Date.now().toString(16);
describe('Authentication', () => {
  describe('login', () => {
    test('should allow a valid user to log in successfully', async () => {
      const loginResponse = await client.mutation({
        login: {
          __scalar: true,
          __args: {
            username: 'user',
            password: 'user@1234',
          },
        },
      });

      expect(loginResponse.login.token).toBeDefined();
      expect(loginResponse.login.refreshToken).toBeDefined();
    });

    test('should prevent login with invalid credentials', async () => {
      expect(
        client.mutation({
          login: {
            __scalar: true,
            __args: {
              username: randomStr(),
              password: '12345678',
            },
          },
        })
      ).rejects.toThrow('wrong username or password')
    });
  });
  describe('get profile', () => {
    test('should get user profile successfully', async () => {
      const authClient = await authorizeGraphqlClient();
      const callGetProfile = await authClient.query({
        profile: {
          __scalar: true,
        },
      });
      expect(callGetProfile.profile.id).toBeDefined();
      expect(callGetProfile.profile.username).toBe('user');
    });

    test('should handle failed get user profile operation', async () => {
      expectUnauthorizedError(
        client.query({
          profile: {
            __scalar: true,
          },
        })
      );
    });
  });
  describe('refresh token', () => {
    test('should refresh authentication token successfully', async () => {
      const loginResponse = await client.mutation({
        login: {
          __scalar: true,
          __args: {
            username: 'user',
            password: 'user@1234',
          },
        },
      });
      const refreshToken = await client.mutation({
        refreshToken: {
          __scalar: true,
          __args: {
            refreshToken: loginResponse.login.refreshToken,
          },
        },
      });
      expect(refreshToken.refreshToken.token).toBeDefined();
      expect(refreshToken.refreshToken.refreshToken).toBeDefined();
    });

    test('should handle failed refresh authentication token operation', async () => {
      expect(
        client.mutation({
          refreshToken: {
            __scalar: true,
            __args: {
              refreshToken: 'x-token',
            },
          },
        })
      ).rejects.toThrow('Invalid token');
    });
  });
});
