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

export const EDIT_POST = gql`
  mutation updatePost(
    $postTitle: String!
    $postText: String!
    $expectedTradeCompensation: String!
    $postId: ID!
  ) {
    updatePost(
      postTitle: $postTitle
      postText: $postText
      expectedTradeCompensation: $expectedTradeCompensation
      postId: $postId
    ) {
      _id
    }
  }
`;
export const REMOVE_POST = gql`
  mutation removePost($postId: ID!) {
    removePost(postId: $postId) {
      _id
    }
  }
`;

export const CREATE_THREAD = gql`
  mutation CreateThread($username: String!) {
    createThread(username: $username) {
      _id
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($username: String!, $messageText: String!) {
    sendMessage(username: $username, messageText: $messageText) {
      _id
      messages {
        messageText
      }
    }
  }
`;
