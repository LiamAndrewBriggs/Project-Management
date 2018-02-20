import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/tables.css';

class Partys extends Component {
    state = {
        count: '',
        partys: '',
        userLevel: 0,
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
                    partys: res.partys,
                    userLevel: userLevel
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

    cancelTrigger() {
        this.setState({ 
            count: this.state.count,
            partys: this.state.caterings,
            userLevel: this.state.userLevel,
            create: false
        })
    }

    createTrigger() {
        this.setState({ 
            count: this.state.count,
            partys: this.state.caterings,
            userLevel: this.state.userLevel,
            create: true
        })
    }

    navigateToLogin() {
        this.props.history.push("/user/login");
    }

  
    render() {
        var rows = [];
        for (var i = 0; i < this.state.count; i++) {
            rows.push(
                    <tr key={i}>
                        <td> <img src={this.state.partys[i].image} height="150" width="300" alt={this.state.partys[i].name}/> </td>
                        <td> {this.state.partys[i].name} </td>
                        <td> {this.state.partys[i].date} </td>
                        <td> <a id="tablelink" href={this.state.partys[i].request.url}> To Party Page </a> </td>
                    </tr>
                    
            );
        }

        if (this.state.userLevel === 0)
        {
            return (
                <div id="headerLine">
                    <h3 id="headererror">Please Login </h3>
                </div>
            );
        }

        if(this.state.create) {
            return (
                <div id="singleBody">
                    <form onSubmit={this.createVenue.bind(this)}>
                        <div id="headerLine">
                            <h3>Create Venue </h3>
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
                                    <label> Type: </label>
                                    <input id="inputs" ref= "type" type="text" placeholder="Type" required />
                                    <br/>
                                    <br/>
                                    <label> Price: </label>
                                    <input id="inputs" ref= "price" type="number" placeholder="Price" required />
                                    <br/>
                                    <br/>
                                    <label> Image: </label>
                                    <input id="inputs" ref= "image" type="text" placeholder="Image" required />
                                    <br/> <br/>
                                    <label> Capactity: </label>
                                    <input id="inputs" ref= "capactity" type="number" placeholder="Capacity" required />
                                    <br/> <br/>
                                    <label> Location: </label>
                                    <input id="inputs" ref= "location" type="text" placeholder="Location" required />
                                    <br/> <br/>
                                    <label> Website: </label>
                                    <input id="inputs" ref= "website" type="text" placeholder="Website" required />
                                    <br/> <br/>
                                    <label> Description: </label>
                                    <textarea id="areainputs" ref= "description" type="text" placeholder="Description" required />
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
                    <h3> Your Partys </h3>
                    <div id="adminButtons">
                        <button id="editButton" type="button" onClick={() => this.createTrigger()} className="btn btn-primary">Create</button>
                    </div>;
                </div>
                <table id="tables">
                    <thead>
                        <tr>
                            <th>Party </th>
                            <th>Party Name</th>
                            <th>Event Date</th>
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

export default Partys;