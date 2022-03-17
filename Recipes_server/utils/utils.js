class Utils {
  recipesFormatIngredients(recipes) {
    if (Array.isArray(recipes)) {
      return recipes.map((recipe) => {
        const ingredientsTransform = recipe.ingredients.map((ingredient) => ({
          quantity: ingredient.quantity, name: ingredient._id.name, _id: ingredient._id._id,
        }));
        // mongoose returns a Mongoose Object and not a regular JSON
        const newRecipe = recipe.toObject();
        newRecipe.ingredients = ingredientsTransform;
        return newRecipe;
      });
    }
    // if single recipe
    const ingredientsTransform = recipes.ingredients
      .map((item) => ({ quantity: item.quantity, name: item._id.name, _id: item._id._id }));
    const newRecipe = recipes.toObject();
    newRecipe.ingredients = ingredientsTransform;
    return newRecipe;
  }

  getRecipeDataFromReq(reqBody) {
    const {
      name, instructions, prepTime, cookTime, servings, tags, ingredients,
    } = reqBody;
    const recipe = {
      name, instructions, prepTime, cookTime, servings, tags, ingredients,
    };
    if (reqBody._id) { recipe._id = reqBody._id; }
    return recipe;
  }

  formatTagIngredientsIds(tags, ingredients) {
    try {
      const tagsFormattedId = tags.map((tag) => (tag.hasOwnProperty('id')
        ? tag
        : { id: tag._id, name: tag.name }));

      const ingredientsFormattedId = ingredients.map((ing) => (ing.hasOwnProperty('id')
        ? ing
        : { id: ing._id, name: ing.name, quantity: ing.quantity }));

      return { tags: tagsFormattedId, ingredients: ingredientsFormattedId };
    } catch (e) {
      console.log(e);
    }
    // tags & ingredients should be received with "id" field instead of "_id"
  }
}

module.exports = new Utils();
