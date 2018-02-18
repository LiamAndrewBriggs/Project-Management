import React from 'react';
import { NavLink } from "react-router-dom";
import '../styles/header.css';

const Header = (props) => {
   	return (
        <nav className="navbar navbar-inverse">
            <div className="container-fluid">
                <div className="navbar-header">
                <a className="navbar-brand" href="/home">Party Management</a>
                    <ul className="nav navbar-nav">
                        <li><NavLink  to={"/home"} activeStyle={{color: "red"}}>Home</NavLink ></li>
                        <li><NavLink  to={"/party"} activeStyle={{color: "red"}}>Partys</NavLink></li>
                        <li><NavLink  to={"/venues"} activeStyle={{color: "red"}}>Venues</NavLink></li>
                    </ul>
                </div>
            </div>
        </nav>
	);
}

export default Header;