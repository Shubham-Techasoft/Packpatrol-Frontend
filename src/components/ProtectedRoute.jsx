// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, isSuperAdmin, isPrivilegedUser } from "../utils/auth";

const ProtectedRoute = ({ children, requireSuperAdmin = false, requirePrivileged = false }) => {
  if (!isAuthenticated()) return <Navigate to="/" replace />;

  if (requireSuperAdmin && !isSuperAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (requirePrivileged && !isPrivilegedUser()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
