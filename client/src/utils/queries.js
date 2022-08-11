import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query otherUser($username: String!) {
    otherUser(username: $username) {
      _id
      username
      posts {
        _id
        postTitle
        postText
        expectedTradeCompensation
        categoryName
        createdAt
        comments {
          _id
        }
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
      categoryName
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
    user {
      _id
      username
      email
      posts {
        _id
        postTitle
        postText
        expectedTradeCompensation
        categoryName
        createdAt
        comments {
          _id
        }
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
