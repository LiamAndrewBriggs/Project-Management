import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/tables.css';

class Projects extends Component {
    state = {
        count: '',
        projects: '',
        user: '',
        team: '',
        create: false
    };

    componentDidMount() {
        this.callApi()
            .then(res => {
                this.setState({
                    count: res.count,
                    projects: res.Projects,
                    user: res.loggedIn
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
            projects: this.state.caterings,
            userLevel: this.state.userLevel,
            create: false
        }, this.setState(this.state))
    }

    createTrigger() {
        this.setState({
            count: this.state.count,
            projects: this.state.caterings,
            userLevel: this.state.userLevel,
            create: true
        }, this.setState(this.state))
    }

    createProject = async (e) => {

        e.preventDefault();

        var body = {
            "name": this.refs.name.value,
            "description": this.refs.description.value,
            "startDate": this.refs.startDate.value,
            "endDate": this.refs.endDate.value,
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

        if (status === 200) {
            var secondBody = [];

            var userprojects = this.state.user.projects;

            var toAdd = result.Project._id;

            userprojects.push(toAdd);

            secondBody[0] = { "propName": "userProjects", "value": userprojects }

            const secondOptions = {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(secondBody)
            }

            const secondRequest = new Request("/user/" + this.state.user._id, secondOptions);
            const secondResponse = await fetch(secondRequest);
            const secondStatus = await secondResponse.status;
            const secondResult = await secondResponse.json();

            if (secondStatus === 200) {
                window.location.reload();
            }
            else {
                console.log(secondResult);
            }
        }
        else {
            console.log(result);
        }
    }


    render() {

        if (!this.state.user) {
            return (
                <div id="headerLine">
                    <h3 id="headererror">Please Log In </h3>
                </div>
            );
        }

        if (this.state.create) {

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }

            today = yyyy + '-' + mm + '-' + dd;


            return (
                <div id="singleBody">
                    <form onSubmit={this.createProject.bind(this)}>
                        <div id="headerLine">
                            <h3>Create Project </h3>
                            <div id="adminButtons">
                                <button id="deleteButton" type="button" onClick={() => this.cancelTrigger()} className="btn btn-primary">Cancel</button>
                                <input id="editButton" className="btn btn-primary" type="submit" value="Save" />
                            </div>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div id="editinfo">
                                    <label> Name: </label>
                                    <input id="inputs" ref="name" type="text" placeholder="Name" required />
                                    <br /> <br />
                                    <label> Description: </label>
                                    <textarea id="areainputs" ref="description" type="text" placeholder="Description" required />
                                    <br /> <br />
                                    <label> Start Date: </label>
                                    <input id="inputs" ref="startDate" type="datetime-local" min={today} max="3000-01-01T00:00" required />
                                    <br /> <br />
                                    <label> End Date: </label>
                                    <input id="inputs" ref="endDate" type="datetime-local" min={today} max="3000-01-01T00:00" required />
                                    <br /> <br />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
        else {

            var rows = [];
            for (var i = 0; i < this.state.count; i++) {
                var date = new Date(this.state.projects[i].date);
                date = date.toUTCString();
                rows.push(
                    <tr key={i}>
                        <td> {this.state.projects[i].name} </td>
                        <td> {date} </td>
                        <td> <a id="tablelink" href={this.state.projects[i].request.url}> To Project Page </a> </td>
                    </tr>

                );
            }

            return (
                <div id="teamBody">
                    <div id="headerLine">
                        <h3> Your Projects </h3>
                        <div id="adminButtons">
                            <button id="editButton" type="button" onClick={() => this.createTrigger()} className="btn btn-primary">Create</button>
                        </div>
                    </div>
                    <table id="tables">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Project Deadline</th>
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

export default Projects;