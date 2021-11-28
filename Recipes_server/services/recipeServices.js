const Recipe = require("../models/Recipe")
const Tag = require("../models/Tag")
const Ingredient = require("../models/Ingredient")
const ApiError = require("../exceptions/apiError");

class recipeServices {
  async getAllRecipes() {
    try {
      const recipes =  await Recipe.find()
        .populate('tags', 'name')
        .populate({path: 'ingredients._id', model: "Ingredient", select: "name"})
        .exec();   // returns "_id" no matter what, but omits everything except "name", if there is anythings else

      return recipes
    } catch (e) {
      console.log(e)
    }
  }

//.populate('tags', 'name')
  //.populate({path: 'ingredients.ingredient', model: "Ingredient"}).exec()
  async getRecipeById(recipeID) {
    //todo get rid of disgusting _id._id.name for ingredient's name
    try {
      const recipe = await Recipe.findOne({_id: recipeID})
        .populate({path: 'ingredients._id', model: "Ingredient", select: "name"})
        .populate('tags', 'name')
        .exec();

      return recipe
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

  async createRecipe(recipe, userId) {
    //fixme ugly
    const tags = recipe.tags
    const tagsToCreate = tags.filter(tag => tag.hasOwnProperty('id'))
    const existingTags = tags.filter(tag => !tag.hasOwnProperty('id'))
    // todo check for  duplicates in tags
    const existingTagsIDs = await this.searchExistingTags(existingTags);
    const newTags = await this.addTags(tagsToCreate)
    const newTagsToRecipe = newTags.map(tag => tag._id)


    // fixme its a mess
    const ingredients = [...recipe.ingredients]
    const ingredientsToCreate = ingredients.filter(ingredient => ingredient.id === 0)

    //changes ingredients variable for some reason
    const newIngredients = await this.addIngredients_saveQuantity(ingredientsToCreate)

    const existingIngredients = ingredients.filter(ingredient => ingredient.id !== 0)
    const checkedExistingIngredients = await this.checkExistingIngredients(existingIngredients)


    const ingredientsFormatted = checkedExistingIngredients.map(item => {
      return {_id: item.id, quantity: item.quantity}

    })

    // todo check for duplicates in ingredients




    delete recipe.ingredients;

    const newRecipe = await Recipe.create({
      ...recipe,
      tags: [...newTagsToRecipe, ...existingTagsIDs],
      ingredients: ingredientsFormatted,
      userId
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
      const ids = existingTagsNames.map(tag => Tag.findOne({"_id": tag.id}).exec())
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

  async addIngredients_saveQuantity(ingredients) {
    try {
      //todo validation if tag already exists
      const newIngredients = await Ingredient.insertMany(ingredients);
      ingredients.forEach((ingredient, index) => {ingredient.id = newIngredients[index]._id})
      return ingredients
    } catch (e) {
      console.log(e)
    }
  }


  async checkExistingIngredients(existingIngredients) {

    try {
//todo add more check or do more optimally using native api without mapping call to DB
      // const ids = existingIngredientsNames.map(ingredient => Ingredient.findOne({"_id": ingredient.id}).exec())
      // const idsEval = await Promise.all(ids)

      const checkedIngredients = existingIngredients.filter(async (ingredient) => {
        const ingredientFromDB = await Ingredient.findById({"_id": ingredient.id}).exec()
        if (ingredient.id == ingredientFromDB._id && ingredient.name && ingredientFromDB.name) {
          return true
        }

      })

      // return idsEval.map(ingredient => ingredient._id)
      return checkedIngredients
    } catch (e) {
      console.log(e)
    }
  }


}

module.exports = new recipeServices();