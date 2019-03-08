import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";

import HomeView from "../views/HomeView";
import ContactView from "../views/ContactView";

class Main extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <h1>Speed Test Medial</h1>
                    <ul className="header">
                        <li><NavLink to="/">Tester votre vitesse</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={HomeView} />
                        <Route path="/contact" component={ContactView} />
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default Main;