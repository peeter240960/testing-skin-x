import gql from 'graphql-tag';

export const typeDef = gql`
  type Account {
    id: String!
    username: String!
  }
  type Authentication {
    account: Account!
    token: String!
    expire: Int
    refreshToken: String!
  }

  type LogoutOperationResponse {
    success: Boolean!
  }

  type Mutation {
    login(username: String!, password: String!): Authentication!
    refreshToken(refreshToken: String!): Authentication!
    logout(refreshToken: String!): LogoutOperationResponse! @authorize
  }
  type Query {
    profile: Account! @authorize
  }
`;
