import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './components/Home';
import Root from './components/Root';
import Venues from './components/Venues';
import Venue from './components/Venue';
import Party from './components/Party';

class App extends Component {
  
  render() {
    return (
      <Router>
        <div>
          <Root>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/home" component={Home} />
              <Route exact path="/venues" component={Venues} />
              <Route path="/venues/:venueID" component={Venue} />
              <Route exact path="/party" component={Party} />
              <Route path="/party/:partyID" component={Party} />
            </Switch>
          </Root>
        </div>
      </Router>
    );
  }
}

export default App;