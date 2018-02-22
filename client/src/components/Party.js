import React, { Component } from 'react';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import '../styles/singleElement.css';
import '../styles/party.css';
import 'react-web-tabs/dist/react-web-tabs.css';

class Venue extends Component {
    state = {
        userlevel: '',
        _id: '',
        user: '',
        description: '',
        startDate: '',
        endDate: '',
        invitedGuests: '',
        chosenVenue: {
            _id: '',
            name: '',
            url: ''
        },
        chosenCaterer: {
            _id: '',
            name: '',
            url: ''
        },
        chosenEntertainment: {
            _id: '',
            name: '',
            url: ''
        },
        chosenTransport: {
            _id: '',
            name: '',
            url: ''
        },
        venues: '',
        caterers: '',
        entertainment: '',
        transport: '',
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
                user: res.loggedIn,
                _id: res.doc._id,
                name: res.doc.name,
                description: res.doc.description,
                startDate: res.doc.startDate,
                endDate: res.doc.endDate,
                invitedGuests: res.doc.invitedGuests,
                chosenVenue: {
                    _id: res.doc.venue,
                },
                chosenCaterer: {
                    _id: res.doc.catering,
                },
                chosenEntertainment: {
                    _id: res.doc.entertainment,
                },
                chosenTransport: {
                    _id: res.doc.transport,
                }
            })

            this.getChosenVenue();
            this.getChosenCaterer();
            this.getChosenEntertainment();
            this.getChosenTransport();


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

        this.getVenues();
        this.getCaterers();
        this.getEntertainment();
        this.getTransport();
    
        return body;
    };

    getVenues = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/venues', options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                venues: result
            })

        }
        else {
            console.log(result);
        }
    }

    getChosenVenue = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/venues/' + this.state.chosenVenue._id, options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                chosenVenue: {
                    name: result.doc.name,
                    url: 'http://localhost:3000/venues/' + this.state.chosenVenue._id
                }
            })

        }
        else {
            console.log(result);
        }
    }

    getCaterers = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/caterings', options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                caterers: result
            })
        }
        else {
            console.log(result);
        }
    }

    getChosenCaterer = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/caterings/' + this.state.chosenCaterer._id, options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                chosenCaterer: {
                    name: result.doc.name,
                    url: 'http://localhost:3000/caterings/' + this.state.chosenCaterer._id
                }
            })

        }
        else {
            console.log(result);
        }
    }

    getEntertainment = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/entertainments', options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                entertainment: result
            })
        }
        else {
            console.log(result);
        }
    }

    getChosenEntertainment = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/entertainments/' + this.state.chosenEntertainment._id, options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                chosenEntertainment: {
                    name: result.doc.name,
                    url: 'http://localhost:3000/entertainments/' + this.state.chosenEntertainment._id
                }
            })

        }
        else {
            console.log(result);
        }
    }

    getTransport = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/transports', options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                transport: result
            })
        }
        else {
            console.log(result);
        }
    }

    getChosenTransport = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/transports/' + this.state.chosenTransport._id, options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                chosenTransport: {
                    name: result.doc.name,
                    url: 'http://localhost:3000/transports/' + this.state.chosenTransport._id
                }
            })

        }
        else {
            console.log(result);
        }
    }

    onNavigateHome() {
        this.props.history.push("/user/partys");
    }

    editTrigger() {
        this.setState({
            edit: true
        }, this.setState(this.state))
    }

    cancelTrigger() {
        this.setState({
            edit: false
        }, this.setState(this.state))
    }

    editParty = async (e) => {

        e.preventDefault();

        var body = [];

        body[0] = {
            "propName": "name", "value": this.refs.name.value,
        }  

        body[1] = {
            "propName": "description", "value": this.refs.description.value,
        }  

        body[2] = {
            "propName": "startDate", "value": this.refs.startDate.value,
        }  

        body[3] = {
            "propName": "endDate", "value": this.refs.endDate.value,
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

    deleteParty = async (e) => {

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
            var partys = this.state.user.partys;
            
            for (var i = partys.length - 1; i >= 0; --i) {
                if (partys[i] === this.state._id) {
                    console.log("test");
                    partys.splice(i,1);
                }
            }

            const secondOptions = {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(partys)
            }
    
            const secondRequest = new Request("/user/" + this.state.user._id, secondOptions);
            const secondResponse = await fetch(secondRequest);
            const secondStatus = await secondResponse.status;
            const secondResult = await secondResponse.json();
    
            if(secondStatus === 200)
            {
                this.props.history.push("/user/partys");
            }
            else {
                console.log(secondResult);
            }
        }
    }

    inviteGuest = async (e) => {
        e.preventDefault();

        var userID = '';
        var userName = '';
       
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/user', options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200) {
            for(var i = 0; i < result.count; i++)
            {
                if(this.refs.invite.value === result.users[i].email)
                {
                    userID = result.users[i]._id;
                    userName = result.users[i].name;
                }
            }
        }
        else {
            console.log(result);
        }

        if(userID === '')
        {
            this.refs.invite.value = "Email is invalid"
        }
        else
        {
            var secondBody = [];

            var invitedGuests = this.state.invitedGuests;

            var toAdd = {
                "_userID" : userID,
                "userName": userName,
                "response": "invited"
            }

            invitedGuests.push(toAdd);

            secondBody[0] = { "propName": "invitedGuests", "value": invitedGuests }
            
            const secondOptions = {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(secondBody)
            }
    
            const secondRequest = new Request("/user/partys/" + this.state._id, secondOptions);
            const secondResponse = await fetch(secondRequest);
            const secondStatus = await secondResponse.status;
            const secondResult = await secondResponse.json();
    
            if(secondStatus === 200)
            {
                window.location.reload();
            }
            else {
                console.log(secondResult);
            }
        }
        
    }

    render() {

        var invitedNames = [];
        var goingNames = [];
        var declinedNames = [];
        for (var i = 0; i < this.state.invitedGuests.length; i++) {
            
            if(this.state.invitedGuests[i].response === 'invited') {
                invitedNames.push(
                    <p key={i}> {this.state.invitedGuests[i].userName} </p>
                    
                );
            } 
            else if(this.state.invitedGuests[i].response === 'going') {
                goingNames.push(
                    <p key={i}> {this.state.invitedGuests[i].userName} </p>
                    
                );
            }
            else if(this.state.invitedGuests[i].response === 'declined') {
                declinedNames.push(
                    <p key={i}> {this.state.invitedGuests[i].userName} </p>
                    
                );
            }
            
        }

        var venues = [];

        for (i = 0; i < this.state.venues.count; i++)
        {
            venues.push(
                <option key={i} value={this.state.venues.venues[i]._id}> {this.state.venues.venues[i].name}</option>
            );
        }

        var caterers = [];

        for (i = 0; i < this.state.caterers.count; i++)
        {
            caterers.push(
                <option key={i} value={this.state.caterers.caterings[i]._id}> {this.state.caterers.caterings[i].name}</option>
            );
        }

        var entertainment = [];

        for (i = 0; i < this.state.entertainment.count; i++)
        {
            entertainment.push(
                <option key={i} value={this.state.entertainment.entertainment[i]._id}> {this.state.entertainment.entertainment[i].name}</option>
            );
        }

        var transport = [];

        for (i = 0; i < this.state.transport.count; i++)
        {
            transport.push(
                <option key={i} value={this.state.transport.transports[i]._id}> {this.state.transport.transports[i].name}</option>
            );
        }

        // if (this.state.userlevel === 0)
        // {
        //     return (
        //         <div id="headerLine">
        //             <h3 id="headererror">Please Login </h3>
        //         </div>
        //     );
        // }

        if(this.state.edit) {
            return (
                <div id="singleBody">
                    <form onSubmit={this.editParty.bind(this)}>
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
                                    <br/> <br/>
                                    <label> Description: </label>
                                    <textarea id="areainputs" ref= "description" type="text" defaultValue= {this.state.description} required />
                                    <br/> <br/>
                                    <label> Start Date: </label>
                                    <input id="inputs" ref= "startDate" type="datetime-local" defaultValue={this.state.startDate} required />
                                    <br/> <br/>
                                    <label> End Date: </label>
                                    <input id="inputs" ref= "endDate" type="datetime-local" defaultValue={this.state.endDate} required />
                                    <br/> <br/>
                                    <label> Venue:</label>
                                    <select ref="venue" id ="inputs">
                                        {venues}
                                    </select>
                                    <label> Caterers:</label>
                                    <select ref="caterer" id ="inputs">
                                        {caterers}
                                    </select>
                                    <label> Entertainment:</label>
                                    <select ref="entertainment" id ="inputs">
                                        {entertainment}
                                    </select>
                                    <label> Transport:</label>
                                    <select ref="transport" id ="inputs">
                                        {transport}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        } 
        else {
            var startDate = new Date(this.state.startDate);
            startDate = startDate.toUTCString();
            startDate = startDate.replace('GMT', '');

            var endDate = new Date(this.state.endDate);
            endDate = endDate.toUTCString();
            endDate = endDate.replace('GMT', '');

            return (
                <div id="singleBody">
                    <div id="headerLine">
                        <button id="backButton" onClick={() => this.onNavigateHome()} className="btn btn-primary">Back To Partys</button>
                        <h3> {this.state.name} </h3>
                        <div id="adminButtons">
                        <form onSubmit={this.deleteParty.bind(this)}>
                            <button id="editButton" type="button" onClick={() => this.editTrigger()} className="btn btn-primary">Edit</button>
                            <input id="deleteButton" className="btn btn-primary" type="submit" value="Delete" />
                        </form>
                        </div>
                    </div>
                    <p id="description"> {this.state.description} </p>
                    <br/>
                    <div id = "date">
                        <p> Start: {startDate} </p>
                        <p id ="endDate"> End: {endDate} </p>
                    </div>
                    <div id="container" className="container">
                        <div className="row">
                            <div id="left" className="col-sm-5">
                                <div id="info">
                                    <p> Venue: <a id="links" href={this.state.chosenVenue.url}> {this.state.chosenVenue.name} </a> </p>
                                    <br/>
                                    <p> Caterers: <a id="links" href={this.state.chosenCaterer.url}> {this.state.chosenCaterer.name} </a> </p>
                                    <br/>
                                    <p> Entertainment: <a id="links" href={this.state.chosenEntertainment.url}> {this.state.chosenEntertainment.name} </a> </p>
                                    <br/>
                                    <p> Transport:  <a id="links" href={this.state.chosenTransport.url}> {this.state.chosenTransport.name} </a> </p>
                                    <br/> <br/> <br/> <br/> <br/> <br/>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <form onSubmit={this.inviteGuest.bind(this)}>
                                    <input id="inviteInput" ref= "invite" type="text" placeholder="Enter Email Address" required />
                                    <input id="inviteButton" className="btn btn-primary" type="submit" value="Invite" />
                                </form>
                                <div id="tabs">
                                    <Tabs defaultTab="one">
                                        <TabList>
                                            <Tab tabFor="one">Going</Tab>
                                            <Tab tabFor="two">Not Going</Tab>
                                            <Tab tabFor="three">Invited</Tab>
                                        </TabList>
                                        <TabPanel tabId="one">
                                            <div id="content">
                                                {goingNames}  
                                            </div>
                                        </TabPanel>
                                        <TabPanel tabId="two">
                                            <div id="content">
                                                {declinedNames}  
                                            </div>
                                        </TabPanel>
                                        <TabPanel tabId="three">
                                            <div id="content">
                                                {invitedNames}  
                                            </div>
                                        </TabPanel>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            );
        }
    }
}

export default Venue;