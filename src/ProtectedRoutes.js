import React from "react";
import { Navigate, Route } from "react-router-dom";

export default function ProtectedRoutes({
  component: Component,
  ...restOfProps
}) {
  const isAuthenticated = JSON.parse(localStorage.getItem("loggedIn"));

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Navigate to="/" />
      }
    />
  );
}
