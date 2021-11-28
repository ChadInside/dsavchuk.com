const Recipe = require("../models/Recipe")

const User = require("../models/User")

const recipeServices = require("../services/recipeServices")
const userServices = require("../services/userServices")

class RecipeController {
  async getAllRecipes(req, res) {
    try {
      const recipes = await recipeServices.getAllRecipes()

      const recipesTransformed = recipes.map(recipe => {

        const ingredientsTransform =  recipe.ingredients.map(item => {
          return {"quantity": item.quantity, "name": item._id.name, "_id": item._id._id}
        })
//mongoose returns a Mongoose Object and not a regular JSON
        const newRecipe = recipe.toObject()
        newRecipe.ingredients = ingredientsTransform
        return newRecipe
      })

      return res.json(recipesTransformed)




    } catch (e) {
      console.log(e)
      res.status(500).json({message: "Can't get recipes"})
    }
  }

  async createRecipe(req, res) {
    try {
      const {name, instructions, prepTime, cookTime, servings, tags, ingredients} = req.body
      const recipeData = {name, instructions, prepTime, cookTime, servings, tags, ingredients}
      const userId = req.user.id
      const recipe = await recipeServices.createRecipe(recipeData, userId)
      // console.log(recipe)
      await userServices.addRecipeToUser(userId, recipe._id)
      return res.json(recipe)
    } catch (e) {
      console.log(e)
      res.status(500).json({message: "Can't create recipe"})
    }
  }

  async getRecipe(req, res) {
    try {
      const recipeID = req.params.recipeID
      const recipe = await recipeServices.getRecipeById(recipeID)

      // console.log("???????????????????/////////////////////////////////?????????????????????????????????///////////////")
      // console.log("basic ingredients: ", recipe.ingredients)

      const ingredientsTransform =  recipe.ingredients.map(item => {
        return {"quantity": item.quantity, "name": item._id.name, "_id": item._id._id}
      })
//mongoose returns a Mongoose Object and not a regular JSON
      const newRecipe = recipe.toObject()
      newRecipe.ingredients = ingredientsTransform


      // console.log("ingredientsTransform: ", ingredientsTransform)
      // // recipe.ingredients = ingredientsTransform
      // console.log(recipe.ingredients)
      // console.log("after transform: ", recipe.ingredients)

      // console.log(newRecipe.ingredients)

      res.json(newRecipe)
    } catch (e) {
      res.status(404).json({message: e.message})

    }
  }

  // async updateRecipe(req, res) {
  //   // TODO update to actually update
  //   try {
  //     const recipe = req.params.recipeID
  //     const parentThread = await services.deleteRecipe(recipeID)
  //     res.json(parentThread)
  //   } catch (e) {
  //     res.status(400).json({message: e.message})
  //   }
  // }


  async deleteRecipe(req, res) {
    try {
      // if (!req.user.roles.includes('admin')) {
      //   throw new ApiError.UnauthorizedError()
      // }
      const recipeID = req.params.recipeID

      const deletedRecipe = await recipeServices.deleteRecipe(recipeID)
      await userServices.deleteRecipe(deletedRecipe)

      res.json(deletedRecipe)
    } catch (e) {
      res.status(400).json({message: e.message})
    }
  }


  async getAllTags(req, res) {
    try {
      const tags = await recipeServices.getAllTags()
      return res.json(tags)
    } catch (e) {
      console.log(e)
      res.status(500).json({message: "Can't get tags"})
    }
  }
  async getAllIngredients(req, res) {
    try {
      const ingredients = await recipeServices.getAllIngredients()
      return res.json(ingredients)
    } catch (e) {
      console.log(e)
      res.status(500).json({message: "Can't get ingredients"})
    }
  }


}

module.exports = new RecipeController()