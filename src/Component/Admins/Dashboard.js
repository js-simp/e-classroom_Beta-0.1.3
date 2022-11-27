import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from '../../Component/Navigation/Navigation'
import Home from './Home';
import CreateSessions from './CreateSessions';
import Registration from './Registration';
import LiveSessions from './LiveSessions';


function Dashboard() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/live_sessions' component={LiveSessions} />
        <Route path='/registration' component={Registration} />
        <Route path='/create_sessions' component={CreateSessions} />
      </Switch>
    </Router>

  )
}

export default Dashboard