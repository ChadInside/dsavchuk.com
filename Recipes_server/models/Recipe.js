const { model, Schema, ObjectId } = require('mongoose');

const Recipe = new Schema({

  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  instructions: { type: String, required: true },
  userId: { type: ObjectId, ref: 'User', required: true }, // rename to "author"
  favouritedByUsers: [{ type: ObjectId, ref: 'User', default: [] }],
  prepTime: { type: Number, required: true },
  cookTime: { type: Number, required: true },
  servings: { type: Number, required: true },

  ingredients: [
    {
      _id: { type: ObjectId, ref: 'Ingredient' }, // rename _id to ingredient or ingredientId
      quantity: { type: String, default: '' },
    },
  ],

  tags: [{ type: ObjectId, ref: 'Tag' }],

});

module.exports = model('Recipe', Recipe);
