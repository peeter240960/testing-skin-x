import gql from 'graphql-tag';

export const typeDef = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    postedAt: Date!
    postedBy: String!
    postTags: [PostTag!]
  }
  type Tag {
    id: ID!
    name: String!
  }
  type PostTag {
    id: ID!
    postId: ID!
    tagId: ID!
  }
  type PostResponse {
    edges: [Post!]
    hasNextPage: Boolean!
    endCursor: ID
    total: Int!
  }
  type Query {
    getPosts(
      search: String
      searchByTag: String
      sort: Sort
      limit: Int!
      cursor: ID
    ): PostResponse! @authorize
    getPost(id: ID!): Post! @authorize
  }
`;
