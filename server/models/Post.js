const { Schema, model } = require("mongoose");

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
    // userId: {

    //   required: "You must send a valid userId in the body of the request",
    // },
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
