const Recipe = require('../models/Recipe');
const Tag = require('../models/Tag');
const Ingredient = require('../models/Ingredient');

class RecipeServices {
  async getAllRecipes() {
    try {
      return await Recipe.find()
        // returns "_id" no matter what, omits everything except "name", if there is anythings else
        .populate('tags', 'name')
        .populate({ path: 'ingredients._id', model: 'Ingredient', select: 'name' })
        .exec();
    } catch (e) {
      console.log(e);
    }
  }

  async getRecipeById(recipeId) {
    // todo get rid of disgusting _id._id.name for ingredient's name
    try {
      return await Recipe.findOne({ _id: recipeId })
        .populate({ path: 'ingredients._id', model: 'Ingredient', select: 'name' })
        .populate('tags', 'name')
        .exec();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteRecipe(recipeId) {
    try {
      return await Recipe.findByIdAndRemove(recipeId);
    } catch (e) {
      console.log(e);
    }
  }

  async createRecipe(recipe, userId) {
    const { tags, ingredients } = recipe;
    const tagsFinal = await this.findExistingCreateNewTags(tags);
    const ingredientsFinal = await this.findExistingCreateNewIngredients(ingredients);

    return Recipe.create({
      ...recipe,
      tags: tagsFinal,
      ingredients: ingredientsFinal,
      userId,
    });
  }

  async updateRecipe(recipe, userId) {
    const { tags, ingredients } = recipe;
    const tagsFinal = await this.findExistingCreateNewTags(tags);
    console.log('tagsFinal ', tagsFinal);
    const ingredientsFinal = await this.findExistingCreateNewIngredients(ingredients);
    console.log('ingredientsFinal', ingredientsFinal);
    delete recipe.ingredients;
    return Recipe.findByIdAndUpdate(recipe._id, {
      ...recipe,
      tags: tagsFinal,
      ingredients: ingredientsFinal,
      userId,
    }, { returnDocument: 'after' });
  }

  async addFavouriteRecipe(userId, recipeId) {
    return Recipe.findOneAndUpdate(
      { _id: recipeId },
      { $addToSet: { favouritedByUsers: userId } },
      { new: true },
    );
  }

  async removeFavouriteRecipe(userId, recipeId) {
    return Recipe.findOneAndUpdate(
      { _id: recipeId },
      { $pull: { favouritedByUsers: userId } },
      { new: true },
    );
  }

  async getAllTags() {
    try {
      return await Tag.find();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addTags(tags) {
    try {
      // todo validation if tag already exists
      return await Tag.insertMany(tags);
    } catch (e) {
      console.log(e);
    }
  }

  async searchExistingTags(existingTagsNames) {
    try {
      // todo add more check or do more optimally using native api without mapping calls to DB
      console.log('existingTagsNames', existingTagsNames);
      const ids = existingTagsNames.map((tag) => Tag.findOne({ _id: tag.id }).exec());
      const idsEval = await Promise.all(ids);
      const finalExistingTags = idsEval.map((tag) => tag.id);
      console.log('finalExistingTags ', finalExistingTags);
      return finalExistingTags;
    } catch (e) {
      console.log(e);
    }
  }

  async getAllIngredients() {
    try {
      return await Ingredient.find();
    } catch (e) {
      console.log(e);
    }
  }

  async addIngredients_saveQuantity(ingredients) {
    try {
      // todo validation if tag already exists
      // fixme changes global ingredients variable by permanently changing each ingredient-object
      const newIngredients = await Ingredient.insertMany(ingredients);
      ingredients.forEach((ingredient, index) => { ingredient.id = newIngredients[index]._id; });
      return ingredients;
    } catch (e) {
      console.log(e);
    }
  }

  async checkExistingIngredients(existingIngredients) {
    try {
      // todo add more check or do more optimally using native api without mapping call to DB
      // const ids = existingIngredientsNames
      // .map(ingredient => Ingredient.findOne({"_id": ingredient.id}).exec())
      // const idsEval = await Promise.all(ids)

      // return idsEval.map(ingredient => ingredient._id)
      return existingIngredients.filter(async (ingredient) => {
        const ingredientFromDB = await Ingredient.findById({ _id: ingredient.id }).exec();
        // eslint-disable-next-line eqeqeq
        if (ingredient.id == ingredientFromDB._id && ingredient.name && ingredientFromDB.name) {
          return true;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async findExistingCreateNewTags(tags) {
    const tagsUniqueQuery = this.checkDuplicatesLocalTags(tags);
    console.log('tagsUniqueQuery', tagsUniqueQuery);
    const tagsUniqueDb = await this.checkDuplicatesDbTags(tagsUniqueQuery);
    console.log('tagsUniqueDb ', tagsUniqueDb);
    return tagsUniqueDb;
  }

  async findExistingCreateNewIngredients(ingredients) {
    const ingredientsUniqueQuery = this.checkDuplicatesLocalIngredients(ingredients);
    console.log('ingredientsUniqueQuery ', ingredientsUniqueQuery);
    const ingredientsUniqueDb = await this.checkDuplicatesDbIngredients(ingredientsUniqueQuery);
    console.log(ingredientsUniqueDb);
    return ingredientsUniqueDb;
  }

  checkDuplicatesLocalTags(tags) {
    return tags.reduce((acc, tag) => {
      if (!acc.names.includes(tag.name.toLowerCase())) {
        acc.names.push(tag.name.toLowerCase());
        acc.tags.push(tag);
      }
      return acc;
    }, { names: [], tags: [] }).tags;
  }

  async checkDuplicatesDbTags(tags) {
    const newTags = await tags.map(async (tag) => {
      const foundTag = tag.id === 0
        ? await Tag.findOne({ name: tag.name })
        : await Tag.findById(tag.id);
      if (foundTag) return foundTag;
      // eslint-disable-next-line no-return-await
      return await Tag.create(tag);
    });
    const promisedTags = await Promise.all(newTags);
    return promisedTags.map((tag) => ({ _id: tag._id }));
  }

  checkDuplicatesLocalIngredients(ingredients) {
    return ingredients.reduce((acc, ingredient) => {
      if (!acc.names.includes(ingredient.name.toLowerCase())) {
        acc.names.push(ingredient.name.toLowerCase());
        acc.ingredients.push(ingredient);
      }
      return acc;
    }, { names: [], ingredients: [] }).ingredients;
  }

  async checkDuplicatesDbIngredients(ingredients) {
    const newIngredients = await ingredients.map(async (ingredient) => {
      const foundIngredient = ingredient.id === 0
        ? await Ingredient.findOne({ name: ingredient.name })
        : await Ingredient.findById(ingredient.id);
      if (foundIngredient) return foundIngredient;
      // eslint-disable-next-line no-return-await
      return await Ingredient.create(ingredient);
    });
    const promisedIngredients = await Promise.all(newIngredients);
    return promisedIngredients.map((ing) => (
      { _id: ing._id, quantity: ingredients.find((i) => i.name === ing.name).quantity }
    ));
  }

  // async findExistingCreateNewIngredients(ingredients) {
  //   const ingredientsToCreate = ingredients.filter((ingredient) => ingredient.id === 0);
  //
  //   // changes ingredients variable for some reason
  //   const newIngredients = await this.addIngredients_saveQuantity(ingredientsToCreate);
  //
  //   const existingIngredients = ingredients.filter((ingredient) => ingredient.id !== 0);
  //   const checkedExistingIngredients = await this.checkExistingIngredients(existingIngredients);
  //
  //   const ingredientsFormatted = checkedExistingIngredients
  //     .map((item) => ({ _id: item.id, quantity: item.quantity }));
  //
  //   return ingredientsFormatted;
  // }
}

module.exports = new RecipeServices();
