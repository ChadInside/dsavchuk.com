import React, {useEffect, useState} from 'react';
import RecipeList from "../RecipeList/RecipeList";
import my_face_when from "../../assets/my_face_when.png";
import {getCatalog, sendRecipeThunk} from "../../stores/store";
import {useDispatch, useSelector} from "react-redux";
import PostForm from "../small/PostForm";

const CatalogPage = () => {
  const dispatch = useDispatch()
  const catalog = useSelector(state => state.catalog)
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  function handleChange(event) {
    setSearchQ(event.target.value)
  }

  useEffect(() => {
    dispatch(getCatalog())
  }, []);

  useEffect(() => {
    const result = catalog.filter(recipe => recipe.name.toLowerCase().includes(searchQ.toLowerCase()))
    setSearchResults(result)
  }, [searchQ])


  return (
    <div className={"Catalog"}>
      <img src={my_face_when} alt="my_face_when.png"/>
      <div className="searchBar">
        <input type="text" placeholder="Search" value={searchQ} onChange={handleChange}/>
      </div>

      <PostForm/>
      <RecipeList recipes={searchResults.length ? searchResults : catalog}/>
    </div>
  );
};

export default CatalogPage;
