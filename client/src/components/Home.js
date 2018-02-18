import React, { Component } from 'react';
import '../styles/home.css';

class Home extends Component {
    
    render() {
        return (
            <div id="body">
                <div className="row">
                    <div className="col-sm-4">
                        <h1>Everything you need to plan a party, all in one place</h1>
                    </div>
                    <div className="col-sm-8">
                        <img src={require("../images/office-party.jpg")} alt="Office Party"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;