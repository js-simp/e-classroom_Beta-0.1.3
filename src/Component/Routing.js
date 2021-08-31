import React from "react";
import { Route, Switch } from 'react-router-dom';
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
