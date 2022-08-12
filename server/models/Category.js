const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: "Categorys must have text!",
    minlength: 1,
    maxlength: 280,
    required: true,
    unique: true,
    trim: true,
  },
});

const Category = model("Category", categorySchema);
module.exports = Category;
