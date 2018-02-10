import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Home extends Component {
    state = {
        response: ''
      };
    
    componentDidMount() {
      this.callApi()
        .then(res => this.setState({ response: res.express }))
        .catch(err => console.log(err));
    }
    
    callApi = async () => {
      const response = await fetch('/home');
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

export default Home;