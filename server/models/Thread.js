const { Schema, model } = require("mongoose");

// Each document in this collection is an individual private messaging thread between two users
// In the course of using this collection I found its schema to be clunky and difficult to work with,
// so it may be wise to structure this differently in the future
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

// virtual properties that calculate how many new messages each user has and when the last message was sent
threadSchema.virtual("user1NewMessages").get(function () {
  return this.messages.filter((message) => {
    return message.read === false && this.user2 === message.messageSender;
  }).length;
});
threadSchema.virtual("user2NewMessages").get(function () {
  return this.messages.filter((message) => {
    return message.read === false && this.user1 === message.messageSender;
  }).length;
});
threadSchema.virtual("lastMessageTimestamp").get(function () {
  if (this.messages.length > 0) {
    return this.messages[this.messages.length - 1]?.createdAt;
  } else return this.createdAt;
});

const Thread = model("Thread", threadSchema);
module.exports = Thread;
