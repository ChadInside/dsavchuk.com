import React, {useState} from 'react';
import {useDispatch, useSelector,} from "react-redux";
import {getUsers, logout, sendUserLogin, sendUserRegister} from "../../stores/store";
import UserList from "../small/UserList";


const AuthPage = () => {
  const dispatch = useDispatch()

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const loginUser = useSelector(state => state.loginUser)
  const users = useSelector(state => state.users)
  const isAuth = useSelector(state => state.isAuth)


  function sendRegister(nickname, password) {
    dispatch(sendUserRegister(nickname, password))
  }

  function sendLogin(nickname, password) {
    dispatch(sendUserLogin(nickname, password))
  }


  return (
    <div className={"Auth"}>
      AUTH
      <div className={"postForm"}>
        <input type="text" value={nickname} placeholder={"nickname"} onChange={e => setNickname(e.target.value)}/>
        <input type="text" value={password} placeholder={"password"} onChange={e => setPassword(e.target.value)}/>
        <button onClick={() => {sendRegister(nickname, password)}}>Регистрация</button>
        <button onClick={() => {sendLogin(nickname, password)}}>Логин</button>
        <button onClick={()=>{dispatch(logout())}}>Logout</button>
        <p>Is Auth: {isAuth ? "true" : "false"}</p>


        <button onClick={()=>{dispatch(getUsers())}}>Get users</button>
        {users && <UserList users = {users}/>}

      </div>
    </div>
  );
};

export default AuthPage;
