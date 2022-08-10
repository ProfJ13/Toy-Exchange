const db = require("../config/connection");
const { User, Post, Comment, Category } = require("../models");
const userSeeds = require("./userSeeds.json");
const postSeeds = require("./postSeeds.json");
const comments = require("./commentSeeds.js");
const categorys = require("./categorySeeds.json");
db.once("open", async () => {
  try {
    await Post.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});

    for (const user of userSeeds) {
      user.savedPosts = [];
      await User.create(user);
    }
    const userData = await User.find();

    await Category.insertMany(categorys);

    const categoryData = await Category.find();

    for (const post of postSeeds) {
      const randUser = Math.floor(Math.random() * userData.length);
      // post.userId = userData[randUser]._id;
      post.postAuthor = userData[randUser]._id;
      post.comments = [];
      categoryData.forEach((category) => {
        if (category.categoryName == post.categoryName)
          return (post.categoryName = category._id);
      });

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
          commentAuthor: userData[randUser]._id,

          // userId: userData[randUser]._id,
          commentText: randComment,
        };

        console.log(commentObject);
       const commentData =  await Comment.create(commentObject);


        await Post.findOneAndUpdate(
          { _id: post._id },
          {
            $push: {
              comments: commentData._id,
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
