import React from 'react';
import './recipelist.css'
import SingleRecipe from "./singleRecipe/SingleRecipe";

function RecipeList({recipes =[]}) {

  const listRecipes = recipes.map(recipe => <SingleRecipe key={recipe._id} recipe={recipe}/>)

  return (
    <div className={"RecipeList"}>
      {/*<div className="recipeList__headers">Muh recipes</div>*/}

      {listRecipes}

    </div>
  );
};

export default RecipeList;