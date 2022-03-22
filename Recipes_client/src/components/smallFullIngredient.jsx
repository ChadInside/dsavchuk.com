import React from 'react';
import {deleteIngredient, deleteTag} from "../stores/store";
import {useDispatch} from "react-redux";
import {NavLink} from "react-router-dom";


export const SmallFullIngredient = ({ing}) => {
  const dispatch = useDispatch()
  console.log(ing)
  return (<div>
    {ing.name} , {ing._id}
    <button onClick={() => {dispatch(deleteIngredient(ing._id))}}>
      Delete ingredient
    </button>
    <ul>
      {ing.recipes.map(recipe => <li>recipe name: <NavLink
        to={`/recipe/${recipe._id}`}>{recipe.name}</NavLink> {recipe._id}</li>)}
    </ul>

  </div>)
}

export const SmallFullTag = ({tag}) => {
  const dispatch = useDispatch()
  console.log(tag)
  return (<div>
    {tag.name} , {tag._id}
    <button onClick={() => {dispatch(deleteTag(tag._id))}}>
      Delete tag
    </button>
    <ul>
      {tag.recipes.map(recipe => <li>recipe name: <NavLink
        to={`/recipe/${recipe._id}`}>{recipe.name}</NavLink> {recipe._id}</li>)}
    </ul>

  </div>)
}

