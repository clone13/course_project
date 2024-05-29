import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import UserManagement from "./components/UserManagement";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginForm} />
        <Route path="/login" component={LoginForm} />
        <Route path="/registration" component={RegistrationForm} />
        <PrivateRoute path="/usermanagement" component={UserManagement} />{" "}
      </Switch>
    </Router>
  );
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default App;
