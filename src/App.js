import { useState, useEffect } from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserContext from "UserContext";
import Login from "components/login/Login";
import Forgot from "components/login/ForgotPassword";
import Dashboard from "components/Dashboard/Dashboard";
import Landing from "components/common/Landing";

export default function App() {
  const pastLogin = JSON.parse(localStorage.getItem("loggedIn"));
  const pastIsAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const pastAccessToken = sessionStorage.getItem("access_token");
  const [isLoggedIn, setIsLoggedIn] = useState(pastLogin || false);
  const [isAdmin, setIsAdmin] = useState(pastIsAdmin || false);
  const [access_token, setAccessToken] = useState(pastAccessToken || null);

  useEffect(() => {
    localStorage.setItem("loggedIn", Boolean(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("isAdmin", Boolean(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    sessionStorage.setItem("access_token", access_token);
  }, [access_token]);

  const toggleLogin = (bool, token, admin) => {
    setIsLoggedIn(bool);
    setAccessToken(token);
    setIsAdmin(admin);
  };

  const userSettings = {
    isLoggedIn: isLoggedIn,
    access_token: access_token,
    isAdmin: isAdmin,
    toggleLogin,
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          <UserContext.Provider value={userSettings}>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact={true} path="*" component={Landing} />
          </UserContext.Provider>
        </Switch>
      </Router>
    </div>
  );
}
