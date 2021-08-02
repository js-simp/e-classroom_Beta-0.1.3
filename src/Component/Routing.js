import React from "react";
import { BrowserRouter, Route, Switch,Link } from 'react-router-dom';
import Home from "./Home";
import Login from "./Authentication/Login";
import Whiteboard from '../Component/Whiteboard/Whiteboard';
import Classroom from "../Component/Classroom/Classroom";

function Routing() {
  return (
    <div >
          <Switch>
            <Route path="/" component={Login}  exact />
            <Route path="/home" component={Home} />
            <Route path="/Whiteboard" component = {Whiteboard}/>
            <Route path="/Classroom" component = {Classroom}/>
          </Switch>
    </div>
  );
}

export default Routing;
