import { validate } from '../../../utils/validation';
import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';
import { postSortValidation } from './post.valition';

export const mutation: Resolvers<AppContext>['Mutation'] = {};

export const query: Resolvers<AppContext>['Query'] = {
  getPost: async (_parent, params, ctx) => {
    return await ctx.postService.findById(params.id);
  },
  getPosts: async (_parent, params, ctx) => {
    if (params.sort) {
      const { ok, message } = await validate(postSortValidation, params.sort);
      if (!ok) throw new Error(message);
    }
    return await ctx.postService.findMany(params);
  },
};

export const fileds: Resolvers<AppContext> = {
  Post: {
    postTags: async (parent, _params, ctx) => {
      return await ctx.postService.findTagsOfPost(parent.id);
    },
  },
};
