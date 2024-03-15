import { GraphQLDate, GraphQLJSON, GraphQLJSONObject, GraphQLUpload } from '@blogs/graphql';


import {
  mutation as authenticationMutationResolver,
  query as authenticationQueryResolver,
} from './modules/authentication/authentication.resolver';
import { typeDefs } from './schema';
import { Resolvers } from './codegen-generated';

export const resolvers: Resolvers = {
  Query: {
    ...authenticationQueryResolver,
    _sdl: () => {
      return typeDefs;
    },
  },
  Mutation: {
    ...authenticationMutationResolver,
  },
  Upload: GraphQLUpload,
  Date: GraphQLDate,
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};
