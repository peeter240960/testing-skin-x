import gql from 'graphql-tag';

export const sortTypeDef = gql`
  enum SortType {
    desc
    asc
  }
  input Sort { 
    sortBy: String, 
    sortType: SortType
  }
`;
