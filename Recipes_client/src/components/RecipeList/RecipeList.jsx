import React, {useEffect, useState} from 'react';
import './recipelist.css'
import my_face_when from '../../assets/my_face_when.png'
import SingleRecipe from "./singleRecipe/SingleRecipe";
import {useDispatch, useSelector} from "react-redux";
import {getCatalog, sendRecipeThunk} from "../../stores/store";

function RecipeList({recipes =[]}) {

  const listRecipes = recipes.map(recipe => <SingleRecipe key={recipe._id} recipe={recipe}/>)

  return (
    <div className={"RecipeList"}>
      <div className="recipeList__headers">Muh recipes</div>

      {listRecipes}

    </div>
  );
};

export default RecipeList;