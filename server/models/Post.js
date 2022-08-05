const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    // Commenting this out until we create a simple Category model
    // categoryId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Category",
    //     required: "You must send a valid categoryId in the body of the request",
    //   },
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
      type: String,
      required: "The author's username is required!",
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "You must send a valid userId in the body of the request",
    },
    expectedTradeCompensation: {
      type: String,
      required: "You need to input an expected trade!",
      minlength: 1,
      maxlength: 150,
      trim: true,
    },
   
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

module.exports = Post;
