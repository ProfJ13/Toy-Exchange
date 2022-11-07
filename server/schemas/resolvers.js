const { AuthenticationError } = require("apollo-server-express");
const { User, Post, Comment, Category, Thread } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // unused as of now
    users: async () => {
      return User.find().populate("posts");
    },
    // searches for posts by username
    posts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Post.find(params).sort({ createdAt: -1 });
    },
    // searches for posts by category
    categoryPosts: async (parent, { categoryName }) => {
      return Post.find({ categoryName })
        .populate("postAuthor")
        .sort({ createdAt: -1 });
    },
    // searches for a single post and populate the comment data associated with it
    post: async (parent, { postId }) => {
      return Post.findOne({ _id: postId })
        .populate("postAuthor")
        .populate("comments")
        .populate({
          path: "comments",
          populate: "commentAuthor",
        });
    },
    // searches for a user and populates their post data. currently unused
    user: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("posts");
      }
      throw new AuthenticationError(
        "You need to be logged in, or you don't have access to this!"
      );
    },
    // used when displaying a different user's info
    otherUser: async (parent, { username }) => {
      return User.findOne({ username }).populate("posts");
    },
    // uses regex to query names that match the user's input
    userSearch: async (parent, { username }, context) => {
      if (context.user) {
        if (username.length > 0) {
          return await User.find({
            username: { $regex: new RegExp("^" + username + ".+$", "i") },
          }).limit(5);
        } else return null;
      } else {
        throw new AuthenticationError(
          "You need to be logged in, or you don't have access to this!"
        );
      }
    },
    // fetches a single thread and its messages
    //  Note that it requires the use of context, which means that the viewing user must be logged into one of the accounts in the shared thread
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

        // This code block handles marking unread messages to read.
        if (thread) {
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
    // Fetches all private message threads of a single user, the amount of new messages, and the last time one of them sent a message
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
    // checks to see how many new messages the user has. It's a little crude and likely could be refined later
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

    // Returns a list of current categories
    categories: async (parent, args) => {
      return Category.find().sort({ categoryName: 1 });
    },
    // returns a single comment by ID. I don't think this one's in use currently
    comment: async (parent, { commentId }) => {
      return Comment.findOne({ commentId });
    },
  },

  Mutation: {
    // Used when a user sends a private message to another. Requires that the user be logged in as one of the two involved users
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
    // creates a private messaging thread between two users
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
            messageText: `Hello, ${username}, and welcome to ToyZoid! Now you can post and comment on listings, and in your conversations page you can search for other users to privately message them. We hope you find the trade you're looking for!`,
            messageSender: "ToyZoid",
          },
        ],
      });
      console.log(`New user created: username ${username}`);
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

    // Handles editing an existent post
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
    // requires context, as we need to verify that the post belongs to the logged-in user
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
    // requires context, as we need to verify that the querying user created the comment
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
