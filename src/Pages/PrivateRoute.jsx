import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const status = useSelector((state) => state.auth.status);

  if (status === "loading") return <div>Loading...</div>; // optional

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
