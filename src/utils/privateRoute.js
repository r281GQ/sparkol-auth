import React from "react";
import { Redirect, Route } from "react-router-dom";

import { useMe } from "../services/auth";

const PrivateRoute = (props) => {
  const user = useMe();

  if (user) {
    return <Route {...props} />;
  }

  return <Redirect to="/login" />;
};

export default PrivateRoute;
