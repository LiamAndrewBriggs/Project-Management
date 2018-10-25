import React, { Component } from 'react';
import { View } from 'react-native'

import queryString from 'query-string'

import '../../styles/sideMenu.css';

class sideMenu extends Component {

    createTask = async (e) => {

        e.preventDefault();

        // var body = {
        //     "name": this.refs.name.value,
        //     "description": this.refs.description.value,
        //     "startDate": this.refs.startDate.value,
        //     "endDate": this.refs.endDate.value,
        // }

        console.log(this.refs);

        // const options = {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(body)
        // }

        // const request = new Request(window.location.pathname + this.props.content, options);
        // const response = await fetch(request);
        // const status = await response.status;
        // const result = await response.json();

        // if (status === 200) {
        //     window.location.reload();
        // }
        // else {
        //     console.log(result);
        // }
    }

    render() {

        let drawerClass = 'side-menu';
        const query = queryString.parse(this.props.content)


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
                            <input className="inputfield" ref="taskName" type="text" placeholder="Task name" />
                            <p id="loginp"> Description </p>
                            <textarea className="inputfield" ref="desciption" type="text" placeholder="Description" rows="8" cols="45"/>
                            <p id="loginp"> Story Points </p>
                            <select className="inputfield" ref="points" name="points">
                                <option value="16">16</option>
                                <option value="8">8</option>
                                <option value="4">4</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                            <p id="loginp"> User </p>
                            <input className="inputfield" ref="user" type="text" placeholder="" />
                            <p id="loginp"> Support User  </p>
                            <input className="inputfield" ref="supportuser" type="text" placeholder="" />
                            <br />
                            {/* <p id="errortext">{this.state.error}</p> */}
                            <input id="loginbutton" className="btn btn-primary" type="submit" value="Log In" />
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