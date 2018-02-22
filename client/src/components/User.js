import React, { Component } from 'react';
import '../styles/singleElement.css';

class User extends Component {
    state = {
        userlevel: '',
        id: '',
        name: '',
        email: '',
        password: '',
    };
    
    componentDidMount() {
       this.callApi()
        .then(res => {
            var userLevel = '';
            if(res.loggedIn === "No User") {
                userLevel = 0;
            }
            else {
                userLevel = res.loggedIn.userLevel;
            }
            
            this.setState({ 
                userlevel: userLevel,
                id: res.doc._id,
                name: res.doc.name,
                type: res.doc.email,
                price: res.doc.password
            })
        })
        .catch(err => console.log(err));
    }
    
    callApi = async () => {
        
        var path = this.props.location.pathname;
        const response = await fetch(path, {
            credentials: "include"
        });
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    };

    editUser = async (e) => {

        e.preventDefault();

        if(this.refs.newPassword.value === this.refs.confirmPassword.value )
        {
            var body = [];

            body[0] = {
                "propName": "name", "value": this.refs.name.value,
            }  

            body[1] = {
                "propName": "email", "value": this.refs.email.value,
            }

            if(this.refs.oldPassword.value !== '')
            {
                body[2] = {
                    "propName": "password", "value": this.refs.newPassword.value,
                }
            }

            const options = {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }

            const request = new Request(window.location.pathname, options);
            const response = await fetch(request);
            const status = await response.status;
            const result = await response.json();

            if(status === 200)
            {
                window.location.reload();
            }
            else {
                console.log(result);
            }
        }
    }

    deleteUser = async () => {

        const options = {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request(window.location.pathname, options);
        const response = await fetch(request);
        const status = await response.status;
                
        if(status === 200)
        {
            this.props.history.push("/home");
        }
    }
    
    render() {
                
        if(this.state.userlevel === 1 || this.state.userlevel === 2) {
            return (
                <div id="singleBody">
                    <form onSubmit={this.editUser.bind(this)}>
                        <div id="headerLine">
                            <h3>Edit Profile</h3>
                            <div id="adminButtons">
                                <button id="deleteButton" type="button" onClick={() => this.deleteUser()} className="btn btn-primary">Delete</button>
                                <input id="editButton" className="btn btn-primary" type="submit" value="Save" />
                            </div>
                        </div>
                        <div className="container">
                        <div className="row">
                            <div id="editinfo">
                                    <label> Name: </label>
                                    <input id="inputs" ref= "name" type="text" defaultValue={this.state.name} required />
                                    <br/>
                                    <br/>
                                    <label> Email: </label>
                                    <input id="inputs" ref= "email" type="text" defaultValue={this.state.type} required />
                                    <br/>
                                    <br/>
                                    <label> Old Password: </label>
                                    <input id="inputs" ref= "oldPassword" type="password" placeholder="Old Password" />
                                    <br/>
                                    <br/>
                                    <label> New Password: </label>
                                    <input id="inputs" ref= "newPassword" type="password" placeholder="New Password" />
                                    <br/> <br/>
                                    <label> New Password Confirmation: </label>
                                    <input id="inputs" ref= "confirmPassword" type="password" placeholder="Confirm New Password" />
                                    <br/> <br/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
        else {
            return(null);
        }

    }
}

export default User;