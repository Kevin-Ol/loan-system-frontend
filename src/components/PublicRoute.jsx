import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth";

function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/loan/register" />;
  }

  return children || <Outlet />;
}

export default PublicRoute;
