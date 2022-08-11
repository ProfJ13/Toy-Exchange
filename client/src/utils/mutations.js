import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation addPost(
    $postTitle: String!
    $postText: String!
    $expectedTradeCompensation: String!
    $categoryName: String!
  ) {
    addPost(
      postTitle: $postTitle
      postText: $postText
      expectedTradeCompensation: $expectedTradeCompensation
      categoryName: $categoryName
    ) {
      _id
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($commentText: String!, $postId: ID!) {
    addComment(commentText: $commentText, postId: $postId) {
      _id
    }
  }
`;
