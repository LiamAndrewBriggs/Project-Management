import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/tables.css';

class Entertainments extends Component {
    state = {
        count: '',
        entertainment: '',
        userLevel: '',
        create: false
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
                count: res.count,
                entertainment: res.entertainment,
                userLevel: userLevel
            })
        })
        .catch(err => console.log(err));
    }
    
    callApi = async () => {
        
        var path = this.props.location.pathname;
        const response = await fetch(path, {
            credentials: 'include'
        });
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    };

    cancelTrigger() {
        this.state.create = false;
        this.setState(this.state);
    }

    createTrigger() {
        this.state.create = true;
        this.setState(this.state);
    }

    createVenue = async (e) => {

        e.preventDefault();

        var body = {
            "name": this.refs.name.value,
            "price": this.refs.price.value,
            "image": this.refs.image.value,
            "location": this.refs.location.value,
            "website": this.refs.website.value,
            "genre": this.refs.genre.value,
        }  

        const options = {
            method: 'POST',
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



    render() {
        var rows = [];
        for (var i = 0; i < this.state.count; i++) {
            rows.push(
                    <tr key={i}>
                        <td> <img src={this.state.entertainment[i].image} height="150" width="300" alt={this.state.entertainment[i].name}/> </td>
                        <td> {this.state.entertainment[i].name} </td>
                        <td> {this.state.entertainment[i].genre} </td>
                        <td> <a id="tablelink" href={this.state.entertainment[i].request.url}> To Entertainment Page </a> </td>
                    </tr>
                    
            );
        }

        var button = '';
        if (this.state.userLevel === 1)
        {
            button =  <div id="adminButtons">
                        <button id="editButton" type="button" onClick={() => this.createTrigger()} className="btn btn-primary">Create</button>
                       </div>;
        }  

        if(this.state.create) {
            return (
                <div id="singleBody">
                    <form onSubmit={this.createVenue.bind(this)}>
                        <div id="headerLine">
                            <h3>Create Entertainment </h3>
                            <div id="adminButtons">
                                <button id="deleteButton" type="button" onClick={() => this.cancelTrigger()} className="btn btn-primary">Cancel</button>
                                <input id="editButton" className="btn btn-primary" type="submit" value="Save" />
                            </div>
                        </div>
                        <div className="container">
                        <div className="row">
                            <div id="editinfo">
                                    <label> Name: </label>
                                    <input id="inputs" ref= "name" type="text" placeholder="Name" required />
                                    <br/>
                                    <br/>
                                    <label> Price: </label>
                                    <input id="inputs" ref= "price" type="number" placeholder="Price" required />
                                    <br/>
                                    <br/>
                                    <label> Image: </label>
                                    <input id="inputs" ref= "image" type="text" placeholder="Image" required />
                                    <br/> <br/>
                                    <label> Location: </label>
                                    <input id="inputs" ref= "location" type="text" placeholder="Location" required />
                                    <br/> <br/>
                                    <label> Website: </label>
                                    <input id="inputs" ref= "website" type="text" placeholder="Website" required />
                                    <br/> <br/>
                                    <label> Genre: </label>
                                    <input id="inputs" ref= "genre" type="text" placeholder="Genre" required />
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
            <div id="venuesBody">
                <div id="headerLine">
                    <h3> Entertainment </h3>
                    {button}
                </div>
                <table id="tables">
                    <thead>
                        <tr>
                            <th>Entertainment </th>
                            <th>Act Name</th>
                            <th>Genre</th>
                            <th>More Info</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
          );
        }

        
      }
}

export default Entertainments;