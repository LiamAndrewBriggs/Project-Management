import React from 'react';
import { NavLink } from "react-router-dom";
import '../../styles/header.css';

const Header = (props) => {
    var button;

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
                <li><a href="/user/logout"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
            </ul>
    }

   	return (
        <nav className="navbar navbar-inverse">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="/home">Sky Betting & Gaming</a>
                </div>
                <ul className="nav navbar-nav">
                    <li><NavLink  to={"/home"} activeStyle={{color: "red"}}>Home</NavLink ></li>
                    <li><NavLink  to={"/user/partys"} activeStyle={{color: "red"}}>Your Partys</NavLink></li>
                    <li><NavLink  to={"/user/partyinvites"} activeStyle={{color: "red"}}>Invited To Partys</NavLink></li>
                    <li><NavLink  to={"/venues"} activeStyle={{color: "red"}}>Venues</NavLink></li>
                    <li><NavLink  to={"/caterings"} activeStyle={{color: "red"}}>Catering</NavLink></li>
                    <li><NavLink  to={"/entertainments"} activeStyle={{color: "red"}}>Entertainment</NavLink></li>
                    <li><NavLink  to={"/transports"} activeStyle={{color: "red"}}>Transport</NavLink></li>
                </ul>
                {button}
            </div>
        </nav>
	);
}

export default Header;