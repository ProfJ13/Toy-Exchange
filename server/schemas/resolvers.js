const { AuthenticationError } = require("apollo-server-express");
const { User, Post, Comment, Category, Thread } = require("../models");
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
      throw new AuthenticationError(
        "You need to be logged in, or you don't have access to this!"
      );
    },
    otherUser: async (parent, { username }) => {
      return User.findOne({ username }).populate("posts");
    },
    userSearch: async (parent, { username }, context) => {
      if (context.user) {
        return await User.find({
          username: { $regex: new RegExp("^" + username + ".+$", "i") },
        }).limit(5);
      } else {
        throw new AuthenticationError(
          "You need to be logged in, or you don't have access to this!"
        );
      }
    },
    thread: async (parent, { threadId }, context) => {
      if (context.user) {
        const thread = await Thread.findOne({
          _id: threadId,
          $or: [
            {
              user1: context.user.username,
            },
            {
              user2: context.user.username,
            },
          ],
        });

        if (thread) {
          console.log(thread);
          const username =
            thread.user1 === context.user.username
              ? thread.user2
              : thread.user1;
          await Thread.findOneAndUpdate(
            {
              _id: threadId,
              $or: [
                {
                  user1: context.user.username,
                },
                {
                  user2: context.user.username,
                },
              ],
            },
            {
              $set: { [`messages.$[outer].read`]: true },
            },
            {
              arrayFilters: [
                {
                  "outer.read": false,

                  "outer.messageSender": username,
                },
              ],
            }
          );
        }
        return thread;
      } else {
        throw new AuthenticationError(
          "You need to be logged in, or you don't have access to this!"
        );
      }
    },
    sharedThreads: async (parent, args, context) => {
      if (context.user) {
        return await Thread.find({
          $or: [
            {
              user1: context.user.username,
            },
            {
              user2: context.user.username,
            },
          ],
        }).sort({ updatedAt: -1 });
      } else {
        throw new AuthenticationError(
          "You need to be logged in, or you don't have access to this!"
        );
      }
    },
    checkMessages: async (parent, args, context) => {
      if (context.user) {
        const rawThread = await Thread.aggregate([
          {
            $match: {
              $or: [
                {
                  user1: context.user.username,
                },
                {
                  user2: context.user.username,
                },
              ],
            },
          },
          {
            $unwind: "$messages",
          },
          {
            $match: {
              $and: [
                { "messages.read": false },
                { "messages.messageSender": { $ne: context.user.username } },
              ],
            },
          },
        ]);
        const thread = rawThread.map((message) => message.messages);
        return thread;
      } else {
        throw new AuthenticationError(
          "You need to be logged in, or you don't have access to this!"
        );
      }
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
    sendMessage: async (parent, { username, messageText }, context) => {
      if (context.user) {
        return Thread.findOneAndUpdate(
          {
            $or: [
              {
                user1: context.user.username,
                user2: username,
              },
              {
                user1: username,
                user2: context.user.username,
              },
            ],
          },
          {
            $push: {
              messages: {
                messageText: messageText,
                messageSender: context.user.username,
              },
            },
          },
          { new: true }
        );
      } else {
        throw new AuthenticationError(
          "You need to be logged in, or you don't have access to this!"
        );
      }
    },
    createThread: async (parent, { username }, context) => {
      if (context.user) {
        const user = await User.findOne({
          username,
        });
        if (user && user.username !== context.user.username) {
          const thread = await Thread.findOne({
            $or: [
              {
                user1: context.user.username,
                user2: username,
              },
              {
                user1: username,
                user2: context.user.username,
              },
            ],
          });

          if (!thread) {
            return await Thread.create({
              user1: context.user.username,
              user2: username,
            });
          } else {
            return null;
          }
        }
        return null;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      Thread.create({
        user1: username,
        user2: "ToyZoid",
        messages: [
          {
            messageText: `Hello, ${username}, and welcome to ToyZoid! Now that you have an account, you can post listings, comment on other listings, and in your conversations page you can search for other users to privately message them to arrange a toy exchange. We hope you find the trade you're looking for!`,
            messageSender: "ToyZoid",
          },
        ],
      });
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
      { postTitle, postText, expectedTradeCompensation, categoryName },
      context
    ) => {
      if (context.user) {
        const post = await Post.create({
          postTitle,
          postText,

          postAuthor: context.user._id,

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
        const comment = await Comment.create({
          postId,
          commentText,
          commentAuthor: context.user._id,
        });

        await Post.findOneAndUpdate(
          { _id: postId },
          { $addToSet: { comments: comment._id } }
        );

        return comment;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // not finished, still returning original post info
    updatePost: async (
      parent,
      { postId, postTitle, postText, expectedTradeCompensation },
      context
    ) => {
      if (context.user) {
        const post = await Post.findOneAndUpdate(
          {
            _id: postId,
            postAuthor: context.user._id.toString(),
          },
          { postTitle, postText, expectedTradeCompensation }
        );
        return post;
      } else {
        throw new AuthenticationError(
          "You need to be logged in, or you don't have access to this!"
        );
      }
    },

    removePost: async (parent, { postId }, context) => {
      if (context.user) {
        const post = await Post.findOneAndDelete({
          _id: postId,
          postAuthor: context.user._id,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { posts: post._id } }
        );

        return post;
      }
      throw new AuthenticationError(
        "You need to be logged in, or you don't have access to this!"
      );
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
      throw new AuthenticationError(
        "You need to be logged in, or you don't have access to this!"
      );
    },
  },
};

module.exports = resolvers;
