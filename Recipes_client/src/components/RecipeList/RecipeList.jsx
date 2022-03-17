import React from 'react';
import './recipelist.css'
import SingleShortRecipe from "./singleRecipe/SingleShortRecipe";

function RecipeList({recipes = []}) {

  if (recipes.length === 0) return <div>Not found :(</div>

  const listRecipes = recipes.map(recipe => <SingleShortRecipe key={recipe._id} recipe={recipe}/>)

  return (
    <div className={"RecipeList"}>
      {/*<div className="recipeList__headers">Muh recipes</div>*/}

      {listRecipes}

    </div>
  );
}

export default RecipeList;