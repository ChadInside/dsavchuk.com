const Recipe = require('../models/Recipe');
const Tag = require('../models/Tag');
const Ingredient = require('../models/Ingredient');
const ApiError = require('../exceptions/apiError');

class RecipeServices {
  async getAllRecipes() {
    try {
      const recipes = await Recipe.find()
        // returns "_id" no matter what, omits everything except "name", if there is anythings else
        .populate('tags', 'name')
        .populate({path: 'ingredients._id', model: 'Ingredient', select: 'name'})
        .exec();
      return recipes;
    } catch (e) {
      console.log(e);
    }
  }

  async getRecipeById(recipeId) {
    // todo get rid of disgusting _id._id.name for ingredient's name
    try {
      const recipe = await Recipe.findOne({_id: recipeId})
        .populate({path: 'ingredients._id', model: 'Ingredient', select: 'name'})
        .populate('tags', 'name')
        .exec();

      return recipe;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteRecipe(recipeId) {
    try {
      const deletedRecipe = await Recipe.findByIdAndRemove(recipeId);
      return deletedRecipe;
    } catch (e) {
      console.log(e);
    }
  }

  async createRecipe(recipe, userId) {
    // console.log("starting recipe: " ,recipe);

    const {tags, ingredients} = recipe;
    console.log('starting tags ingredients: ', {tags, ingredients});

    const tagsFinal = await this.findExistingCreateNewTags(tags);
    console.log("processed tags: ", tagsFinal)
    const ingredientsFinal = await this.findExistingCreateNewIngredients(ingredients);
    //
    // // creates new tags even if they already exist
    // const tagsToCreate = tags.filter((tag) => tag.hasOwnProperty('id'));
    // const existingTags = tags.filter((tag) => !tag.hasOwnProperty('id'));
    // // todo check for  duplicates in tags
    // const existingTagsIDs = await this.searchExistingTags(existingTags);
    // const newTags = await this.addTags(tagsToCreate);
    // const newTagsToRecipe = newTags.map((tag) => tag._id);
    //
    // const ingredientsToCreate = ingredients.filter((ingredient) => ingredient.id === 0);
    //
    // // changes ingredients variable for some reason
    // const newIngredients = await this.addIngredients_saveQuantity(ingredientsToCreate);
    //
    // const existingIngredients = ingredients.filter((ingredient) => ingredient.id !== 0);
    // const checkedExistingIngredients = await this.checkExistingIngredients(existingIngredients);
    //
    // const ingredientsFormatted = checkedExistingIngredients
    //   .map((item) => ({ _id: item.id, quantity: item.quantity }));
    //
    // // todo check for duplicates in ingredients
    // delete recipe.ingredients;
    // console.log('final tags and ingredients: ', { tags: [...newTagsToRecipe, ...existingTagsIDs], ing: ingredientsFormatted });
    console.log('v2 tags and ingredients: ', {tags: tagsFinal, ing: ingredientsFinal});

    const newRecipe = await Recipe.create({
      ...recipe,
      tags: tagsFinal,
      ingredients: ingredientsFinal,
      userId,
    });

    throw new ApiError.InternalServerError('cant create recipe, its not pretty yet');

    return newRecipe;
  }

  async updateRecipe(recipe, userId) {
    // fixme UGLY UGLY UGLY
    // fixme ugly
    const {tags} = recipe;
    const tagsToCreate = tags.filter((tag) => tag.hasOwnProperty('id'));
    const existingTags = tags.filter((tag) => !tag.hasOwnProperty('id'));
    // todo check for  duplicates in tags
    const existingTagsIDs = await this.searchExistingTags(existingTags);
    const newTags = await this.addTags(tagsToCreate);
    const newTagsToRecipe = newTags.map((tag) => tag._id);

    // fixme its a mess
    const ingredientsPre = [...recipe.ingredients];
    const ingredients = ingredientsPre.map((item) => {
      if (item.hasOwnProperty('id')) return {id: item.id, quantity: item.quantity, name: item.name};
      if (item.hasOwnProperty('_id')) return {id: item._id, quantity: item.quantity, name: item.name};
      return null;
    });

    const ingredientsToCreate = ingredients.filter((ingredient) => ingredient.id === 0);

    // changes ingredients variable for some reason
    const newIngredients = await this.addIngredients_saveQuantity(ingredientsToCreate);

    const existingIngredients = ingredients.filter((ingredient) => ingredient.id !== 0);
    const checkedExistingIngredients = await this.checkExistingIngredients(existingIngredients);

    const ingredientsFormatted = checkedExistingIngredients.map((item) => {
      if (item.id) return {_id: item.id, quantity: item.quantity};
      if (item._id) return {_id: item._id, quantity: item.quantity};
      return null;
    });

    // todo check for duplicates in ingredients
    delete recipe.ingredients;
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipe._id, {
      ...recipe,
      tags: [...newTagsToRecipe, ...existingTagsIDs],
      ingredients: ingredientsFormatted,
      userId,
    }, {returnDocument: 'after'});

    return updatedRecipe;
  }

  async addFavouriteRecipe(userId, recipeId) {
    const recipe = await Recipe.findOneAndUpdate(
      {_id: recipeId},
      {$addToSet: {favouritedByUsers: userId}},
      {new: true},
    );
    return recipe;
  }

  async removeFavouriteRecipe(userId, recipeId) {
    const recipe = await Recipe.findOneAndUpdate(
      {_id: recipeId},
      {$pull: {favouritedByUsers: userId}},
      {new: true},
    );
    return recipe;
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
      const newTags = await Tag.insertMany(tags);
      return newTags;
    } catch (e) {
      console.log(e);
    }
  }

  async searchExistingTags(existingTagsNames) {
    try {
      // todo add more check or do more optimally using native api without mapping calls to DB
      console.log("existingTagsNames", existingTagsNames)
      const ids = existingTagsNames.map((tag) => Tag.findOne({_id: tag.id}).exec());
      const idsEval = await Promise.all(ids);
      const finalexistingtags = idsEval.map((tag) => tag.id);
      console.log("finalexistingtags ", finalexistingtags);
      return finalexistingtags
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

      const checkedIngredients = existingIngredients.filter(async (ingredient) => {
        const ingredientFromDB = await Ingredient.findById({_id: ingredient.id}).exec();
        // eslint-disable-next-line eqeqeq
        if (ingredient.id == ingredientFromDB._id && ingredient.name && ingredientFromDB.name) {
          return true;
        }
      });

      // return idsEval.map(ingredient => ingredient._id)
      return checkedIngredients;
    } catch (e) {
      console.log(e);
    }
  }

  async findExistingCreateNewTags(tags) {
    // console.log(tags)
    // creates new tags even if they already exist
    const tagsToCreate = tags.filter((tag) => tag.id === 0);
    const existingTags = tags.filter((tag) => !(tag.id === 0));

    const tagsUniqueQuery = this.checkDuplicatesLocalTags(tags)
    const tagsUniqueDb = this.checkDuplicatesDbTags(tagsUniqueQuery)

    // todo check for  duplicates in tags
    const existingTagsIDs = await this.searchExistingTags(existingTags);
    console.log("existingTagsIDs ", existingTagsIDs)
    console.log("newTags: ", newTags)
    const newTags = await this.addTags(tagsToCreate);
    const newTagsToRecipe = newTags.map((tag) => tag._id);

    return processedTags;
  }

   checkDuplicatesLocalTags(tags) {
    const uniqueTagsLocal = tags.reduce((acc, tag) => {
      if (!acc.names.includes(tag.name.toLowerCase())) {
        acc.names.push(tag.name.toLowerCase())
        acc.tags.push(tag)
      }
      return acc
    }, {names: [], tags: []}).tags;
    return uniqueTagsLocal
  }

  async checkDuplicatesDbTags(tags){



    return uniqueTagsDb;
  }

  async findExistingCreateNewIngredients(ingredients) {
    const ingredientsToCreate = ingredients.filter((ingredient) => ingredient.id === 0);

    // changes ingredients variable for some reason
    const newIngredients = await this.addIngredients_saveQuantity(ingredientsToCreate);

    const existingIngredients = ingredients.filter((ingredient) => ingredient.id !== 0);
    const checkedExistingIngredients = await this.checkExistingIngredients(existingIngredients);

    const ingredientsFormatted = checkedExistingIngredients
      .map((item) => ({_id: item.id, quantity: item.quantity}));

    return processedIngredients;
  }
}

module.exports = new RecipeServices();
