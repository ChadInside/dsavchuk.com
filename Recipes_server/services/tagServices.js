const Tag = require('../models/Tag');
const Recipe = require('../models/Recipe');

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
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteTag(tagId) {
    try {
      await Recipe.updateMany({}, {
        $pull: {
          tags: tagId,
        },
      });

      return await Tag.findByIdAndRemove(tagId);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

module.exports = new TagServices();
