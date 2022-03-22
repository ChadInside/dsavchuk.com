const { model, Schema } = require('mongoose');

const Ingredient = new Schema({

  name: { type: String, required: true, unique: true },

});

Ingredient.pre('remove', () => {
  // Remove all the docs that refers
  this.model('Recipe').updateMany({
    $pullAll: {
      ingredients: { _id: { _id: this._id } },
    },
  });
});

module.exports = model('Ingredient', Ingredient);
