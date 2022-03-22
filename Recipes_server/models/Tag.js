const { model, Schema, ObjectId } = require('mongoose');
const Recipe = require('./Recipe');

const Tag = new Schema({

  name: { type: String, required: true, unique: true },

});

// Tag.pre('remove', () => {
//   // Remove all the docs that refers
//   this.model('Recipe').updateMany({}, {
//     $pull: {
//       tags: ObjectId(this._id),
//     },
//   });
// });

module.exports = model('Tag', Tag);
