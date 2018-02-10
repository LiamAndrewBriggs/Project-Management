import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Party extends Component {
    state = {
        response: '',
    };
    
    componentDidMount() {
       this.callApi()
        .then(res => this.setState({ response: res.express }))
        .catch(err => console.log(err));
    }
    
    callApi = async () => {
        
        var path = this.props.location.pathname;
        const response = await fetch(path);
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    };
  
      render() {
          return (
              <div>
                  <h3>{this.state.response}</h3>
              </div>
          );
      }
}

export default Party;