// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, isSuperAdmin, isPrivilegedUser } from "../utils/auth";
import Loading from "./Loading";

const ProtectedRoute = ({ children, requireSuperAdmin = false, requirePrivileged = false }) => {
  const [authStatus, setAuthStatus] = useState({ isLoading: true, isAuth: false });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      setAuthStatus({ isLoading: false, isAuth });
    };
    checkAuth();
  }, []);

  if (authStatus.isLoading) {
    return <Loading />; // Or any other loading indicator
  }

  if (!authStatus.isAuth) return <Navigate to="/" replace />;

  if (requireSuperAdmin && !isSuperAdmin()) return <Navigate to="/" replace />;

  if (requirePrivileged && !isPrivilegedUser()) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
