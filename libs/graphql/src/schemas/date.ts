import { GraphQLError, GraphQLScalarType } from 'graphql';
import gql from 'graphql-tag';
export const GraphQLDate = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    if (typeof value === 'string') return new Date(value);
    throw new GraphQLError('Date value invalid.');
  },
  serialize(value: Date) {
    if (value instanceof Date) return value.toISOString();
    throw new GraphQLError('Date serialization unsupported.');
  },
});

export const dateTypeDefs = gql`
  scalar Date
`;
