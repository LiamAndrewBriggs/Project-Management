import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/project.css';
import 'react-web-tabs/dist/react-web-tabs.css';

class Project extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: ''
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
        console.log(path);
        const response = await fetch(path, {
            credentials: "include"
        });
        const body = await response.json();

        console.log(body);

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return(<p>test</p>)


    }
}

export default Project;