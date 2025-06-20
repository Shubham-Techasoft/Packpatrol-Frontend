
export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

// super admin
export const isSuperAdmin = () => {
  const email = localStorage.getItem("email");
  return email === "TechasoftAdmin@techasoft.com";
};

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
