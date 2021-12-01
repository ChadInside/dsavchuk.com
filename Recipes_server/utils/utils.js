class Utils {

  recipesFormatIngredients(recipes) {
    if (Array.isArray(recipes)){
      return recipes.map(recipe => {
        const ingredientsTransform = recipe.ingredients.map(item => {
          return {"quantity": item.quantity, "name": item._id.name, "_id": item._id._id}
        })

        //mongoose returns a Mongoose Object and not a regular JSON
        const newRecipe = recipe.toObject()
        newRecipe.ingredients = ingredientsTransform
        return newRecipe
      })
    }

    else{// recipes variable but in reality only one recipe
      const ingredientsTransform = recipes.ingredients.map(item => {
        return {"quantity": item.quantity, "name": item._id.name, "_id": item._id._id}
      })
      const newRecipe = recipes.toObject()
      newRecipe.ingredients = ingredientsTransform
      return newRecipe
    }


  }

  getRecipeDataFromReq(reqBody){
    const {name, instructions, prepTime, cookTime, servings, tags, ingredients} = reqBody
    return {name, instructions, prepTime, cookTime, servings, tags, ingredients}
  }


}

module.exports = new Utils();