const Tag = require('../models/Tag');

class TagServices {
  async getAllTags() {
    try {
      return await Tag.find();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getTagById(tagId) {
    try {
      return await Tag.findById(tagId);
      // .populate('tags', 'name')
      // .populate({ path: 'ingredients._id', model: 'Ingredient', select: 'name' })
      // .exec();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteTag(tagId) {
    try {
      return await Tag.findByIdAndDelete(tagId);
      // .populate('tags', 'name')
      // .populate({ path: 'ingredients._id', model: 'Ingredient', select: 'name' })
      // .exec();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
module.exports = new TagServices();
