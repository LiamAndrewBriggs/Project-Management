import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/kanban.css';
import 'react-web-tabs/dist/react-web-tabs.css';

class Project extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: '',
            tasks: [
                { name: "Learn Angular", id: "1", category: "toDo", bgcolor: "yellow" },
                { name: "React", id: "2", category: "doing", bgcolor: "pink" },
                { name: "Vue", id: "3", category: "complete", bgcolor: "skyblue" }
            ]
        };

    }

    componentDidMount() {
        this.callApi()
            .then(res => {

                if (res.loggedIn === "No User") {
                    this.props.history.push("/user/login");
                }

                this.setState({
                    user: res.loggedIn,
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

        console.log(body);

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
        let tasks = this.state.tasks.filter((task) => {
            if (task.id === id) {
                task.category = cat;
            }
            return task;
        });

        this.setState({
            ...this.state,
            tasks
        });

        console.log(this.state);
    }

    render() {

        var tasks = {
            toDo: [],
            doing: [],
            complete: []
        }

        this.state.tasks.forEach((t) => {
            tasks[t.category].push(
                <div key={t.name}
                    onDragStart={(e) => this.onDragStart(e, t.id)}
                    draggable
                    className="draggable"
                    style={{ backgroundColor: t.bgcolor }}
                >
                    {t.name}
                </div>
            );
        });

        return (
            <div id="teamBody">
                <div id="headerLine">
                    <h3> Your Projects </h3>
                </div>
                <div className="container-drag">
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

                </div>
            </div>

        )


    }
}

export default Project;