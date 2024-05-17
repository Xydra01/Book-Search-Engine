import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const SEARCH_BOOKS = gql`
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      bookId
      authors
      title
      description
      image
    }
  }
`;

// Replace the searchGoogleBooks function with this function using useQuery
export const searchBooks = (query) => {
  return useQuery(SEARCH_BOOKS, {
    variables: { query },
  });
};
