const Recipe = require("../models/Recipe")
const User = require("../models/User");
const Tag = require("../models/Tag")
const Ingredient = require("../models/Ingredient")

class recipeServices {
  async getAllRecipes() {
    try {
      return await Recipe.find().populate('tags', 'name').exec();   // returns "_id" no matter what, but omits everything except "name", if there is anythings else
    } catch (e) {
      console.log(e)
    }
  }

  async getRecipeById(recipeID) {
    try {
      return await Recipe.findOne({_id: recipeID}).populate('tags', 'name').exec();
    } catch (e) {
      console.log(e)
      throw e;
    }
  }

  async deleteRecipe(recipeID) {
    try {
      const deletedRecipe = await Recipe.findByIdAndRemove(recipeID)
      return deletedRecipe
    } catch (e) {
      console.log(e)
    }
  }

  async createRecipe(recipe) {
    //fixme ugly
    //tags
    const tags = recipe.tags
    const tagsToCreate = tags.filter(tag => tag.hasOwnProperty('id'))
    const existingTags = tags.filter(tag => !tag.hasOwnProperty('id'))
    // todo check for  duplicates in tags
    const existingTagsIDs = await this.searchExistingTags(existingTags);
    const newTags = await this.addTags(tagsToCreate)
    const newTagsToRecipe = newTags.map(tag => tag._id)

    // todo preserve ingredients count
    //ingredients
    const ingredients = recipe.ingredients
    const ingredientsToCreate = ingredients.filter(ingredient => ingredient.hasOwnProperty('id'))
    const existingIngredients = ingredients.filter(ingredient => !ingredient.hasOwnProperty('id'))
    // todo check for duplicates in ingredients
    const existingIngredientsIDs = await this.searchExistingIngredients(existingIngredients);
    const newIngredients = await this.addIngredients(ingredientsToCreate)
    const newIngredientsToRecipe = newIngredients.map(ingredient => ingredient._id)

    const newRecipe = await Recipe.create({
      ...recipe,
      tags: [...newTagsToRecipe, ...existingTagsIDs],
      ingredients: [...newIngredientsToRecipe, ...existingIngredientsIDs]
    })
    return newRecipe
  }

  async addFavouriteRecipe(userId, recipeId) {
    const recipe = await Recipe.findOneAndUpdate({_id: recipeId}, {"$addToSet": {favouritedByUsers: userId}}, {new: true})
    return recipe
  }

  async getAllTags() {
    try {
      return await Tag.find();
    } catch (e) {
      console.log(e)
    }
  }

  async addTags(tags) {
    try {
      //todo validation if tag already exists
      const newTags = await Tag.insertMany(tags);
      return newTags
    } catch (e) {
      console.log(e)
    }
  }


  async searchExistingTags(existingTagsNames) {
    try {
//todo add more check or do more optimally using native api without mapping calls to DB
      const ids = existingTagsNames.map(tag => Tag.findOne({"name": tag.name}).exec())
      const idsEval = await Promise.all(ids)
      return idsEval.map(tag => tag._id)
    } catch (e) {
      console.log(e)
    }
  }

  async getAllIngredients() {
    try {
      return await Ingredient.find();
    } catch (e) {
      console.log(e)
    }
  }

  async addIngredients(ingredients) {
    try {
      //todo validation if tag already exists
      const newIngredients = await Ingredient.insertMany(ingredients);
      return newIngredients
    } catch (e) {
      console.log(e)
    }
  }


  async searchExistingIngredients(existingIngredientsNames) {

    try {
//todo add more check or do more optimally using native api without mapping call to DB
      const ids = existingIngredientsNames.map(ingredient => Ingredient.findOne({"name": ingredient.name}).exec())
      const idsEval = await Promise.all(ids)
      return idsEval.map(ingredient => ingredient._id)
    } catch (e) {
      console.log(e)
    }
  }


}

module.exports = new recipeServices();