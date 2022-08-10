const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    commentText: {
      type: String,
      required: "Comments must have text!",
      minlength: 1,
      maxlength: 280,
    },
    commentAuthor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "You must include a valid username in the body of the request",
    },
  },

  { timestamps: true }
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;
