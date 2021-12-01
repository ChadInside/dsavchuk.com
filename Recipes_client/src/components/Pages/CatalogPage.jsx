import React, {useCallback, useEffect, useRef, useState} from 'react';
import RecipeList from "../RecipeList/RecipeList";
import my_face_when from "../../assets/my_face_when.png";
import {getCatalog, getSuggestionIngredients, getSuggestionTags} from "../../stores/store";
import {useDispatch, useSelector} from "react-redux";
import ReactTags from "react-tag-autocomplete";

const CatalogPage = () => {
  const dispatch = useDispatch()
  const catalog = useSelector(state => state.catalog)
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([])
  const [ingredients, setIngredients] = useState([]);
  const [tags, setTags] = useState([])
  const suggestion_tags = useSelector(state => state.suggestion_tags)
  const suggestion_ingredients = useSelector(state => state.suggestion_ingredients)
  const reactTags = useRef()

  useEffect(() => {
    dispatch(getCatalog())
    dispatch(getSuggestionTags())
    dispatch(getSuggestionIngredients())
  }, []);

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


  function search(recipe, searchTerms) {
    const results = []
    searchTerms.forEach((searchTerm, index) => {
      const isFound = recipe.name.toLowerCase().includes(searchTerm)
        || recipe.tags.some(tag => tag.name.toLowerCase().includes(searchTerm))
        || recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(searchTerm));

      results[index] = isFound
    })
    return results.every(item => item === true)
  }

  //fixme rename this
  function searchResultsOrCatalog() {
    if (searchQ.length === 0) return catalog;
    if (!searchQ.length && !searchResults.length) return catalog
    if (searchQ.length > 0) return searchResults;
  }


  useEffect(() => {
      const searchTerms = searchQ.split(',').map(item => item.trim().toLowerCase())
    const tagsTerms = tags.map(item => item.name)
    const ingredientsTerms = ingredients.map(item => item.name)
    // console.log("searchTerms", searchTerms)
    // console.log("tagsTerms", tagsTerms)
    // console.log("ingredientsTerms", ingredientsTerms)
    const finalTerms = searchTerms.concat(tagsTerms,ingredientsTerms)
    // const final2 = finalTerms.filter(item =>  item != '')
    const result = catalog.filter(recipe => {
      return search(recipe, finalTerms)  // final2
    })
    setSearchResults(result)
  }, [searchQ, tags, ingredients])


  return (
    <div className={"Catalog"}>
      <img src={my_face_when} alt="my_face_when.png"/>
      <div className="searchBar">
        <input type="text" placeholder="Search (name, tags, ingredients)" value={searchQ} onChange={e => {setSearchQ(e.target.value)}}/>
      </div>

      <div className="searchBar-tags">
        <ReactTags
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

      </div>




      <RecipeList recipes={searchResultsOrCatalog()}/>


    </div>
  );
};

export default CatalogPage;
