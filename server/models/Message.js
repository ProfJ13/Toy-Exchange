const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    messageText: {
      type: String,
      required: "Messages must have text!",
      minlength: 1,
      maxlength: 140,
    },
    messageSender: {
      type: String,
      required: "You must include a valid username for the sender!",
      minlength: 1,
      maxlength: 140,
    },
    messageRecipient: {
      type: String,
      required: "You must include a valid username for the recipient!",
      minlength: 1,
      maxlength: 140,
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);
module.exports = Message;
