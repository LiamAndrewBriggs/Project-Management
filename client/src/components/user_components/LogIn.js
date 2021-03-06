import React, { Component } from 'react';

import '../../styles/login.css';

class LogIn extends Component {
    state = {
        error: ''
    }

    logIn = async (e) => {

        e.preventDefault();

        var data = {
            email: this.refs.email.value,
	        password: this.refs.password.value
        }

        const options = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        }

        const request = new Request('http://localhost:5000/user/login', options);
        const response = await fetch(request);
        const status = await response.status;
        const body = await response.json();
        
        if(status === 200)
        {
            this.props.history.push("/user/partys");
        }
        else {
            this.state.error = body.message;
            this.refs.email.value = null;
            this.refs.password.value = null;
            this.setState(this.state);
        }
    }
 
      render() {
        return (
            <div id="body">
                <div className="loginForm">
                    <header className="title">Login</header>
                    <form onSubmit={this.logIn.bind(this)}>
                        <div id="input">
                            <p id="loginp"> Email </p>
                            <input className="loginputfield" ref= "email" type="text" placeholder="Email" />
                            <p id="loginp"> Password </p>
                            <input className="loginputfield" ref="password" type="password" placeholder="Password" />
                            <br/>
                            <p id="errortext">{this.state.error}</p>
                            <input id="loginbutton" className="btn btn-primary" type="submit" value="Log In" />
                        </div>
                    </form>
                    <a id="logInA" href="/user/signup">Sign Up</a>
                </div>
              </div>
          );
      }
}

export default LogIn;