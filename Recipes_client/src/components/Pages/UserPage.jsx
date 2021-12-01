import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getOneUser, sendChangePassword, sendUserRegister} from "../../stores/store";
import RecipeList from "../RecipeList/RecipeList";

const UserPage = (props) => {
  const userId = props.match.params.id
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    dispatch(getOneUser(userId))
  }, []);

  function changePassword(password, newPassword) {
      dispatch(sendChangePassword(password, newPassword))
  }

  return (
    <div className="UserPage">
      {user && <div>
        <div className="user__name">{user.nickname}</div>
        <div className="user__id">{user.id}</div>
        <div className="changePassword">
          <input type="text" value={password} placeholder={"password"} onChange={e => setPassword(e.target.value)}/>

          <input type="text" value={newPassword} placeholder={"new password"} onChange={e => setNewPassword(e.target.value)}/>

          <button onClick={() => {changePassword(password, newPassword)}}>Change password</button>

        </div>
        <div className="authorOf"><h2>Author of</h2>
          <RecipeList recipes={user.recipes}/></div>
        <div className="favourite"><h2>Favourite</h2>  <RecipeList recipes={user.favourite}/></div>

      </div>
      }
    </div>
  );
};

export default UserPage;
