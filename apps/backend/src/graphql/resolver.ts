import {
  GraphQLDate,
  GraphQLJSON,
  GraphQLJSONObject,
  GraphQLUpload,
} from '@blogs/graphql';

import {
  mutation as authenticationMutationResolver,
  query as authenticationQueryResolver,
} from './modules/authentication/authentication.resolver';
import {
  mutation as tagMutationResolver,
  query as tagQueryResolver,
} from './modules/tag/tag.resolver';
import {
  mutation as postMutationResolver,
  query as postQueryResolver,
  fileds as postFileds
} from './modules/post/post.resolver';
import { typeDefs } from './schema';
import { Resolvers } from './codegen-generated';

export const resolvers: Resolvers = {
  Query: {
    ...postQueryResolver,
    ...authenticationQueryResolver,
    ...tagQueryResolver,
    _sdl: () => {
      return typeDefs;
    },
  },
  Mutation: {
    ...authenticationMutationResolver,
    ...postMutationResolver,
    ...tagMutationResolver,
  },
  ...postFileds,
  Upload: GraphQLUpload,
  Date: GraphQLDate,
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};
