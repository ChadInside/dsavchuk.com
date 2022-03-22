import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
  deleteIngredient,
  deleteRecipe,
  deleteTag,
  getRecipe,
  getSuggestionIngredients,
  getSuggestionTags, getTagsIngredientsFull,
  setRedirect
} from "../../stores/store";
import {SmallFullIngredient, SmallFullTag} from '../smallFullIngredient'

const TagsIngredientsPage = (props) => {
  const dispatch = useDispatch()

  const tagsFull = useSelector(state => state.tagsFull)
  const ingredientsFull = useSelector(state => state.ingredientsFull)


  useEffect(() => {
    dispatch(getTagsIngredientsFull());
  }, []);


  return (
    <div className="TagsIngredientsPage">
      <p>Ingredients:</p> {ingredientsFull.map(ing => <SmallFullIngredient ing={ing} key={ing._id}/>)}
      <p>Tags:</p> {tagsFull.map(tag => <SmallFullTag tag={tag} key={tag._id}/>)}

      <p>Kappa</p>


    </div>
  );
};

export default TagsIngredientsPage;

