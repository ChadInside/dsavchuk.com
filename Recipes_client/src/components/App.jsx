import React from "react";
import {Provider} from 'react-redux'
import {store} from '../stores/store'
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./AppRouter";


function App() {


  return (
    <BrowserRouter className="App">
      <Provider store={store}> <AppRouter/></Provider>
    </BrowserRouter>

  );

}

export default App;
