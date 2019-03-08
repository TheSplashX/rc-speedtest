import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";

import HomeView from "../views/HomeView";
import StuffView from "../views/StuffView";
import ContactView from "../views/ContactView";

class Main extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <h1>Simple SPA</h1>
                    <ul className="header">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/stuff">Stuff</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={HomeView} />
                        <Route path="/stuff" component={StuffView} />
                        <Route path="/contact" component={ContactView} />
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default Main;