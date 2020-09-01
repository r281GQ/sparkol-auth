import React from "react";
import { Redirect, Route } from "react-router-dom";

import { useMe } from "../services/auth";

/**
 * This is a reusable component to prevent access to routes
 * which should be protected unless authorized.
 *
 * It just composes two react-router-dom elements based if we have an auth user.
 */
const PrivateRoute = (props) => {
  const user = useMe();

  if (user) {
    return <Route {...props} />;
  }

  return <Redirect to="/login" />;
};

export default PrivateRoute;
