import React, { Component } from 'react';
import Header from './Header';

class Root extends Component {
    state = {
        user: '',
        projects: ''
    };
    
    getUser = async () => {
        const response = await fetch(window.location.pathname, {
            credentials: "include"
        });
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    };

    getProjects = async () => {
        const response = await fetch("http://localhost:3000/user/dashboard", {
            credentials: "include"
        });
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    };


    render() {
        if (!this.state.user) {
            this.getUser()
            .then(res => {
                this.getProjects()
                .then(proj => {
                    this.setState({ 
                        user: res.loggedIn,
                        projects: proj.Projects
                    })
                })
                .catch(err => console.log(err));       
            })
            .catch(err => console.log(err));
        }
        
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Header state={this.state}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Root;