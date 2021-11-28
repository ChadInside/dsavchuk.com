import React, {useEffect} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom'
import {Routes} from "../routes";
import Header from "./Header";
import {useDispatch} from "react-redux";
import {checkAuth} from "../stores/store";

const AppRouter = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(checkAuth())
    }
  }, []);

  return (
    <div>
      <Header/>
      <Switch>
        {
          Routes.map(({path, Component}) => <Route key={path} path={path} component={Component} exact/>
          )}
        <Redirect to={"/"}/>
      </Switch>

    </div>
  );
};

export default AppRouter;
