import React from 'react';
import { NavLink } from "react-router-dom";

const Header = (props) => {
   	return (
		<nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <ul className="nav navbar-nav">
                        <li><NavLink  to={"/home"} activeStyle={{color: "red"}}>Home</NavLink ></li>
                        <li><NavLink nk to={"/user"} activeStyle={{color: "red"}}>User</NavLink></li>
                    </ul>
                </div>
            </div>
        </nav>
	);
}

export default Header;