const { model, Schema } = require('mongoose');

const User = new Schema({

  nickname: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: String, required: true }],
  recipes: [{ type: Object, ref: 'Recipe', default: [] }],
  favouriteRecipes: [{ type: Object, ref: 'Recipe', default: [] }],

});

module.exports = model('User', User);
