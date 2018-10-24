import React from 'react';

import '../../styles/sideMenu.css';

const sideMenu = props => {
    let drawerClasses = 'side-menu';
    if (props.show) {
        drawerClasses = 'side-menu open';
    }

    return (
        <nav className={drawerClasses}>
            <ul>
                <li>
                    <a href="/">Products</a>
                </li>
                <li>
                    <a href="/">Users</a>
                </li>
            </ul>
        </nav>
    );
};

export default sideMenu;