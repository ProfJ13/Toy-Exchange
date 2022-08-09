const { Schema, model } = require("mongoose");




const categorySchema = new Schema(
    {
category:
//  [
//     {
//       type: new Schema(
        {
          categoryText: {
            type: String,
            required: "categorys must have text!",
            minlength: 1,
            maxlength: 280,
            required: true,
            unique: true,
            trim: true,
          },
          // Why do we need the author? 
          categoryAuthor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required:
              "You must include a valid username in the body of the request",
              trim: true,
          },
        //   userId: {
           
        //     required:
        //       "You must include a valid userId in the body of the request",
        //   },
        },
       
    //   ),
//     },
//   ],
},
);

const Category = model("Category", categorySchema);
module.exports = Category;