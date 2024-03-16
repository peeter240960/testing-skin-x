import gql from 'graphql-tag';

export const typeDef = gql`
  type Tag {
    name: String!
  }
  type TagResponse {
    edges: [Tag!]
    total: Int!
  }
  type Query {
    getTags(
      search: String
      sort: Sort
      limit: Int!
      skip: Int
    ): TagResponse! @authorize
  }
`;
