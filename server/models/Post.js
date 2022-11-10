const { Schema, model } = require("mongoose");

// This collection stores all posts; including the _id of any comments on them
const postSchema = new Schema(
  {
    postTitle: {
      type: String,
      required: "You need to input a title!",
      minlength: 1,
      maxlength: 150,
      trim: true,
    },
    postText: {
      type: String,
      required: "You need to input some text!",
      minlength: 1,
      maxlength: 280,
      trim: true,
    },
    postAuthor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    expectedTradeCompensation: {
      type: String,
      required: "You need to input an expected trade!",
      minlength: 1,
      maxlength: 150,
      trim: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",

        trim: true,
        maxlength: 280,
      },
    ],
    categoryName: {
      type: String,
    },
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

module.exports = Post;
