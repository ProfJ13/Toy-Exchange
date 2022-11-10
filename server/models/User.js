const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// a standard collection of User documents
const userSchema = new Schema(
  {
    // using a usernameLowerCase field to allow usernames to be unique, even with changes in letter case
    usernameLowerCase: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 40,
      // This rejects all usernames that have an @ symbol; this prevents users from circumventing the login system
      match: [/^((?!@).)*$/, "Usernames can't include an @ symbol!"],
    },
    // see usernameLowerCase
    emailLowerCase: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must match an email address!"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 40,
      match: [/^((?!@).)*$/, "Usernames can't include an @ symbol!"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must match an email address!"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    // savedPosts: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Post",
    //   },
    // ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
