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
    users: [User]
    user: User
    otherUser(username: String!): User
    posts: [Post]
    categoryPosts(categoryName: String!): [Post]
    post(postId: ID!): Post!
    comment(commentId: ID!): Comment
    categories: [Category]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addPost(
      postTitle: String!
      postText: String!
      expectedTradeCompensation: String!
      categoryName: String!
    ): Post
    addComment(commentText: String!, postId: ID!): Comment
    removePost(postId: ID!): Post
    removeComment(commentId: ID!): Comment
  }
`;

module.exports = typeDefs;
