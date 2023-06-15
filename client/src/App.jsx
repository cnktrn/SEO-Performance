import React from "react";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import SignUp from "./components/Authentication/SignUp.jsx";
import Login from "./components/Authentication/Login.jsx";
import './App.css';
import logo from './resources/MMLogo.png';
import Workspace from "./components/Dashboards/Workspace.jsx";
import Dashboard from "./components/Dashboards/Dashboard.jsx";
import CreateDashboard  from "./components/Dashboards/CreateDashboard.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <header className="header-bar">
                <img src={logo} alt="Logo" className="logo" />
            </header>
            <div className="login-screen">
                <h1>LMUxMM SEO Dashboard</h1>
                <div className="button-container">
                    <Link to="/login" className="login-button">Login</Link>
                    <Link to="/signup" className="signup-button">Sign Up</Link>
                    <Link to="/dashboards" className="signup-button">Workspace</Link>
                </div>
                <Switch>
                    <Route path="/login" exact component={Login} />
                    <Route path="/signup" exact component={SignUp} />
                    <Route path="/dashboards" exact component={Workspace} />
                    <Route path="/dashboards/:id" exact component={Dashboard} />
                    <Route path="/CreateDashboard" exact component={CreateDashboard} />
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default App;
