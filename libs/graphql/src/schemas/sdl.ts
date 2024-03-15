import gql from 'graphql-tag';

export const sdlTypeDef = gql`
  type Query {
    _sdl: String!
  }
`;
