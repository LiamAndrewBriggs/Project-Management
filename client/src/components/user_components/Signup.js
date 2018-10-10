import React, { Component } from 'react';

import '../../styles/signup.css';

class Signup extends Component {
    state = {
        emailerror: '',
        passworderror: '',
        nameerror: ''
    }

    logIn = async (e) => {

        e.preventDefault();

        if (this.refs.password.value === this.refs.confirmpassword.value) {
            if(!this.refs.name.value) {
                this.state.nameerror = "Please enter a name";
                this.setState(this.state);  
            }
            else {
                var data = {
                    email: this.refs.email.value,
                    password: this.refs.password.value,
                    name: this.refs.name.value
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

                const request = new Request('http://localhost:5000/user/signup', options);
                const response = await fetch(request);
                const status = await response.status;
                const body = await response.json();
                
                if(status === 200)
                {
                    this.props.history.push("/user/login");
                }
                else {
                    this.state.emailerror = body.message;
                    this.refs.password.value = null;
                    this.refs.confirmpassword.value = null;
                    this.setState(this.state);
                }
            }
        }
        else {
            this.state.passworderror = "Passwords do not match";
            this.setState(this.state);   
        }
    }
 
      render() {
        return (
            <div id="body">
                <div className="signupForm">
                    <header className="title">Sign Up</header>
                    <form onSubmit={this.logIn.bind(this)}>
                        <div id="input">
                            <p id="signupp"> Full Name </p>
                            <input id="inputfield" ref= "name" type="text" placeholder="Full Name" required />
                            <p id="errortext">{this.state.nameerror}</p>
                            <p id="signupp"> Email </p>
                            <input id="inputfield" ref= "email" type="email" placeholder="Email" required />
                            <p id="errortext">{this.state.emailerror}</p>
                            <p id="signupp"> Password </p>
                            <input type="password" id="inputfield" ref="password" placeholder="Password" required />
                            <p id="signupp"> Confirm Password </p>
                            <input type="password" id="inputfield" ref="confirmpassword" placeholder="Confirm Password" required />
                            <br/>
                            <p id="errortext">{this.state.passworderror}</p>
                            <input id="signupbutton" className="btn btn-primary" type="submit" value="Sign Up" />
                        </div>
                    </form>
                </div>
              </div>
          );
      }
}

export default Signup;