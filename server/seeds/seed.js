const db = require("../config/connection");
const { User, Post, Comment } = require("../models");
const userSeeds = require("./userSeeds.json");
const postSeeds = require("./postSeeds.json");
const comments = require("./commentSeeds.js");
db.once("open", async () => {
  try {
    await Post.deleteMany({});
    await User.deleteMany({});

    for (const user of userSeeds) {
      user.savedPosts = [];
      await User.create(user);
    }

    const userData = await User.find();

    for (const post of postSeeds) {
      const randUser = Math.floor(Math.random() * userData.length);
      post.userId = userData[randUser]._id;
      post.postAuthor = userData[randUser].username;
      post.comments = [];

      const newPost = await Post.create(post);
      const user = await User.findOneAndUpdate(
        { _id: userData[randUser]._id },
        {
          $addToSet: {
            posts: newPost._id,
          },
        }
      );
    }

    const postData = await Post.find();

    // seeds each post's comments array with 3 random comments
    for (const post of postData) {
      for (let i = 0; i < 3; i++) {
        const randUser = Math.floor(Math.random() * userData.length);
        const randComment =
          comments[Math.floor(Math.random() * comments.length)];
        const commentObject = {
          commentAuthor: userData[randUser].username,
          userId: userData[randUser]._id,
          commentText: randComment,
        };
        await Post.findOneAndUpdate(
          { _id: post._id },
          {
            $push: {
              comments: commentObject,
            },
          }
        );
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("all done!");
  process.exit(0);
});
