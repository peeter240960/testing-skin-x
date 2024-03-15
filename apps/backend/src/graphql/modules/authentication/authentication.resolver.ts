import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  login: async (_, input, ctx) => {
    const login = await ctx.authenticationService.login(input);
    return {
      account: login.account,
      token: `Bearer ${login.token}`,
      refreshToken: `Bearer ${login.refreshToken}`,
      expire: Number(login.expire),
    };
  },
  refreshToken: async (_, input, ctx) => {
    const newToken = await ctx.authenticationService.refreshToken(
      input.refreshToken.replace('Bearer ', '')
    );

    return {
      account: newToken.account,
      token: `Bearer ${newToken.token}`,
      refreshToken: `Bearer ${newToken.refreshToken}`,
      expire: Number(newToken.expire),
    };
  },
  logout: async (_, input, ctx) => {
    await ctx.authenticationService.logout(input.refreshToken);

    return {
      success: true,
    };
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  profile: async (_, params, ctx) => await ctx.authenticationService.getProfile(),
};
