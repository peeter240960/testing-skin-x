import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {};

export const query: Resolvers<AppContext>['Query'] = {
  getTags: async (_parent, params, ctx) => {
    return await ctx.tagService.findMany(params);
  },
};