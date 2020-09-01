import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./home";
import Login from "./login";

import PrivateRoute from "../utils/privateRoute";

/**
 * I believe "react-router-dom" is much smarter than me
 * and takes care of preventing unwanted re-renders inside "<BrowserRouter />".
 *
 * But since it is the direct child of Context Auth, React.memo can come handy.
 */
const Routes = React.memo(function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
      </Switch>
    </BrowserRouter>
  );
});

export default Routes;
