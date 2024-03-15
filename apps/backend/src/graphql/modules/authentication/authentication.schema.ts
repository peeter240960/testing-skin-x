import gql from 'graphql-tag';

export const typeDef = gql`
  type Authentication {
    token: String!
    refreshToken: String!
    expire: Int
    expireRefreshToken: Int
    projectIds: [String!]
    projectId: String
  }

  type LogoutOperationResponse {
    success: Boolean!
  }

  type Mutation {
    login(username: String!, password: String!): Authentication!
    refreshToken(refreshToken: String!): Authentication!
    logout(refreshToken: String!): LogoutOperationResponse! @authorize
  }
`;
