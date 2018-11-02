import React from 'react';
import { NavLink } from "react-router-dom";
import { NavDropdown, MenuItem } from "react-bootstrap";
import '../../styles/header.css';

const Header = (props) => {
    var button;
    var headerOptions
    var userProjects = []
    var projects = []

    if (props.state.user === "No User" || !props.state.user) {
        button =
            <ul className="nav navbar-nav navbar-right">
                <li><a href="/user/signup"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
                <li><a href="/user/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul>
    }
    else {
        var userLink = "/user/" + props.state.user._id;

        button =
            <ul className="nav navbar-nav navbar-right">
                <li><a href={userLink}><span className="glyphicon glyphicon-user"></span> Welcome {props.state.user.name}</a></li>
                <li><a href="/user/login/"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
            </ul>


        props.state.projects.forEach(element => {
            userProjects.push(
                <MenuItem href={"/project/" + element._id + "?view=false&activetask=none"}  key={element._id}>{element.name}</MenuItem>
            );
        });

        props.state.userprojects.forEach(element => {
            projects.push(
                <MenuItem href={element.request.url}  key={element._id}>{element.name}</MenuItem>
            );
        });

        headerOptions =
            <NavDropdown title="Projects" id="basic-nav-dropdown">
                <MenuItem header>Your Projects</MenuItem>
                {userProjects}
                <MenuItem divider />
                <MenuItem header>Projects</MenuItem>
                {projects}
            </NavDropdown>
    }


    return (
        <nav className="navbar navbar-inverse">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="/home">Sky Betting & Gaming</a>
                </div>
                <ul className="nav navbar-nav">
                    <li><NavLink to={"/user/dashboard"} activeStyle={{ color: "red" }}>Your Dashboard</NavLink></li>
                    {headerOptions}
                </ul>
                {button}
            </div>
        </nav >
    );
}

export default Header;