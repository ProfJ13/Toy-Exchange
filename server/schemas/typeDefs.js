const { gql } = require("apollo-server-express");

// used to define our schema and the types it contains
// each type has objects and each objects has fields that describs the data
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    posts: [Post]
  }

  type Thread {
    _id: ID!
    user1: String!
    user2: String!
    messages: [Message]
    createdAt: String
    updatedAt: String
    user1NewMessages: Int
    user2NewMessages: Int
    lastMessageTimestamp: String
  }

  type Message {
    _id: ID!
    messageText: String!
    messageSender: String!
    read: Boolean!
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Post {
    _id: ID!
    postTitle: String!
    postText: String!
    postAuthor: User!
    expectedTradeCompensation: String
    createdAt: String
    comments: [Comment]!
    categoryName: String
  }

  type Comment {
    _id: ID!
    commentText: String!
    commentAuthor: User!
    postId: ID!
    createdAt: String
  }

  type Category {
    _id: ID!
    categoryName: String!
  }

  type Query {
    thread(threadId: ID!): Thread
    sharedThreads: [Thread]
    checkMessages: [Thread]
    users: [User]
    user: User
    userSearch(username: String!): [User]
    otherUser(username: String!): User
    posts: [Post]
    categoryPosts(categoryName: String!): [Post]
    post(postId: ID!): Post!
    comment(commentId: ID!): Comment
    categories: [Category]
  }

  type Mutation {
    sendMessage(username: String!, messageText: String!): Thread
    createThread(username: String!): Thread
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addPost(
      postTitle: String!
      postText: String!
      expectedTradeCompensation: String!
      categoryName: String!
    ): Post
    addComment(commentText: String!, postId: ID!): Comment
    updatePost(
      postTitle: String!
      postText: String!
      expectedTradeCompensation: String!
      postId: ID!
    ): Post
    removePost(postId: ID!): Post
    removeComment(commentId: ID!): Comment
  }
`;

module.exports = typeDefs;
