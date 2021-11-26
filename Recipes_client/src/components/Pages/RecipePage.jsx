import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteRecipe, getRecipe, setRecipe, setRedirect} from "../../stores/store";
import {Redirect, useHistory} from "react-router-dom";

const RecipePage = (props) => {
  const recipeId = props.match.params.id
  const dispatch = useDispatch()
  const recipe = useSelector(state => state.recipe)
  const redirectTo = useSelector(state => state.redirectTo)


  useEffect(() => {
    dispatch(getRecipe(recipeId))
    if (redirectTo) {
      dispatch(setRedirect(null))
    }
  }, []);

  let history = useHistory();

  return (
    <div className="RecipePage">
      {recipe && <div>
        <div className="recipe__name">{recipe.name}</div>
        <div className="recipe__instructions">{recipe.instructions}</div>
        <div className="recipe__date">{recipe.date}</div>
        <button onClick={() => {
          dispatch(deleteRecipe(recipe._id))
          history.push('/')
        }}>
          Delete recipe
        </button>
      </div>

      }
      {  recipe === null ? "Recipe not found" : "" }
    </div>
  );
};

export default RecipePage;

