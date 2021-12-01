import React, {useCallback, useEffect, useRef, useState} from 'react';
import {getRecipe, getSuggestionIngredients, getSuggestionTags, sendRecipeThunk} from "../../stores/store";
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import ReactTags from "react-tag-autocomplete";
import "../../assets/createRecipePage.css"


// todo Ingredients []
//   Directions (1.1213 2.123123 3.123123)


const CreateRecipePage = (props) => {
  const dispatch = useDispatch()
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [tags, setTags] = useState([])
  const suggestion_tags = useSelector(state => state.suggestion_tags)
  const suggestion_ingredients = useSelector(state => state.suggestion_ingredients)
  const reactTags = useRef()
  const redirectTo = useSelector(state => state.redirectTo)

  const recipe = useSelector(state => state.recipe)

  const recipeId = props.match.params.id
  const isUpdate = (recipeId) ? true : false;

  //todo reformat to unify tags and ingredients
  const onDeleteTags = useCallback((tagIndex) => {
    setTags(tags.filter((_, i) => i !== tagIndex))
  }, [tags])
  const onAdditionTags = useCallback((newTag) => {
    setTags([...tags, newTag])
  }, [tags])

  const onDeleteIngredients = useCallback((ingredientIndex) => {
    setIngredients(ingredients.filter((_, i) => i !== ingredientIndex))
  }, [ingredients])
  const onAdditionIngredients = useCallback((newIngredient) => {
    setIngredients([...ingredients, newIngredient])
  }, [ingredients])

  const changeQuantityIngredient = useCallback((quantityValue, ingredientName) => {
    const newIngredientIndex = ingredients.findIndex(item => item.name === ingredientName)
    const newIngredient = ingredients[newIngredientIndex]
    newIngredient.quantity = quantityValue
    const ingredientsArray = Array.from(ingredients)
    ingredientsArray.splice(newIngredientIndex, 1, newIngredient)
    setIngredients(ingredientsArray)
  }, [ingredients])

  function getQuantityIngredient(ingredientName) {
    const ingredientIndex = ingredients.findIndex(item => item.name === ingredientName)
    return ingredients[ingredientIndex].quantity
  }


  useEffect(() => {
    dispatch(getSuggestionTags())
    dispatch(getSuggestionIngredients())
    if(isUpdate){
      dispatch(getRecipe(recipeId))
      initUpdate()
    }
  }, []);

  useEffect(()=>{
    initUpdate()
  },[recipe])

  function initUpdate() {
    if (recipeId && recipe && recipe._id == recipeId) {
      setName(recipe.name)
      setInstructions(recipe.instructions)
      setPrepTime(recipe.prepTime)
      setCookTime(recipe.cookTime)
      setServings(recipe.servings)
      setIngredients(recipe.ingredients)
      setTags(recipe.tags)
    }
  }

  function sendRecipe() {
    const recipeData = {name, instructions, prepTime, cookTime, servings, ingredients, tags}
    if (isUpdate) recipeData._id = recipe._id
    dispatch(sendRecipeThunk(recipeData, isUpdate))
  }

  if (redirectTo) {
    return <Redirect to={redirectTo}/>
  }


  return (

    <div>
      {redirectTo}
      {recipeId ? "update recipe" : "create new recipe page"}
      {<div className={"postForm"}>

        <input type="text" value={name} placeholder={"Name"} onChange={e => setName(e.target.value)}/>
        <input type="text" value={instructions} placeholder={"Instructions"} onChange={e => setInstructions(e.target.value)}/>

        <input type="number" value={prepTime} placeholder={"Preparation time"} onChange={e => setPrepTime(e.target.value)}/>
        <input type="number" value={cookTime} placeholder={"Cooking time"} onChange={e => setCookTime(e.target.value)}/>
        <input type="number" value={servings} placeholder={"Number of servings"} onChange={e => setServings(e.target.value)}/>

        <ReactTags
          allowNew
          newTagText='Create new tag: '
          ref={reactTags}
          tags={tags}
          onDelete={onDeleteTags}
          onAddition={onAdditionTags}
          suggestions={suggestion_tags}
          maxSuggestionsLength={10}
          minQueryLength={1}
        />
        {/*// todo remove duplicate tags and ingredients */}
        <ReactTags
          allowNew
          newTagText='Create new ingredient: '
          ref={reactTags}
          tags={ingredients}
          onDelete={onDeleteIngredients}
          onAddition={onAdditionIngredients}
          suggestions={suggestion_ingredients}
          maxSuggestionsLength={10}
          minQueryLength={1}
          placeholderText='Add new ingredients'
        />

        <div>Ingredients:
          <ul>{ingredients.map(ingredient =>
            <li key={ingredient.name}>{ingredient.name}
              <input type="text"
                     placeholder={"Quantity"}
                     value={getQuantityIngredient(ingredient.name) || ''}
                     onChange={e => changeQuantityIngredient(e.target.value, ingredient.name)}
              /></li>
          )}
          </ul>
        </div>

        <button onClick={() => {sendRecipe()}}>{isUpdate ? "Update" : "Create new"}</button>
      </div>}
    </div>
  );
};

export default CreateRecipePage;

