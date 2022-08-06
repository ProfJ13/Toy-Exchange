const { Schema, model } = require("mongoose");


// Toys, Books, Clothes, 
// age, gender, sport, school, 
// or type of toys categorys: 

const categorySchema = new Schema(
    {
categorys:
//  [
//     {
//       type: new Schema(
        {
          categoryText: {
            type: String,
            required: "categorys must have text!",
            minlength: 1,
            maxlength: 280,
          },
          categoryAuthor: {
            type: String,
            required:
              "You must include a valid username in the body of the request",
          },
          userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required:
              "You must include a valid userId in the body of the request",
          },
        },
       
    //   ),
//     },
//   ],
},
);

const Category = model("Category", categorySchema);
module.exports = Category;