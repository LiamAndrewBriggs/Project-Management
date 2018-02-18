import React, { Component } from 'react';
import Header from './Header';

class Root extends Component {
    state = {
        user: '',
    };
    
    componentDidMount() {
       this.callApi()
        .then(res => {
            //console.log(res);
            this.setState({ 
                user: res.loggedIn
            })
        })
        .catch(err => console.log(err));
    }
    
    callApi = async () => {
        const response = await fetch(window.location.pathname);
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    };


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Header user={this.state.user}/>
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