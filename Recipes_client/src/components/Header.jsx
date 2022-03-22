import React from 'react';
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";


const Header = () => {
  const loginUser = useSelector(state => state.loginUser)
  // const isAuth = useSelector(state => state.isAuth)

  return (
    <div className={"Header"}>
      <ul>
        <button><NavLink to={"/"}>Catalog </NavLink></button>
        <button><NavLink to={"/auth"}>Auth </NavLink></button>
        <button><NavLink to={"/new-recipe"}>New Recipe </NavLink></button>
        {loginUser.nickname && <button><NavLink to={`/user/${loginUser.id}`}> My account</NavLink></button>}
        <button><NavLink to={"/tags-ingredients"}>Tags and ingredients </NavLink></button>

      </ul>
      <div className={"AuthInfo"}>
        <span>{loginUser.nickname && `Welcome, ${loginUser.nickname}  `
        }</span>
      </div>
    </div>
  );
};

export default Header;
