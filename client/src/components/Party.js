import React, { Component } from 'react';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import '../styles/singleElement.css';
import '../styles/party.css';
import 'react-web-tabs/dist/react-web-tabs.css';

class Venue extends Component {
    state = {
        userlevel: '',
        _id: '',
        description: '',
        startDate: '',
        endDate: '',
        invitedGuests: '',
        confirmedGuests: '',
        declinedGuests: '',
        invitedGuestsNames: '',
        confirmedGuestsNames: '',
        declinedGuestsNames: '',
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
                _id: res.doc._id,
                name: res.doc.name,
                description: res.doc.description,
                startDate: res.doc.startDate,
                endDate: res.doc.endDate,
                invitedGuests: res.doc.invitedGuests, 
                invitedGuestsNames: res.doc.invitedGuestsNames
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
        this.props.history.push("/user/partys");
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
            this.props.history.push("/user/partys");
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

            var toAdd = userID;

            invitedGuests.push(toAdd);

            var invitedGuestsNames = this.state.invitedGuestsNames;

            toAdd = userName;

            invitedGuestsNames.push(toAdd);

            secondBody[0] = { "propName": "invitedGuests", "value": invitedGuests }
            secondBody[1] = { "propName": "invitedGuestsNames", "value": invitedGuestsNames }

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
        for (var i = 0; i < this.state.invitedGuestsNames.length; i++) {
            invitedNames.push(
                    <p key={i}> {this.state.invitedGuestsNames[i]} </p>
                    
            );
        }

        var goingNames = [];
        for (i = 0; i < this.state.confirmedGuestsNames.length; i++) {
            goingNames.push(
                    <p key={i}> {this.state.confirmedGuestsNames[i]} </p>
                    
            );
        }

        var declinedNames = [];
        for (i = 0; i < this.state.declinedGuestsNames.length; i++) {
            declinedNames.push(
                    <p key={i}> {this.state.declinedGuestsNames[i]} </p>
                    
            );
        }

        if (this.state.userlevel === 0)
        {
            console.log("test");
            return (
                <div id="headerLine">
                    <h3 id="headererror">Please Login </h3>
                </div>
            );
        }

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
                                    <p> Venue: </p>
                                    <br/>
                                    <p> Caterers: </p>
                                    <br/>
                                    <p> Entertainment: </p>
                                    <br/>
                                    <p> Transport:  </p>
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
                                                <p>Tab 1 content</p>
                                            </div>
                                        </TabPanel>
                                        <TabPanel tabId="two">
                                            <div id="content">
                                                <p>Tab 2 content</p>
                                                <p>Tab 2 content</p>
                                                <p>Tab 2 content</p>
                                                <p>Tab 2 content</p>
                                                <p>Tab 2 content</p>
                                                <p>Tab 2 content</p>
                                                <p>Tab 2 content</p>
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