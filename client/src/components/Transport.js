import React, { Component } from 'react';
import '../styles/singleElement.css';

class Transport extends Component {
    state = {
        userlevel: '',
        id: '',
        name: '',
        price: '',
        image: '',
        location: '',
        website: '',
        mincarsize: '',
        maxcarsize: '', 
        edit: false
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
                price: res.doc.price,
                image: res.doc.image,
                location: res.doc.location,
                website: res.doc.website,
                mincarsize: res.doc.mincarsize,
                maxcarsize: res.doc.maxcarsize
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

    onNavigateHome() {
        this.props.history.push("/transports");
    }

    editTrigger() {
        this.setState({
            edit: true
        })
        this.setState(this.state);
    }

    cancelTrigger() {
        this.setState({
            edit: false
        })
        this.setState(this.state);
    }

    editVenue = async (e) => {

        e.preventDefault();

        var body = [];

        body[0] = {
            "propName": "name", "value": this.refs.name.value,
        }  

        body[1] = {
            "propName": "price", "value": this.refs.price.value,
        }    

        body[2] = {
            "propName": "image", "value": this.refs.image.value,
        }    

        body[3] = {
            "propName": "location", "value": this.refs.location.value,
        }  

        body[4] = {
            "propName": "website", "value": this.refs.website.value,
        }  

        body[5] = {
            "propName": "mincarsize", "value": this.refs.mincarsize.value,
        }  

        body[6] = {
            "propName": "maxcarsize", "value": this.refs.maxcarsize.value,
        }  

        console.log(body);

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

    deleteVenue = async (e) => {

        e.preventDefault();

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
            this.props.history.push("/transports");
        }
    }
    
    render() {
        var button = '';
        if (this.state.userlevel === 1)
        {
            button = <div id="adminButtons">
                        <form onSubmit={this.deleteVenue.bind(this)}>
                            <button id="editButton" type="button" onClick={() => this.editTrigger()} className="btn btn-primary">Edit</button>
                            <input id="deleteButton" className="btn btn-primary" type="submit" value="Delete" />
                        </form>
                    </div>;
        }   
        
        if(this.state.edit) {
            return (
                <div id="singleBody">
                    <form onSubmit={this.editVenue.bind(this)}>
                        <div id="headerLine">
                            <h3>Edit {this.state.name} </h3>
                            <div id="adminButtons">
                                <button id="deleteButton" type="button" onClick={() => this.cancelTrigger()} className="btn btn-primary">Cancel</button>
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
                                    <label> Price Per Mile: </label>
                                    <input id="inputs" ref= "price" type="text" defaultValue={this.state.price} required />
                                    <br/> <br/>
                                    <label> Image: </label>
                                    <input id="inputs" ref= "image" type="text" defaultValue={this.state.image} required />
                                    <br/> <br/>
                                    <label> Location: </label>
                                    <input id="inputs" ref= "location" type="text" defaultValue={this.state.location} required />
                                    <br/> <br/>
                                    <label> Website: </label>
                                    <input id="inputs" ref= "website" type="text" defaultValue={this.state.website} required />
                                    <br/> <br/>
                                    <label> Minimum Car Size: </label>
                                    <input id="inputs" ref= "mincarsize" type="number" defaultValue={this.state.mincarsize} required />
                                    <br/> <br/>
                                    <label> Maximum Car Size: </label>
                                    <input id="inputs" ref= "maxcarsize" type="number" defaultValue={this.state.maxcarsize} required />
                                    <br/> <br/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        } 
        else {

            return (
                <div id="singleBody">
                    <div id="headerLine">
                        <button id="backButton" onClick={() => this.onNavigateHome()} className="btn btn-primary">Back To Transporters</button>
                        <h3> {this.state.name} </h3>
                        {button}
                    </div>
                    <div className="container">
                    <div className="row">
                        <div className="col-sm-7">
                            <img id="singleimage" src={this.state.image} alt={this.state.name}/>
                        </div>
                        <div className="col-sm-5">
                            <div id="info">
                                <p> Price Per Mile: {this.state.price} </p>
                                <br/>
                                <p> Location: {this.state.location} </p>
                                <br/>
                                <p> Minimum Car Size: {this.state.mincarsize} </p>
                                <br/>
                                <p> Maximum Car Size: {this.state.maxcarsize} </p>
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
}

export default Transport;