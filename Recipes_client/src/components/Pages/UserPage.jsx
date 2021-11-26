import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getOneUser} from "../../stores/store";
import SingleRecipe from "../RecipeList/singleRecipe/SingleRecipe";
import RecipeList from "../RecipeList/RecipeList";

const UserPage = (props) => {
  const userId = props.match.params.id
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(getOneUser(userId))
  }, []);


  return (
    <div className="UserPage">
      {user && <div>
        <div className="user__name">{user.nickname}</div>
        <div className="user__instructions">{user.id}</div>
        <div className="authorOf">Author of  <RecipeList recipes={user.recipes}/></div>
        <div className="favourite">Favourite  <RecipeList recipes={user.favourite}/></div>

      </div>
      }
    </div>
  );
};

export default UserPage;
