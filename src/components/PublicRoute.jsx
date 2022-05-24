import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (user && !loading) {
    return <Navigate to="/loan/list" />;
  }

  if (!loading) {
    return children || <Outlet />;
  }
}

export default PublicRoute;
