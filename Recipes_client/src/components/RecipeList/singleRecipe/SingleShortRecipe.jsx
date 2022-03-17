import React from 'react';
import './singlerecipe.css'
import {useDispatch} from "react-redux";
import {addToFavourite, deleteRecipe} from "../../../stores/store";
import {NavLink} from "react-router-dom";

const SingleFullRecipe = ({recipe}) => {
  const dispatch = useDispatch()
  return (
    <div className="recipe">
      <NavLink to={`/recipe/${recipe._id}`}>{`recipe name: ${recipe.name}`}</NavLink>
      <div className="recipe__date">recipe author: {recipe.userId}</div>

      <p>tags: {recipe.tags.map(tag => `${tag.name}, `)}</p>
      <p>ingredients: {recipe.ingredients && recipe.ingredients.map(ingredient => {
        if(ingredient != null){
        return `${ingredient.name}: ${ingredient.quantity},  `} return 'null ingredient'}
      )}</p>

      <button onClick={() => {dispatch(deleteRecipe(recipe._id))}}>
        Delete recipe
      </button>
      <button onClick={() => {dispatch(addToFavourite(recipe._id))}}>
        Add to favourite
      </button>
    </div>
  );
};

export default SingleFullRecipe;