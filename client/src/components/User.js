import React, { Component } from 'react';

class User extends Component {
    state = {
        response: '',
    };
    
    componentDidMount() {
       this.callApi()
        .then(res => this.setState({ response: res.name }))
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
          console.log(this.state);
          return (
              <div>
                  <h3>{this.state.response}</h3>
              </div>
          );
      }
}

export default User;