const { gql } = require('apollo-server-express');

// used to define our schema and the types it contains 
// each type has objects and each objects has fields that describs the data
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    post: [Post]
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
    comment: [Comment]!
  }

  type Comment {
    _id: ID!
    commentText: String!
    commentAuthor: User!
    createdAt: String
  }

  type Category {
    _id: ID!
    categoryText: String!
    categoryAuthor: User!
  }

  type Query {
    users: [User]
    user: User
    posts: [Post]
    post: Post
    comment: Comment
    category: Category
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addPost(postTitle: String!, postText: String!,postAuthor: User!, expectedTradeCompensation: String!): Post
    addComment(postId: ID!, commentText: String!): Post
    removePost(postId: ID!): Post
    removeComment(postId: ID!, commentId: ID!): Post
  }
`;

module.exports = typeDefs;
