import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './components/route_components/Home';
import Root from './components/route_components/Root';
import LogIn from './components/user_components/LogIn';
import SignUp from './components/user_components/Signup';

import Venues from './components/Venues';
import Venue from './components/Venue';

import Caterings from './components/Caterings';
import Catering from './components/Catering';

import Entertainments from './components/Entertainments';
import Entertainment from './components/Entertainment';

import Transports from './components/Transports';
import Transport from './components/Transport';

import Partys from './components/Partys';
import Party from './components/Party';


class App extends Component {
  
  render() {
    return (
      <Router>
        <div>
          <Root>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/user/login" component={LogIn} />
              <Route exact path="/user/logout" component={Home} />
              <Route exact path="/user/signup" component={SignUp} />
              <Route exact path="/venues" component={Venues} />
              <Route exact path="/venues/:venueID" component={Venue} />
              <Route exact path="/caterings" component={Caterings} />
              <Route exact path="/caterings/:cateringID" component={Catering} />
              <Route exact path="/entertainments" component={Entertainments} />
              <Route exact path="/entertainments/:entertainmentID" component={Entertainment} />
              <Route exact path="/transports" component={Transports} />
              <Route exact path="/transports/:transportID" component={Transport} />
              <Route exact path="/user/partys" component={Partys} />
              <Route exact path="/user/partys/:partyID" component={Party} />
            </Switch>
          </Root>
        </div>
      </Router>
    );
  }
}

export default App;