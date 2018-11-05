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
                { name: "", id: "1", stage: "default" }
            ],
            moved: ''
        };

        this.getData = this.getData.bind(this);
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
                    tasks: res.Tasks,
                    moved: res.activeTask
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

        const request = new Request(window.location.pathname + "?view=false&activetask=" + id, options);
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

            for (var i = 0; i < tasks.length; i++) {
                if (id === tasks[i]._taskID) {
                    tasks[i].taskStage = taskState;
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

    taskToggleHandler = async (ev, id) => {

        if (this.state.moved === id) {
            this.setState((prevState) => {
                return { sideDrawerOpen: !prevState.sideDrawerOpen, moved: '' };
            });
            this.props.history.push(window.location.pathname + "?view=false&activetask=none")
        }
        else {
            this.setState((prevState) => {
                return { sideDrawerOpen: true, moved: id };
            });
            this.props.history.push(window.location.pathname + "?view=true&activetask=" + id)
        }
    };

    toggleHandler = () => {



        this.setState((prevState) => {
            if (this.state.moved) {
                return { sideDrawerOpen: true, moved: '' };
            }
            else {
                return { sideDrawerOpen: !prevState.sideDrawerOpen, moved: '' };
            }

        });
        this.props.history.push(window.location.pathname + "?view=false&activetask=none")
    };

    getData(val) {
        this.setState({ sideDrawerOpen: false });
        this.props.history.push(window.location.pathname + "?view=false&activetask=none")
    }

    backdropClickHandler = () => {
        this.setState({ sideDrawerOpen: false });
    };


    render() {

        if (!this.state.user) {
            return (
                <div id="headerLine">
                    <h3 id="headererror">Please Log In </h3>
                </div>
            );
        }

        var tasks = {
            toDo: [],
            doing: [],
            complete: [],
            default: []
        }

        this.state.tasks.forEach((t) => {
            var p = "";
            t.assignedUsers.forEach((sq) => {
                var initials = sq.userName.match(/\b\w/g) || [];
                initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                p = p + initials + " ";
            })
            tasks[t.stage].push(
                <div key={t.name}
                    onDragStart={(e) => this.onDragStart(e, t.id)}
                    onClick={(e) => this.taskToggleHandler(e, t.id)}
                    draggable
                    className="draggable"
                >
                    {t.name}
                    <div className="squad">{p}</div>
                    <div className="points">{t.storyPoints}</div>
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
                    <SideMenu tasks={this.state.tasks} show={this.state.sideDrawerOpen} content={this.props.location.search} sendData={this.getData} />
                </div>
            </div>

        )


    }
}

export default Project;