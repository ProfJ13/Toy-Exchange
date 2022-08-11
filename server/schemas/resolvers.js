const { AuthenticationError } = require("apollo-server-express");
const { User, Post, Comment, Category } = require("../models");
const { signToken } = require("../utils/auth");

// resolver is a function responsible for populating the data that defined by typeDefs.js
//  Do we need to add await since we're using async?
const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("posts");
    },
    posts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Post.find(params).sort({ createdAt: -1 });
    },
    categoryPosts: async (parent, { categoryName }) => {
      return Post.find({ categoryName })
        .populate("postAuthor")
        .sort({ createdAt: -1 });
    },
    post: async (parent, { postId }) => {
      return Post.findOne({ _id: postId })
        .populate("postAuthor")
        .populate("categoryName")
        .populate("comments")
        .populate({
          path: "comments",
          populate: "commentAuthor",
        });
    },
    user: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("posts");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    otherUser: async (parent, { username }) => {
      return User.findOne({ username }).populate("posts");
    },
    // add category and comment resolvers
    categories: async (parent, args) => {
      return Category.find().sort({ categoryName: 1 });
    },
    comment: async (parent, { commentId }) => {
      return Comment.findOne({ commentId });
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    addPost: async (
      parent,
      {
        userId,
        postTitle,
        postText,
        postAuthor,
        expectedTradeCompensation,
        categoryName,
      },
      context
    ) => {
      if (context.user) {
        const post = await Post.create({
          userId,
          postTitle,
          postText,
          postAuthor: context.user.username,
          expectedTradeCompensation,
          categoryName,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { posts: post._id } }
        );

        return post;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addComment: async (parent, { postId, commentText }, context) => {
      if (context.user) {
        return Post.findOneAndUpdate(
          { _id: postId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removePost: async (parent, { postId }, context) => {
      if (context.user) {
        const post = await Post.findOneAndDelete({
          _id: postId,
          postAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { posts: post._id } }
        );

        return post;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeComment: async (parent, { postId, commentId }, context) => {
      if (context.user) {
        return Post.findOneAndUpdate(
          { _id: postId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
