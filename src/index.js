import {render} from "react-dom";
import React from "react";
import {Provider} from "react-redux";

import App from "./containers/App";
import Store from "./store";


render(
    <Provider store={Store}>
        <App />
    </Provider>,
    window.document.getElementById('app'));