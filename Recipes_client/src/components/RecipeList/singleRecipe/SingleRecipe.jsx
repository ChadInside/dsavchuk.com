import React from 'react';
import './singlerecipe.css'
import {useDispatch} from "react-redux";
import {addToFavourite, deleteRecipe} from "../../../stores/store";
import {NavLink} from "react-router-dom";

const SingleRecipe = ({recipe}) => {
  const dispatch = useDispatch()
  return (
    <div className="recipe">
      <div className="recipe__name">recipe name: {recipe.name}</div>
      <div className="recipe__instructions">recipe instructions: {recipe.instructions}</div>
      <div className="recipe__date">{recipe.date}</div>
      <div className="recipe__date">recipe author: {recipe.userId}</div>
      <div className="recipe__date">isRecipePrivate: {recipe.isPrivate ? "private" : "not private"}</div>
      <NavLink to={`/recipe/${recipe._id}`}>{`recipe id: ${recipe._id}`}</NavLink>
      <p>tags: {recipe.tags.map(tag => `${tag.name}, `)}</p>
      <p>ingredients: {recipe.ingredients.map(ingredient => `${ingredient.name}: ${ingredient.quantity},  `)}</p>

      <button onClick={() => {dispatch(deleteRecipe(recipe._id))}}>
        Delete recipe
      </button>
      <button onClick={() => {dispatch(addToFavourite(recipe._id))}}>
        Add to favourite
      </button>
    </div>
  );
};

export default SingleRecipe;