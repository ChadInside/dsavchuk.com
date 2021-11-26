const {model, Schema, ObjectId} = require("mongoose")

const Recipe = new Schema({

  name: {type: String, required: true},
  date: {type: Date, default: Date.now},
  instructions: {type: String, required: true},
  userId: {type: ObjectId, ref: 'User', required: true},
  isPrivate: {type: Boolean, default: false},
  favouritedByUsers: [{type: ObjectId, ref: 'User', default: []}],
  prepTime: {type: Number, required: true},
  cookTime: {type: Number, required: true},
  servings: {type: Number, required: true},

  ingredients: [{
    ingredient: {type: ObjectId, ref: 'Ingredient'},
    quantity: {type: String, default: ''},
  }],

  tags: [{type: ObjectId, ref: 'Tag'}],

})

module.exports = model("Recipe", Recipe)




