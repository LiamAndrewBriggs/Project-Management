import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Root from './components/route_components/Root';
import LogIn from './components/user_components/LogIn';
import SignUp from './components/user_components/Signup';

import Partys from './components/Partys';
import Party from './components/Party';
import PartyInvites from './components/PartyInvites';

import Users from './components/Users';
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
              <Route exact path="/user/partys" component={Partys} />
              <Route exact path="/user/partyinvites" component={PartyInvites} />
              <Route exact path="/user/partys/:partyID" component={Party} />
              <Route exact path="/user" component={Users} />
              <Route exact path="/user/:userID" component={User} />
              <Route component={LogIn} />
            </Switch>
          </Root>
        </div>
      </Router>
    );
  }
}

export default App;