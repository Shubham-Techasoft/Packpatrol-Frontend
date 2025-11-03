import * as React from "react";
import { useState } from "react";
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
import CombinedSignInPage from "./LoginDailog";
import CombinedSignUpPage from "./SignupDailog";
import { isAuthenticated, logout, isSuperAdmin } from "../utils/auth";
import { isPrivilegedUser } from "../utils/auth";

const settings = ["Profile", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const [auth, setAuth] = useState(isAuthenticated());
  const [designation, setDesignation] = useState(
    localStorage.getItem("designation") || ""
  );

  const navigate = useNavigate();

  // React.useEffect(() => {
  //   const syncAuth = () => setAuth(isAuthenticated());
  //   window.addEventListener("storage", syncAuth);
  //   return () => window.removeEventListener("storage", syncAuth);
  // }, []);

  React.useEffect(() => {
    const syncAuth = () => {
      setAuth(isAuthenticated());
      setDesignation(localStorage.getItem("designation") || "");
    };

    syncAuth();

    // Also call immediately after login
    window.addEventListener("storage", syncAuth);

    return () =>
      window.removeEventListener("storage", syncAuth);
  }, []);

const pages = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  ...(auth && isPrivilegedUser()
    ? [{ name: "Dev Settings", path: "/dev-settings" }]
    : []),
  ...(auth && isSuperAdmin()
    ? [{ name: "Users", path: "/users" }]
    : []),
  // 👇 Always keep "About" at the end
  { name: "About", path: "/about" },
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
            {/* Logo - Desktop */}
            <Box
              component="img"
              src={logo}
              alt="Techasoft Pvt Ltd Logo"
              sx={{ display: { xs: "none", md: "flex" }, height: 40, mr: 2, boxShadow: "0px 0px 15px -2px rgba(255, 255, 255, 0.5)", borderRadius: "50%" }}
            />
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
              Techasoft Pvt Ltd
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
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Logo - Mobile */}
            <Box
              component="img"
              src={logo}
              alt="Techasoft Pvt Ltd Logo"
              sx={{ display: { xs: "flex", md: "none" }, height: 40, mr: 1 }}
            />
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
                    mx: 1,
                    color: "white",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "capitalize",
                    fontSize: "15px",
                    transition: "all 0.3s ease",
                    ":hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Auth Buttons */}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mr: 2 }}>
              
             {/* login */}
            {!auth && (
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  borderRadius: 3,
                  px: 3,
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
                Login
              </Button>
              )}

              {/* sign up */}
              {isAuthenticated() && isSuperAdmin() && (
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    px: 3,
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
            {isAuthenticated() && (
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
                      <Avatar alt="User Avatar" src="src/assets/avatar-3.png" sx={{filter: "grayscale(1) invert(1) brightness(2)", scale: "1.2",}}/>
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
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
                    >
                      <Typography textAlign="center">{setting}</Typography>
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
