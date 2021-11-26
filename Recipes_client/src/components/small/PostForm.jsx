import React, {useState} from 'react';
import {sendRecipeThunk} from "../../stores/store";
import {useDispatch} from "react-redux";

const PostForm = () => {
  const dispatch = useDispatch()
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');

  function sendRecipe(name, instructions) {
    dispatch(sendRecipeThunk({name, instructions}))
  }

  return (

    <div className={"postForm"}>
      <input type="text" value={name} placeholder={"Name"} onChange={e => setName(e.target.value)}/>
      <input type="text" value={instructions} placeholder={"Instructions"} onChange={e => setInstructions(e.target.value)}/>
      <button onClick={() => {sendRecipe(name, instructions)}}>Отправить</button>
    </div>

  );
};

export default PostForm;
