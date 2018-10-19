import React from 'react';
import { NavLink } from "react-router-dom";
import '../../styles/header.css';

const Header = (props) => {
    var button;
    var headerOptions

    if (props.user === "No User" || !props.user) {
        button =
            <ul className="nav navbar-nav navbar-right">
                <li><a href="/user/signup"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
                <li><a href="/user/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul>
    }
    else {
        var userLink = "/user/" + props.user._id;

        button =
            <ul className="nav navbar-nav navbar-right">
                <li><a href={userLink}><span className="glyphicon glyphicon-user"></span> Welcome {props.user.name}</a></li>
                <li><a href="/user/login/"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
            </ul>

        headerOptions =
            <>
                <li><NavLink to={"/projects"} activeStyle={{ color: "red" }}>Projects</NavLink></li>
                <li><NavLink to={"/boards"} activeStyle={{ color: "red" }}>Boards</NavLink></li>
                <li><NavLink to={"/tasks"} activeStyle={{ color: "red" }}>Tasks</NavLink></li> 
            </>
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
        </nav>
    );
}

export default Header;