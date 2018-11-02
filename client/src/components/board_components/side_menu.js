import React, { Component } from 'react';
import { View } from 'react-native'
import Select from 'react-select';
import queryString from 'query-string'

import '../../styles/sideMenu.css';

class sideMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: props.tasks,
            selectedOption: null,
            error: ""
        };

    }

    componentDidMount() {
        this.callApi()
            .then(res => {

                if (res.loggedIn === "No User") {
                    this.props.history.push("/user/login");
                }

                var options = [];

                res.user.forEach(e => {
                    options.push({ value: e._id, label: e.name })
                });

                this.setState({
                    user: res.loggedIn,
                    options: options,
                    selectedOption: null
                })

            })
            .catch(err => console.log(err));
    }

    componentWillReceiveProps(props) {

        var selectedUsers = [];
        const query = queryString.parse(props.content)

        props.tasks.forEach(task => {
            if (task.id === query.activetask) {
                task.assignedUsers.forEach(e => {
                    selectedUsers.push({ value: e._id, label: e.userName })
                });
            }
        })

        this.setState({
            tasks: props.tasks,
            selectedOption: selectedUsers
        }, this.setState(this.state));


    }

    callApi = async () => {

        var path = "http://localhost:5000/user";
        const response = await fetch(path, {
            credentials: "include"
        });
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };


    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
    }

    createTask = async (e) => {

        e.preventDefault();

        var users = [];
        var tasks = [];
        var taskID;
        var taskName;

        if (this.state.selectedOption != null) {
            this.state.selectedOption.forEach(e => {
                users.push({ _userID: e.value, userName: e.label })
            });
        }

        var body = {
            "name": this.refs.taskName.value,
            "description": this.refs.description.value,
            "storyPoints": this.refs.points.value,
            "stage": "toDo",
            "assignedUsers": users,
            "url": window.location.pathname
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

        const request = new Request(window.location.pathname + this.props.content, options);
        const response = await fetch(request);
        const result = await response.json()
        const status = await response.status;

        if (status === 200) {

            taskID = await result.Task._id;
            taskName = await result.Task.name;
        }
        else {
            this.state.error = result.message;
            this.setState(this.state);
        }

        const secondoptions = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }

        const secondrequest = new Request('/user/dashboard' + window.location.pathname, secondoptions);
        const secondresponse = await fetch(secondrequest);
        const secondresult = await secondresponse.json();
        const secondstatus = await secondresponse.status;

        if (secondstatus === 200) {
            tasks = secondresult.doc.projectTasks;
        }
        else {
            console.log(secondresult);
            window.location.reload();
        }

        var toAdd = {
            "_taskID": taskID,
            "taskName": taskName,
            "taskStage": "toDo"
        }

        tasks.push(toAdd);

        var secondBody = [];

        secondBody[0] = { "propName": "projectTasks", "value": tasks }

        const thirdOptions = {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(secondBody)
        }


        const thirdRequest = new Request('/user/dashboard' + window.location.pathname, thirdOptions);
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

    updateTask = async (e) => {
        e.preventDefault();

        var users = [];
        var body = [];

        if (this.state.selectedOption != null) {
            this.state.selectedOption.forEach(e => {
                users.push({ _userID: e.value, userName: e.label })
            });
        }

        body[0] = {
            "propName": "name", "value": this.refs.taskName.value,
        }

        body[1] = {
            "propName": "description", "value": this.refs.description.value,
        }

        body[2] = {
            "propName": "storyPoints", "value": this.refs.points.value,
        }

        body[3] = {
            "propName": "assignedUsers", "value": users,
        }


        const options = {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        const request = new Request(window.location.pathname + this.props.content, options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if (status === 200) {
            var tasks = [];

            const secondoptions = {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }
    
            const secondrequest = new Request('/user/dashboard' + window.location.pathname, secondoptions);
            const secondresponse = await fetch(secondrequest);
            const secondresult = await secondresponse.json();
            const secondstatus = await secondresponse.status;
    
            if (secondstatus === 200) {
                tasks = secondresult.doc.projectTasks;
            }
            else {
                console.log(secondresult);
                window.location.reload();
            }

            const query = queryString.parse(this.props.content)

            for (var i = 0; i < tasks.length; i++) 
            {
                if(query.activetask === tasks[i]._taskID) {
                    tasks[i].taskName = this.refs.taskName.value;
                }
            }
                
            var secondBody = [];
    
            secondBody[0] = { "propName": "projectTasks", "value": tasks }
    
            const thirdOptions = {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(secondBody)
            }
    
    
            const thirdRequest = new Request('/user/dashboard' + window.location.pathname, thirdOptions);
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
            console.log(result);
        }
    }

    close() {
        this.props.sendData(false);
    }

    render() {

        let drawerClass = 'side-menu';
        const query = queryString.parse(this.props.content)
        const selectedOption = this.state.selectedOption;

        if (this.props.show || query.view === 'true') {
            drawerClass = 'side-menu open';
        }

        if (query.activetask === "none") {

            return (
                <nav className={drawerClass}>
                    <div className="closeButton">
                        <button id="xButton" type="button" onClick={() => this.close()} className="btn btn-primary">X</button>
                    </div>
                    <h1>New Task</h1>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                    />
                    <form id="createForm" onSubmit={this.createTask.bind(this)}>
                        <div id="input">
                            <p id="loginp"> Task Name </p>
                            <input className="inputfield" ref="taskName" type="text" placeholder="Task name" defaultValue="" required />
                            <p id="loginp"> Description </p>
                            <textarea className="inputfield" ref="description" type="text" placeholder="Description" defaultValue="" rows="8" cols="45" required />
                            <p id="loginp"> Story Points </p>
                            <select className="inputfield" ref="points" defaultValue="16" name="points">
                                <option value="16">16</option>
                                <option value="8">8</option>
                                <option value="4">4</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                            <p id="loginp"> User </p>
                            <div id="selectBox">
                                <Select
                                    value={selectedOption}
                                    isMulti
                                    onChange={this.handleChange}
                                    options={this.state.options}
                                />
                            </div>
                            <br />
                            <p id="errortext">{this.state.error}</p>
                            <input id="loginbutton" className="btn btn-primary" type="submit" value="Create" />
                        </div>
                    </form>
                </nav>
            );
        }
        else {

            var selectedTask = [];

            this.state.tasks.forEach(task => {
                if (task.id === query.activetask) {
                    selectedTask = task
                }
            })

            return (
                <nav className={drawerClass}>
                    <div className="closeButton">
                        <button id="xButton" type="button" onClick={() => this.close()} className="btn btn-primary">X</button>
                    </div>
                    <h1>{selectedTask.name}</h1>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                    />
                    <form id="createForm" onSubmit={this.updateTask.bind(this)}>
                        <div id="input">
                            <p id="loginp"> Task Name </p>
                            <input className="inputfield" ref="taskName" type="text" placeholder="Task name" defaultValue={selectedTask.name} required />
                            <p id="loginp"> Description </p>
                            <textarea className="inputfield" ref="description" type="text" placeholder="Description" value={selectedTask.description} rows="8" cols="45" required />
                            <p id="loginp"> Story Points </p>
                            <select className="inputfield" ref="points" name="points" value={selectedTask.storyPoints}>
                                <option value="16">16</option>
                                <option value="8">8</option>
                                <option value="4">4</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                            <p id="loginp"> User </p>
                            <div id="selectBox">
                                <Select
                                    value={selectedOption}
                                    isMulti
                                    onChange={this.handleChange}
                                    options={this.state.options}
                                />
                            </div>
                            <br />
                            <p id="errortext">{this.state.error}</p>
                            <input id="loginbutton" className="btn btn-primary" type="submit" value="Save" />
                        </div>
                    </form>
                </nav>
            );
        }
    }
}

export default sideMenu;