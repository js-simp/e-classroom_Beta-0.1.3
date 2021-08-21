import React from "react";
import { BrowserRouter, Route, Switch,Link } from 'react-router-dom';
import Home from "./Home";
import Login from "./Authentication/Login";


function Routing() {
  return (
    <div >
          <Switch>
            <Route path="/" component={Login}  exact />
          </Switch>
    </div>
  );
}

export default Routing;
