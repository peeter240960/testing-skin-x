import { makeExecutableSchema } from '@graphql-tools/schema';

import { resolvers } from './resolver';
import { typeDefs } from './schema';
import { compose } from 'lodash/fp';
import { authorizeDirective } from '@blogs/graphql';
const { authorizedDirectiveValidator } = authorizeDirective();

const schema = compose(authorizedDirectiveValidator)(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  })
);

export default schema;
