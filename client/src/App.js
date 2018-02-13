import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './components/Home';
import Root from './components/Root';
import User from './components/User';
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
              <Route path="/venues" component={User} />
              <Route exact path="/venues/:id" component={User} />
              <Route path="/party" component={Party} />
              <Route exact path="/party/:partyID" component={Party} />
            </Switch>
          </Root>
        </div>
      </Router>
    );
  }
}

export default App;