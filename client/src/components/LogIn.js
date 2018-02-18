import React, { Component } from 'react';

import '../styles/login.css';

class LogIn extends Component {

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
            console.log(body);
            this.props.history.push("/partys");
        }
        else {
            console.log(body);
        }

        //console.log(data.email);
    }
 
      render() {
          return (
              <div id="body">
                <div className="loginForm">
                    <header className="title">Login</header>
                    <form onSubmit={this.logIn.bind(this)}>
                        <div id="input">
                            <p> Email </p>
                            <input ref= "email" type="text" placeholder="Email" />
                            <p> Password </p>
                            <input ref= "password" type="text" placeholder="Password" />
                            <br/>
                            <br/>
                            <input className="btn btn-primary" type="submit" value="Log In" />
                        </div>
                    </form>
                    <a id="logInA" href="/user/signup">Sign Up</a>
                </div>
              </div>
          );
      }
}

export default LogIn;