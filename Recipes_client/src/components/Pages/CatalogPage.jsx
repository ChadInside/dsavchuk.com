import React, {useEffect, useState} from 'react';
import RecipeList from "../RecipeList/RecipeList";
import my_face_when from "../../assets/my_face_when.png";
import {getCatalog} from "../../stores/store";
import {useDispatch, useSelector} from "react-redux";
import PostForm from "../small/PostForm";

const CatalogPage = () => {
  const dispatch = useDispatch()
  const catalog = useSelector(state => state.catalog)
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    dispatch(getCatalog())
  }, []);


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
    const result = catalog.filter(recipe => {
      return search(recipe, searchTerms)
    })
    setSearchResults(result)
  }, [searchQ])


  return (
    <div className={"Catalog"}>
      <img src={my_face_when} alt="my_face_when.png"/>
      <div className="searchBar">
        <input type="text" placeholder="Search (name, tags, ingredients)" value={searchQ} onChange={e => {setSearchQ(e.target.value)}}/>
      </div>

      <div className="searchBar-tags"></div>

      <PostForm/>


      <RecipeList recipes={searchResultsOrCatalog()}/>


    </div>
  );
};

export default CatalogPage;
