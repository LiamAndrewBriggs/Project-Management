import React, { Component } from 'react';
import '../styles/singleElement.css';

class Venue extends Component {
    state = {
        name: '',
        type: '',
        price: '',
        image: '',
        capactity: '',
        location: '',
        website: '',
        description: ''
    };
    
    componentDidMount() {
       this.callApi()
        .then(res => {
            this.setState({ 
                name: res.name,
                type: res.type,
                price: res.price,
                image: res.image,
                capactity: res.capactity,
                location: res.location,
                website: res.website,
                description: res.description
            })
        })
        .catch(err => console.log(err));
    }
    
    callApi = async () => {
        
        var path = this.props.location.pathname;
        const response = await fetch(path);
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    };

    onNavigateHome() {
        this.props.history.push("/venues");
    }

    render() {
        return (
            <div id="singleBody">
                <div id="headerLine">
                    <button id="backButton" onClick={() => this.onNavigateHome()} className="btn btn-primary">Back To Venues</button>
                    <h3> {this.state.name} </h3>
                </div>
                <div class="container">
                <div class="row">
                    <div class="col-sm-7">
                        <img src={this.state.image} alt={this.state.name}/>
                    </div>
                    <div class="col-sm-5">
                        <div id="info">
                            <p> Venue Type: {this.state.type} </p>
                            <br/>
                            <p> Description: {this.state.description} </p>
                            <br/>
                            <p> Location: {this.state.location} </p>
                            <br/>
                            <p> Party Capacity: {this.state.capactity} </p>
                            <br/>
                            <p> Price: £{this.state.price} </p>
                            <br/>
                            <p>Website: </p> <a id="websiteLink" href={this.state.website}> {this.state.website} </a>
                        </div>
                    </div>
                </div>
            </div>
                
            </div>
          );
      }
}

export default Venue;