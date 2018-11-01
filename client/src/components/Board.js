import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/kanban.css';
import 'react-web-tabs/dist/react-web-tabs.css';

import SideMenu from "./board_components/side_menu";

class Project extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sideDrawerOpen: false,
            user: '',
            tasks: [
                { name: "Default", id: "1", stage: "toDo" }
            ],
            moved: ''
        };
    }

    componentDidMount() {
        this.callApi()
            .then(res => {

                if (res.loggedIn === "No User") {
                    this.props.history.push("/user/login");
                }

                this.setState({
                    sideDrawerOpen: res.sliderOpen,
                    user: res.loggedIn,
                    tasks: res.Task
                })

            })
            .catch(err => console.log(err));
    }

    callApi = async () => {

        var path = this.props.location.pathname + this.props.location.search;
        const response = await fetch(path, {
            credentials: "include"
        });
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    onDragStart = (ev, id) => {
        console.log('dragstart:', id);
        ev.dataTransfer.setData("id", id);
    }

    onDragOver = (ev) => {
        ev.preventDefault();
    }

    onDrop = (ev, cat) => {
        let id = ev.dataTransfer.getData("id");
        var taskState;
        let tasks = this.state.tasks.filter((task) => {
            if (task.id === id) {
                task.stage = cat;
                taskState = cat;
            }
            return task;
        });

        this.setState({
            tasks: tasks
        }, this.setState(this.state))

        this.callUpdate(ev, id, taskState);
    }

    callUpdate = async (e, id, taskState) => {
        console.log(this.state);
        console.log(id);
        console.log(taskState);

        e.preventDefault();

        var body = [];

        body[0] = {
            "propName": "stage", "value": taskState,
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

        console.log(window.location.pathname + "?view=false&activetask=" + id)

        const request = new Request(window.location.pathname + "?view=false&activetask=" + id, options);
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

    toggleHandler = () => {
        this.setState((prevState) => {
            return { sideDrawerOpen: !prevState.sideDrawerOpen };
        });
    };

    backdropClickHandler = () => {
        this.setState({ sideDrawerOpen: false });
    };


    render() {

        var tasks = {
            toDo: [],
            doing: [],
            complete: []
        }

        this.state.tasks.forEach((t) => {
            tasks[t.stage].push(
                <div key={t.name}
                    onDragStart={(e) => this.onDragStart(e, t.id)}
                    draggable
                    className="draggable"
                >
                    {t.name}
                </div>
            );
        });

        let container = "container-drag";

        if (this.state.sideDrawerOpen === true) {
            container = "container-drag open"
        }


        return (
            <div id="teamBody">
                <div id="headerLine">
                    <h3> Your Projects </h3>
                    <div id="adminButtons">
                        <button id="editButton" type="button" onClick={() => this.toggleHandler()} className="btn btn-primary">Create</button>
                    </div>
                </div>
                <div className={container}>
                    <div className="toDo"
                        onDragOver={(e) => this.onDragOver(e)}
                        onDrop={(e) => { this.onDrop(e, "toDo") }}>
                        <span className="task-header">TO DO</span>
                        {tasks.toDo}
                    </div>
                    <div className="doing"
                        onDragOver={(e) => this.onDragOver(e)}
                        onDrop={(e) => { this.onDrop(e, "doing") }}>
                        <span className="task-header">DOING</span>
                        {tasks.doing}
                    </div>
                    <div className="done"
                        onDragOver={(e) => this.onDragOver(e)}
                        onDrop={(e) => this.onDrop(e, "complete")}>
                        <span className="task-header">DONE</span>
                        {tasks.complete}
                    </div>
                    <SideMenu show={this.state.sideDrawerOpen} content={this.props.location.search} />
                </div>
            </div>

        )


    }
}

export default Project;