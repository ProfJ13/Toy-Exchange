import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      posts {
        _id
        postText
        createdAt
      }
    }
  }
`;

export const QUERY_POSTS = gql`
  query getPosts {
    posts {
      _id
      postText
      postAuthor
      createdAt
    }
  }
`;

export const QUERY_CATEGORY_POSTS = gql`
  query getCategoryPosts($categoryName: String!) {
    categoryPosts(categoryName: $categoryName) {
      _id
      postTitle
      postText
      expectedTradeCompensation
      createdAt
      comments {
        _id
      }
      postAuthor {
        username
      }
    }
  }
`;

export const QUERY_SINGLE_POST = gql`
  query getPost($postId: ID!) {
    post(postId: $postId) {
      postTitle
      postText
      expectedTradeCompensation
      createdAt
      categoryName
      comments {
        commentText
        createdAt
        commentAuthor {
          username
        }
      }
      postAuthor {
        username
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      posts {
        _id
        postText
        postAuthor
        createdAt
      }
    }
  }
`;

// need to match the category schema exatly, otherwise it won't work
export const QUERY_CATEGORIES = gql`
  query getCategories {
    categories {
      categoryName
    }
  }
`;
