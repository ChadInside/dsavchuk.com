import React from 'react';
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";


const Header = () => {
  const loginUser = useSelector(state => state.loginUser)
  // const isAuth = useSelector(state => state.isAuth)

  return (
    <div className={"Header"}>
      <ul>
        <NavLink to={"/"}>Catalog </NavLink>
        <NavLink to={"/auth"}>Auth </NavLink>
        <NavLink to={"/new-recipe"}>New Recipe </NavLink>
        {loginUser.nickname && <NavLink to={`/user/${loginUser.id}`}> My account</NavLink>}
      </ul>
      <div className={"AuthInfo"}>
        <span>{loginUser.nickname && `Welcome, ${loginUser.nickname}  `
        }</span>
      </div>
    </div>
  );
};

export default Header;
