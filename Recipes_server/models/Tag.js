const { model, Schema } = require('mongoose');

const Tag = new Schema({

  name: { type: String, required: true, unique: true },

});

module.exports = model('Tag', Tag);
