import { jwtDecode } from "jwt-decode";

// Check if user is authenticated based on token presence
export const isAuthenticated = async () => {
  const token = localStorage.getItem("access_token");
  return !!token && !isTokenExpired(token);
};

// Get token expiry in milliseconds
export const getTokenExpiry = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; //JWT exp is in seconds
  } catch {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  const expiry = getTokenExpiry(token);
  return expiry ? Date.now() >= expiry : true;
};

// Check if logged-in user is Super Admin
export const isSuperAdmin = () => {
  const email = localStorage.getItem("email");
  return email === "TechasoftAdmin@techasoft.com";
};

// Check if user is Manager
export const isManager = () => {
  const designation = localStorage.getItem("designation");
  return designation === "manager";
};

// user
export const isPrivilegedUser = () => {
  const designation = localStorage.getItem("designation");
  return ["admin", "manager"].includes(designation) || isSuperAdmin();
};

// logout implementation
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("designation");
  localStorage.removeItem("username");

// Trigger logout in all open tabs
localStorage.setItem("logout", Date.now());

// Redirect to homepage (or login)
window.location.href = "/";

};
