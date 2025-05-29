// import * as React from "react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import Menu from "@mui/material/Menu";
// import MenuIcon from "@mui/icons-material/Menu";
// import Container from "@mui/material/Container";
// import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
// import Tooltip from "@mui/material/Tooltip";
// import MenuItem from "@mui/material/MenuItem";

// import logo from "../assets/logo-1.png";
// import CombinedSignInPage from "./LoginDailog";
// import CombinedSignUpPage from "./SignupDailog";

// const pages = [
//   { name: "Home", path: "/" },
//   { name: "Dashboard", path: "/dashboard" },
//   { name: "About", path: "/about" },
//   { name: "Dev Settings", path: "/dev-settings" },
// ];
// const settings = ["Profile", "Images", "Logout"];

// function ResponsiveAppBar() {
//   const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
//   const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
//   const [openLogin, setOpenLogin] = useState(false);
//   const [openSignUp, setOpenSignUp] = useState(false);

//   const navigate = useNavigate();

//   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
//     setAnchorElNav(event.currentTarget);
//   const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
//     setAnchorElUser(event.currentTarget);

//   const handleCloseNavMenu = (path?: string) => {
//     setAnchorElNav(null);
//     if (path) navigate(path);
//   };

//   const handleCloseUserMenu = () => setAnchorElUser(null);

//   return (
//     <>
//       <AppBar position="static">
//         <Container maxWidth="xl">
//           <Toolbar disableGutters>
//             <Box
//               component="img"
//               src={logo}
//               alt="Techasoft Pvt Ltd Logo"
//               sx={{ display: { xs: "none", md: "flex" }, height: 40, mr: 1 }}
//             />
//             <Typography
//               variant="h6"
//               noWrap
//               component={Link}
//               to="/"
//               sx={{
//                 mr: 2,
//                 display: { xs: "none", md: "flex" },
//                 fontFamily: "monospace",
//                 fontWeight: 700,
//                 letterSpacing: ".1rem",
//                 color: "inherit",
//                 textDecoration: "none",
//               }}
//             >
//               Techasoft Pvt Ltd
//             </Typography>

//             <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
//               <IconButton
//                 size="large"
//                 aria-label="menu"
//                 onClick={handleOpenNavMenu}
//                 color="inherit"
//               >
//                 <MenuIcon />
//               </IconButton>
//               <Menu
//                 anchorEl={anchorElNav}
//                 open={Boolean(anchorElNav)}
//                 onClose={() => handleCloseNavMenu()}
//                 anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//                 transformOrigin={{ vertical: "top", horizontal: "left" }}
//                 sx={{ display: { xs: "block", md: "none" } }}
//               >
//                 {pages.map((page) => (
//                   <MenuItem
//                     key={page.name}
//                     onClick={() => handleCloseNavMenu(page.path)}
//                   >
//                     <Typography textAlign="center">{page.name}</Typography>
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </Box>

//             <Box
//               component="img"
//               src={logo}
//               alt="Techasoft Pvt Ltd Logo"
//               sx={{ display: { xs: "flex", md: "none" }, height: 40, mr: 1 }}
//             />
//             <Typography
//               variant="h5"
//               noWrap
//               component={Link}
//               to="/"
//               sx={{
//                 mr: 2,
//                 display: { xs: "flex", md: "none" },
//                 flexGrow: 1,
//                 fontFamily: "monospace",
//                 fontWeight: 700,
//                 letterSpacing: ".3rem",
//                 color: "inherit",
//                 textDecoration: "none",
//               }}
//             >
//               Techasoft
//             </Typography>

//             <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
//               {pages.map((page) => (
//                 <Button
//                   key={page.name}
//                   onClick={() => handleCloseNavMenu(page.path)}
//                   sx={{ my: 2, color: "white", display: "block", gap: 2 }}
//                 >
//                   {page.name}
//                 </Button>
//               ))}
//             </Box>

//             <Box sx={{ display: "flex", alignItems: "center", gap: 2, mr: 2 }}>
//               <Button
//                 variant="outlined"
//                 color="inherit"
//                 sx={{ borderRadius: 2 }}
//                 onClick={() => setOpenLogin(true)}
//               >
//                 Login
//               </Button>
//               <Button
//                 variant="contained"
//                 color="warning"
//                 sx={{ borderRadius: 2 }}
//                 onClick={() => setOpenSignUp(true)}
//               >
//                 Signup
//               </Button>
//             </Box>

//             <Box sx={{ flexGrow: 0 }}>
//               <Tooltip title="Open settings">
//                 <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                   <Avatar alt="User Avatar" src="src/assets/avatar-3.png" />
//                 </IconButton>
//               </Tooltip>
//               <Menu
//                 sx={{ mt: "45px" }}
//                 anchorEl={anchorElUser}
//                 open={Boolean(anchorElUser)}
//                 onClose={handleCloseUserMenu}
//                 anchorOrigin={{ vertical: "top", horizontal: "right" }}
//                 transformOrigin={{ vertical: "top", horizontal: "right" }}
//               >
//                 {settings.map((setting) => (
//                   <MenuItem key={setting} onClick={handleCloseUserMenu}>
//                     <Typography textAlign="center">{setting}</Typography>
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </Box>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       <CombinedSignInPage
//         open={openLogin}
//         onClose={() => setOpenLogin(false)}
//       />
//       <CombinedSignUpPage
//         open={openSignUp}
//         onClose={() => setOpenSignUp(false)}
//       />
//     </>
//   );
// }

// export default ResponsiveAppBar;

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

const pages = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About", path: "/about" },
  { name: "Dev Settings", path: "/dev-settings" },
];

const settings = ["Profile", "Images", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const navigate = useNavigate();

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
          backgroundColor: "rgba(25, 118, 210, 0.85)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo - Desktop */}
            <Box
              component="img"
              src={logo}
              alt="Techasoft Pvt Ltd Logo"
              sx={{ display: { xs: "none", md: "flex" }, height: 40, mr: 2 }}
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
              <Button
                variant="contained"
                color="warning"
                sx={{
                  borderRadius: 3,
                  px: 3,
                  fontWeight: 500,
                  boxShadow: "0px 4px 20px rgba(255, 152, 0, 0.5)",
                  transition: "all 0.3s ease-in-out",
                  ":hover": {
                    backgroundColor: "#ffb74d",
                  },
                }}
                onClick={() => setOpenSignUp(true)}
              >
                Signup
              </Button>
            </Box>

            {/* User Avatar */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Badge
                    color="success"
                    overlap="circular"
                    variant="dot"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  >
                    <Avatar alt="User Avatar" src="src/assets/avatar-3.png" />
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
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
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
