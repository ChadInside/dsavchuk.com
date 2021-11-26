import React, {useCallback, useEffect, useRef, useState} from 'react';
import {getCatalog, getSuggestionTags, sendRecipeThunk, setRedirect} from "../../stores/store";
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import ReactTags from "react-tag-autocomplete";
import "../../assets/createRecipePage.css"


// todo Ingredients []
//   Directions (1.1213 2.123123 3.123123)


const CreateRecipePage = () => {
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
  const redirectTo = useSelector(state => state.redirectTo)
  const reactTags = useRef()

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
    // fixme why so ugly?
    const newIngredientIndex = ingredients.findIndex(item => item.name === ingredientName)
    const newIngredient = ingredients[newIngredientIndex]
    newIngredient.quantity = quantityValue
    const ingredientsArray = Array.from(ingredients)
    ingredientsArray.splice(newIngredientIndex, 1, newIngredient)
    setIngredients(ingredientsArray)
  }, [ingredients])


  useEffect(() => {
    dispatch(getSuggestionTags())
  }, []);


  function sendRecipe() {
    dispatch(sendRecipeThunk({name, instructions, prepTime, cookTime, servings, ingredients, tags}))
  }

  if (redirectTo) {
    return <Redirect to={redirectTo}/>
  }


  return (

    <div>
      {redirectTo}
      create new recipe page
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
                       onChange={e => changeQuantityIngredient(e.target.value, ingredient.name)}
                /></li>
            )}
          </ul>
        </div>


        // todo autosuggestion of ingredients from total base
        // todo ingredients list with number of them
        // do just like with tags but create a ul with ingredient's name and field for quantity of said ingredient


        <button onClick={() => {sendRecipe(name, instructions)}}>Отправить</button>
      </div>}
    </div>
  );
};

export default CreateRecipePage;

