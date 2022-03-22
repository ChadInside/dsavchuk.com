const recipeServices = require('../services/recipeServices');
const userServices = require('../services/userServices');
const ApiError = require('../exceptions/apiError');
const utils = require('../utils/utils');
const tagServices = require('../services/tagServices');

class RecipeController {
  async getAllRecipes(req, res, next) {
    try {
      const recipesRaw = await recipeServices.getAllRecipes();
      // console.log('recipesRaw ', recipesRaw);
      const recipesTransformed = utils.recipesFormatIngredients(recipesRaw);
      // console.log('recipesTransformed: ', recipesTransformed);
      return res.json(recipesTransformed);
    } catch (e) {
      console.log(e);
      return next(ApiError.InternalServerError("Can't get recipes"));
    }
  }

  async createRecipe(req, res, next) {
    try {
      const recipeData = utils.getRecipeDataFromReq(req.body);
      const userId = req.user.id;
      const recipe = await recipeServices.createRecipe(recipeData, userId);
      await userServices.addRecipeToUser(userId, recipe._id);
      return res.json(recipe);
    } catch (e) {
      console.log(e);
      return next(ApiError.InternalServerError("Can't create recipe"));
    }
  }

  async updateRecipe(req, res, next) {
    try {
      const recipeData = utils.getRecipeDataFromReq(req.body);
      const userId = req.user.id;
      const recipe = await recipeServices.updateRecipe(recipeData, userId);
      return res.json(recipe);
    } catch (e) {
      return next(ApiError.InternalServerError("Can't update recipe"));
    }
  }

  async getRecipe(req, res) {
    try {
      const { recipeId } = req.params;
      const recipe = await recipeServices.getRecipeById(recipeId);

      const recipeFormat = utils.recipesFormatIngredients(recipe);
      res.json(recipeFormat);
    } catch (e) {
      res.status(404).json({ message: e.message });
    }
  }

  async deleteRecipe(req, res, next) {
    try {
      const { recipeId } = req.params;
      const recipe = await recipeServices.getRecipeById(recipeId);

      // eslint-disable-next-line eqeqeq
      const isAuthor = (recipe.userId == req.user.id);

      if (!isAuthor && !req.user.roles.includes('admin')) {
        throw ApiError.UnauthorizedError();
      }

      const deletedRecipe = await recipeServices.deleteRecipe(recipeId);
      await userServices.deleteRecipe(deletedRecipe);

      return res.json(deletedRecipe);
    } catch (e) {
      return next(e);
    }
  }

  async deleteTag(req, res, next) {
    try {
      const { tagId } = req.params;
      const deletedTag = await tagServices.deleteTag(tagId);

      // const deletedRecipe = await recipeServices.deleteRecipe(recipeId);
      // await userServices.deleteRecipe(deletedRecipe);

      return res.json(deletedTag);
    } catch (e) {
      return next(e);
    }
  }

  async getAllTags(req, res, next) {
    try {
      const tags = await tagServices.getAllTags();
      return res.json(tags);
    } catch (e) {
      return next(ApiError.InternalServerError("Can't get tags"));
    }
  }

  async getAllIngredients(req, res, next) {
    try {
      const ingredients = await recipeServices.getAllIngredients();
      return res.json(ingredients);
    } catch (e) {
      return next(ApiError.InternalServerError("Can't get ingredients"));
    }
  }

  async getTagsIngredientsFull(req, res, next) {
    try {
      const tagsIngredientsFull = await recipeServices.getTagsIngredientsFull();
      return res.json(tagsIngredientsFull);
    } catch (e) {
      return next(ApiError.InternalServerError("Can't get TagsIngredientsFull"));
    }
  }

  async deleteIngredient(req, res, next) {
    try {
      const { ingredientId } = req.params;
      const ingredient = await recipeServices.deleteIngredient(ingredientId);
      return res.json(ingredient);
    } catch (e) {
      return next(ApiError.InternalServerError("Can't get ingredients"));
    }
  }
}

module.exports = new RecipeController();
