import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (!user && !loading) {
    return <Navigate to="/" />;
  }

  if (!loading) {
    return children || <Outlet />;
  }
}

export default PrivateRoute;
