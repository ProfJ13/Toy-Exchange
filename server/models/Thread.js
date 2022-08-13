const { Schema, model } = require("mongoose");

const threadSchema = new Schema(
  {
    user1: {
      type: String,
      required: "You must include a valid username!",
      minlength: 1,
      maxlength: 140,
    },
    user2: {
      type: String,
      required: "You must include a valid username!",
      minlength: 1,
      maxlength: 140,
    },
    messages: [
      new Schema(
        {
          messageText: {
            type: String,
            required: "You must include a message!",
            minlength: 1,
            maxlength: 280,
          },
          messageSender: {
            type: String,
            required: "You must include a valid username!",
            minlength: 1,
            maxlength: 140,
          },
          read: { type: Boolean, default: false },
        },
        { timestamps: true }
      ),
    ],
  },
  { timestamps: true }
);

threadSchema.virtual("user1NewMessages").get(function () {
  return this.messages.filter((message) => {
    return message.read === false && this.user1 === message.messageSender;
  }).length;
});
threadSchema.virtual("user2NewMessages").get(function () {
  return this.messages.filter((message) => {
    return message.read === false && this.user2 === message.messageSender;
  }).length;
});

const Thread = model("Thread", threadSchema);
module.exports = Thread;
