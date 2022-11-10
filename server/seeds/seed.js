const db = require("../config/connection");
const { User, Post, Comment, Category, Thread } = require("../models");
const userSeeds = require("./userSeeds.json");
const postSeeds = require("./postSeeds.json");
const commentSeeds = require("./commentSeeds.json");
const categorySeeds = require("./categorySeeds.json");
const messageSeeds = require("./messageSeeds.json");

db.once("open", async () => {
  try {
    await Post.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Comment.deleteMany({});
    await Thread.deleteMany({});
    for (const user of userSeeds) {
      await User.create({
        ...user,
        usernameLowerCase: user.username.toLowerCase(),
        emailLowerCase: user.email.toLowerCase(),
      });
    }
    const userData = await User.find();

    for (const user of userData) {
      await Thread.create({
        user1: user.username,
        user2: userData[Math.floor(Math.random() * userData.length)].username,
      });
    }

    const threadData = await Thread.find();

    for (const thread of threadData) {
      for (let i = 0; i < 5; i++) {
        await Thread.findOneAndUpdate(
          {
            _id: thread._id,
          },
          {
            $push: {
              messages: {
                messageText:
                  messageSeeds[Math.floor(Math.random() * messageSeeds.length)]
                    .messageText,
                messageSender: thread.user2,
              },
            },
          }
        );
        await Thread.findOneAndUpdate(
          {
            _id: thread._id,
          },
          {
            $push: {
              messages: {
                messageText:
                  messageSeeds[Math.floor(Math.random() * messageSeeds.length)]
                    .messageText,
                messageSender: thread.user1,
              },
            },
          }
        );
      }
    }
    await Category.insertMany(categorySeeds);

    const categoryData = await Category.find();

    for (const post of postSeeds) {
      post.postAuthor =
        userData[Math.floor(Math.random() * userData.length)]._id;
      post.categoryName =
        categoryData[
          Math.floor(Math.random() * categoryData.length)
        ].categoryName;

      await Post.create(post);
    }
    const postData = await Post.find();
    for (const detailedPost of postData) {
      await User.updateOne(
        { _id: detailedPost.postAuthor },
        {
          $addToSet: {
            posts: detailedPost._id,
            savedPosts:
              postData[Math.floor(Math.random() * postData.length)]._id,
          },
        }
      );
      for (let i = 0; i < 3; i++) {
        const comment =
          commentSeeds[Math.floor(Math.random() * commentSeeds.length)];
        do {
          comment.commentAuthor =
            userData[Math.floor(Math.random() * userData.length)]._id;
        } while (comment.commentAuthor === detailedPost.postAuthor);
        comment.postId = detailedPost._id;
        await Comment.create(comment);
      }
    }
    commentData = await Comment.find();
    for (const detailedPost of postData) {
      const filteredCommentsArr = commentData.filter((comment) => {
        return comment.postId.toString() === detailedPost._id.toString();
      });

      const commentIdsArr = [];
      for (const comment of filteredCommentsArr) {
        commentIdsArr.push(comment._id);
      }

      await Post.updateOne(
        { _id: detailedPost._id },
        { $addToSet: { comments: { $each: [...commentIdsArr] } } }
      );
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("all done!");
  process.exit(0);
});
