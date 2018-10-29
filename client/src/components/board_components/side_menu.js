import React, { Component } from 'react';
import { View } from 'react-native'
import Select from 'react-select';
import queryString from 'query-string'

import '../../styles/sideMenu.css';

class sideMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
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
        console.log(`Option selected:`, selectedOption);
    }

    createTask = async (e) => {

        e.preventDefault();

        var users = [];

        if(this.state.selectedOption != null) {
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
        const status = await response.status;
        const result = await response.json();

        if (status === 200) {
            window.location.reload();
        }
        else {
            this.state.error = result.message;
            this.setState(this.state);
        }
    }

    render() {

        let drawerClass = 'side-menu';
        const query = queryString.parse(this.props.content)
        const selectedOption = this.state.selectedOption;

        if (this.props.show) {
            drawerClass = 'side-menu open';
        }

        if (query.activetask === "none") {

            return (
                <nav className={drawerClass}>
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
                            <input className="inputfield" ref="taskName" type="text" placeholder="Task name" required/>
                            <p id="loginp"> Description </p>
                            <textarea className="inputfield" ref="description" type="text" placeholder="Description" rows="8" cols="45" required/>
                            <p id="loginp"> Story Points </p>
                            <select className="inputfield" ref="points" name="points">
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
            return null;
        }
    }
}

export default sideMenu;