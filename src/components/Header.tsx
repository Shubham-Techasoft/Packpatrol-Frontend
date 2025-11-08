import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logo-1.png";
import userAvatar from "../assets/avatar-3.png";
import CombinedSignInPage from "./LoginDailog";
import CombinedSignUpPage from "./SignupDailog";
import { isAuthenticated, logout, isSuperAdmin } from "../utils/auth";
// import some good icon for logout, login and profile
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import ProfileIcon from "@mui/icons-material/Person";
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { isPrivilegedUser } from "../utils/auth";

const settings = ["Profile", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const [auth, setAuth] = useState<boolean | null>(null); 
  const [designation, setDesignation] = useState(
    localStorage.getItem("designation") || ""
  );

  const navigate = useNavigate();

  // React.useEffect(() => {
  //   const syncAuth = () => setAuth(isAuthenticated());
  //   window.addEventListener("storage", syncAuth);
  //   return () => window.removeEventListener("storage", syncAuth);
  // }, []);
  // ✅ Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setAuth(result);
      setDesignation(localStorage.getItem("designation") || "");
    };
    checkAuth();
  }, []);

  // ✅ Sync across tabs
  useEffect(() => {
    const syncAuth = async () => {
      const res = await isAuthenticated();
      setAuth(res);
      setDesignation(localStorage.getItem("designation") || "");
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // ✅ Dynamic pages based on auth
  const pages = [
    { name: "Home", path: "/", icon: <HomeIcon sx={{ mr: 0.25, fontSize: "20px" }} /> },
    { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon sx={{ mr: 0.25, fontSize: "20px" }} /> },
    ...(auth && isPrivilegedUser() ? [{ name: "Dev Settings", path: "/dev-settings", icon: <SettingsIcon sx={{ mr: 0.25, fontSize: "20px" }} /> }] : []),
    ...(auth && isSuperAdmin() ? [{ name: "Users", path: "/users", icon: <GroupIcon sx={{ mr: 0.25, fontSize: "20px" }} /> }] : []),
    { name: "About", path: "/about", icon: <InfoIcon sx={{ mr: 0.25, fontSize: "20px" }} /> },
    { name: "Help", path: "/getting-started", icon: <MenuBookIcon sx={{ mr: 0.25, fontSize: "20px" }} /> },
  ];

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);

  const handleCloseNavMenu = (path?: string) => {
    setAnchorElNav(null);
    if (path) navigate(path);
  };

  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: "#062249",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo - Desktop - Use Box with img component to prevent fallback to Avatar text */}
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
              <img
                src={logo}
                alt="Techasoft Pvt Ltd Logo"
                style={{ height: 40, borderRadius: "50%", boxShadow: "0px 0px 15px -2px rgba(255, 255, 255, 0.5)" }}
              />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Poppins",
                fontWeight: 600,
                color: "white",
                textDecoration: "none",
              }}
            >
              Techasoft Pvt. Ltd.
            </Typography>

            {/* Mobile Menu Button */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={() => handleCloseNavMenu()}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.name}
                    onClick={() => handleCloseNavMenu(page.path)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', margin:"0 !important"}}>
                      {page.icon}
                      <Typography textAlign="center">{page.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Logo - Mobile */}
            <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
              <img
                src={logo}
                alt="Techasoft Pvt Ltd Logo"
                style={{ height: 40, borderRadius: "50%" }}
              />
            </Box>
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "Poppins",
                fontWeight: 600,
                color: "white",
                textDecoration: "none",
              }}
            >
              Techasoft
            </Typography>

            {/* Desktop Navigation Buttons */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleCloseNavMenu(page.path)}
                  sx={{
                    my: 1,
                    mx: 0.15,
                    color: "white",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "capitalize",
                    fontSize: "smaller",
                    transition: "all 0.3s ease",
                    ":hover": {
                      transform: 'translateY(-2px)',
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {page.icon}
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Auth Buttons */}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mr: 2 }}>
              
             {/* login */}
            { auth == false && (
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  borderRadius: 3,
                  padding:'5px 10px 5px 6px',
                  fontWeight: 500,
                  borderColor: "white",
                  transition: "all 0.3s ease-in-out",
                  ":hover": {
                    backgroundColor: "white",
                    color: "primary.main",
                  },
                }}
                onClick={() => setOpenLogin(true)}
              >
                <LoginIcon /> &nbsp;
                Login
              </Button>
              )}

              {/* sign up */}
              {auth && isSuperAdmin() && (
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    px: 1.5,
                    fontWeight: 500,
                    transition: "all 0.3s ease-in-out",
                    // suggest beast color based on header bg color
                    backgroundColor: "#148538ff",
                  }}
                  onClick={() => setOpenSignUp(true)}
                >
                  Create Account
                </Button>
              )}
            </Box>

            {/* User Avatar */}
            {auth && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Badge
                      color="success"
                      overlap="circular"
                      variant="dot"
                      sx={{
                        "& .MuiBadge-badge": {
                          border: "1px solid white",
                          scale: "1.5",
                          transform: "translate(25%, 25%)",
                          borderRadius: "50%",
                        },
                      }}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                      <Avatar alt="User Avatar" src={userAvatar} sx={{filter: "grayscale(1) invert(1) brightness(2)", scale: "1.2",}}/>
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px"}}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu();
                        if (setting === "Logout") {
                          logout(); // Call logout here
                        } else if (setting === "Profile") {
                          navigate("/profile");
                        } 
                      }}
                      sx={setting === "Logout" ? { color: "#990000", '&:hover': { bgcolor: '#ffdddd' } } : {}}
                    > 
                      {setting === "Logout" && <LogoutIcon />}
                      {setting === "Profile" && <ProfileIcon />} &nbsp;
                      <Typography textAlign="center" >{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Auth Dialogs */}
      <CombinedSignInPage
        open={openLogin}
        onClose={() => setOpenLogin(false)}
      />
      <CombinedSignUpPage
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
      />
    </>
  );
}

export default ResponsiveAppBar;
