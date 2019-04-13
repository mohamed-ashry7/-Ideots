import React, { Component } from "react";

  
import logo from "./logo.svg";
// import Request from './components/Request'
import Request from './components/userRequest_components/Request'
import RequestAsUser from './components/userRequest_components/RequestAsUser'
// import RequestAsUser from './components/RequestAsUser'
import Tabs from "./components/tab_components/tabs";
import Home from "./components/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

import Notification from "./components/notification_components/Notifications";
import HeaderBar from "./components/navbar_components/HeaderAppBar";


class App extends Component {
  render() {
    return (

      <Router>
       <HeaderBar />
       <Route path="/" render={props => <Tabs />} />
        <div className="App">
          <Route  path="/" render={props => <Home />} />
         
          <Route
            path="/requests"
            render={props => <Request  />}
          />
           <Route
            path="/UserRequests"
            render={props => <RequestAsUser  />}
          />
         
        </div>
      </Router>

    );
  }
}

export default App;
