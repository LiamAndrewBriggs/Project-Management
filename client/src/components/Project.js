import React, { Component } from 'react';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import '../styles/singleElement.css';
import '../styles/party.css';
import 'react-web-tabs/dist/react-web-tabs.css';

class Project extends Component {

    constructor(props) {
        super(props);

        this.state = {
            _id: '',
            ownerID: '',
            user: '',
            description: '',
            startDate: '',
            endDate: '',
            projectTeam: '',
            edit: false,
            memberToDelete: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleMemberDelete = this.handleMemberDelete.bind(this);
    }

    componentDidMount() {
        this.callApi()
            .then(res => {

                if (res.loggedIn === "No User") {
                    this.props.history.push("/user/login");
                }

                this.setState({
                    user: res.loggedIn,
                    _id: res.doc._id,
                    ownerID: res.doc.ownerID,
                    name: res.doc.name,
                    description: res.doc.description,
                    startDate: res.doc.startDate,
                    endDate: res.doc.endDate,
                    projectTeam: res.doc.projectTeam,
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
        this.props.history.push("/user/dashboard");
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

    handleChange(e) {
        this.setState({
            memberToDelete: e.target.value
        }, this.setState(this.state))
    }

    handleMemberDelete = async (e) =>  {

        if (this.state.memberToDelete === "") {
            alert('Please select a team member');
            this.setState({
                edit: true
            }, this.setState(this.state))

        }
        else {
            e.preventDefault();

            const options = {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }

            const request = new Request(window.location.pathname + "/" + this.state.memberToDelete, options);
            const response = await fetch(request);
            const status = await response.status;

            if (status === 200) {
                this.props.history.push("/user/dashboard");
            }
        }
    }

    editProject = async (e) => {

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

        body[4] = {
            "propName": "venue", "value": this.refs.venue.value,
        }

        body[1] = {
            "propName": "catering", "value": this.refs.caterer.value,
        }

        body[2] = {
            "propName": "entertainment", "value": this.refs.entertainment.value,
        }

        body[3] = {
            "propName": "transport", "value": this.refs.transport.value,
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

        if (status === 200) {
            window.location.reload();
        }
        else {
            console.log(result);
        }
    }

    deleteProject = async (e) => {

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

        if (status === 200) {
            this.props.history.push("/user/dashboard");
        }
    }

    inviteTeamMember = async (e) => {
        e.preventDefault();

        var userID = '';
        var userName = '';
        var projectInvite = '';

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

        if (status === 200) {
            for (var i = 0; i < result.count; i++) {
                if (this.refs.invite.value === result.user[i].email) {
                    userID = result.user[i]._id;
                    userName = result.user[i].name;
                    projectInvite = result.user[i].projects;
                }
            }
        }
        else {
            console.log(result);
        }

        if (userID === '') {
            this.refs.invite.value = "Email is invalid"
        }
        else {
            var secondBody = [];

            var projectTeam = this.state.projectTeam;

            var toAdd = {
                "_userID": userID,
                "userName": userName
            }

            projectTeam.push(toAdd);

            secondBody[0] = { "propName": "projectTeam", "value": projectTeam }

            const secondOptions = {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(secondBody)
            }

            const secondRequest = new Request("/user/dashboard/project/" + this.state._id, secondOptions);
            const secondResponse = await fetch(secondRequest);
            const secondStatus = await secondResponse.status;
            const secondResult = await secondResponse.json();

            if (secondStatus === 200) {

                var thirdBody = [];

                var teamInvite = [];

                teamInvite = projectInvite;

                toAdd = {
                    "projectID": this.state._id,
                }

                teamInvite.push(toAdd);

                thirdBody[0] = { "propName": "projects", "value": teamInvite }

                const thirdOptions = {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(thirdBody)
                }


                const thirdRequest = new Request("/user/" + userID, thirdOptions);
                const thirdResponse = await fetch(thirdRequest);
                const thirdStatus = await thirdResponse.status;
                const thirdResult = await thirdResponse.json();

                if (thirdStatus === 200) {
                    window.location.reload();
                }
                else {
                    console.log(thirdResult);
                }
            }
            else {
                console.log(secondResult);
            }
        }
    }


    render() {

        var teamMembers = [];
        var teamOptions = [];

        for (var i = 0; i < this.state.projectTeam.length; i++) {

            teamMembers.push(
                <p key={i}> {this.state.projectTeam[i].userName} </p>
            );

            teamOptions.push(
                <option key={i} value={this.state.projectTeam[i]._userID}>{this.state.projectTeam[i].userName}</option>
            );
        }

        var buttons = '';

        if (this.state.user._id === this.state.ownerID || this.state.userlevel === 1) {
            buttons = <div id="adminButtons">
                <button id="editButton" type="button" onClick={() => this.editTrigger()} className="btn btn-primary">Edit</button>
                <input id="deleteButton" className="btn btn-primary" type="submit" value="Delete" />
            </div>
        }

        if (this.state.edit) {
            return (
                <div id="singleBody">
                    <form onSubmit={this.editProject.bind(this)}>
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
                                    <input id="inputs" ref="name" type="text" defaultValue={this.state.name} required />
                                    <br /> <br />
                                    <label> Description: </label>
                                    <textarea id="areainputs" ref="description" type="text" defaultValue={this.state.description} required />
                                    <br /> <br />
                                    <label> Start Date: </label>
                                    <input id="inputs" ref="startDate" type="datetime-local" defaultValue={this.state.startDate} required />
                                    <br /> <br />
                                    <label> End Date: </label>
                                    <input id="inputs" ref="endDate" type="datetime-local" defaultValue={this.state.endDate} required />
                                    <br /> <br />
                                </div>
                            </div>
                        </div>
                    </form>
                    <form onSubmit={this.handleMemberDelete}>
                        <label>
                            Choose member to delete:
                            <select value={this.state.memberToDelete} onChange={this.handleChange}>
                                <option value="null">Please select a member</option>
                                {teamOptions}
                            </select>
                        </label>
                        <input type="submit" value="Submit" />
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
                            <form onSubmit={this.deleteProject.bind(this)}>
                                {buttons}
                            </form>
                        </div>
                    </div>
                    <p id="description"> {this.state.description} </p>
                    <br />
                    <div id="date">
                        <p> Start: {startDate} </p>
                        <p id="endDate"> End: {endDate} </p>
                    </div>
                    <div id="container" className="container">
                        <div className="row">
                            <div id="left" className="col-sm-5">
                                <div id="info">

                                </div>
                            </div>
                            <div className="col-sm-6">
                                <form onSubmit={this.inviteTeamMember.bind(this)}>
                                    <input id="inviteInput" ref="invite" type="text" placeholder="Enter Email Address" required />
                                    <input id="inviteButton" className="btn btn-primary" type="submit" value="Invite" />
                                </form>
                                <div id="tabs">
                                    <Tabs defaultTab="one">
                                        <TabList>
                                            <Tab tabFor="one">Members</Tab>
                                        </TabList>
                                        <TabPanel tabId="one">
                                            <div id="content">
                                                {teamMembers}
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

export default Project;