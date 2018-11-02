import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Root from './components/route_components/Root';
import LogIn from './components/user_components/LogIn';
import SignUp from './components/user_components/Signup';

import Projects from './components/Projects';
import Project from './components/Project';

import Board from './components/Board';
import User from './components/User';

class App extends Component {
  
  render() {
    return (
      <Router>
        <div>
          <Root>
            <Switch>
              <Route exact path="/" component={LogIn} />
              <Route exact path="/home" component={LogIn} />
              <Route exact path="/user/logout" component={LogIn} />
              <Route exact path="/user/login" component={LogIn} />
              <Route exact path="/user/signup" component={SignUp} />
              <Route exact path="/user/dashboard" component={Projects} />
              <Route exact path="/user/dashboard/project/:projectID" component={Project} />
              <Route exact path="/user/:userID" component={User} />
              <Route exact path="/project/:projID" component={Board} />
              <Redirect to="/user/dashboard" />
            </Switch>
          </Root>
        </div>
      </Router>
    );
  }
}

export default App;