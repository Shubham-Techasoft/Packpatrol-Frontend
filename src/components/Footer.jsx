import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import RecentActivitiesDialog from "./RecentActivitiesDialog";
import FavoritesDialog from "./FavoritesDialog";
import GalleryDialog from "../pages/GalleryPage";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const [value, setValue] = React.useState(0);
  // const [galleryImages, setGalleryImages] = React.useState([]);

  const [recentOpen, setRecentOpen] = React.useState(false);
  const [favoritesOpen, setFavoritesOpen] = React.useState(false);
  // const [galleryOpen, setGalleryOpen] = React.useState(false);

  const handleRecentOpen = () => setRecentOpen(true);
  const handleRecentClose = () => setRecentOpen(false);

  const handleFavoritesOpen = () => setFavoritesOpen(true);
  const handleFavoritesClose = () => setFavoritesOpen(false);

  // const handleGalleryOpen = async () => {
  //   // i will replace this fake api call when api will ready for now this is it.
  //   // const response = await fetch("/random/gallery-req");
  //   // console.log("this is the response in footer: ", response);
  //   // const data = await response.json(); //an array of image URLs
  //   // setGalleryImages(data.images || []);
  //   setGalleryOpen(true);
  // };
  // const handleGalleryClose = () => setGalleryOpen(false);

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          style={{ backgroundColor: "#f5f5f5" }}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            console.log("this is newValue in footer: ", newValue);
            setValue(newValue);
            if (newValue === 0) {
              handleRecentOpen();
            } else if (newValue === 1) {
              handleFavoritesOpen();
            } else if (newValue === 2) {
              navigate("/gallery");
            }
          }}
        >
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
        </BottomNavigation>

        <Typography
          variant="body2"
          align="center"
          // sx={{ py: 1, backgroundColor: "#f5f5f5" }}
          sx={{ py: 1, bgcolor: "rgb(209, 233, 237)" }}
        >
          &copy; {new Date().getFullYear()} Techasoft Pvt Ltd. All rights
          reserved.
        </Typography>
      </Paper>
      <RecentActivitiesDialog
        open={recentOpen}
        handleClose={handleRecentClose}
      />
      <FavoritesDialog
        open={favoritesOpen}
        handleClose={handleFavoritesClose}
      />
      {/* <GalleryDialog
        open={galleryOpen}
        handleClose={handleGalleryClose}
        images={galleryImages}
      /> */}
    </Box>
  );
}

// import * as React from "react";
// import {
//   Box,
//   CssBaseline,
//   BottomNavigation,
//   BottomNavigationAction,
//   Paper,
//   Typography,
// } from "@mui/material";
// import RestoreIcon from "@mui/icons-material/Restore";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import ArchiveIcon from "@mui/icons-material/Archive";
// import RecentActivitiesDialog from "./RecentActivitiesDialog";
// import FavoritesDialog from "./FavoritesDialog";
// import { useNavigate } from "react-router-dom";

// export default function Footer() {
//   const navigate = useNavigate();

//   const [value, setValue] = React.useState(0);
//   const [recentOpen, setRecentOpen] = React.useState(false);
//   const [favoritesOpen, setFavoritesOpen] = React.useState(false);

//   const handleRecentOpen = () => setRecentOpen(true);
//   const handleRecentClose = () => setRecentOpen(false);

//   const handleFavoritesOpen = () => setFavoritesOpen(true);
//   const handleFavoritesClose = () => setFavoritesOpen(false);

//   return (
//     <Box sx={{ pb: 9 }}>
//       <CssBaseline />
//       <Paper
//         sx={{
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           zIndex: 1300,
//           borderTop: "1px solid rgba(255,255,255,0.2)",
//           background: "rgba(25, 25, 25, 0.7)",
//           backdropFilter: "blur(12px)",
//           boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
//           borderRadius: "12px 12px 0 0",
//         }}
//         elevation={6}
//       >
//         <BottomNavigation
//           value={value}
//           onChange={(event, newValue) => {
//             setValue(newValue);
//             if (newValue === 0) handleRecentOpen();
//             else if (newValue === 1) handleFavoritesOpen();
//             else if (newValue === 2) navigate("/gallery");
//           }}
//           showLabels
//           sx={{
//             background: "transparent",
//             color: "white",
//             ".Mui-selected": {
//               color: "#00e5ff",
//             },
//             ".MuiBottomNavigationAction-label": {
//               fontSize: "0.85rem",
//               fontWeight: 500,
//             },
//           }}
//         >
//           <BottomNavigationAction
//             label="Recents"
//             icon={<RestoreIcon />}
//             sx={{
//               transition: "all 0.3s ease-in-out",
//               ":hover": {
//                 transform: "scale(1.1)",
//               },
//             }}
//           />
//           <BottomNavigationAction
//             label="Favorites"
//             icon={<FavoriteIcon />}
//             sx={{
//               transition: "all 0.3s ease-in-out",
//               ":hover": {
//                 transform: "scale(1.1)",
//               },
//             }}
//           />
//           <BottomNavigationAction
//             label="Archive"
//             icon={<ArchiveIcon />}
//             sx={{
//               transition: "all 0.3s ease-in-out",
//               ":hover": {
//                 transform: "scale(1.1)",
//               },
//             }}
//           />
//         </BottomNavigation>

//         <Typography
//           variant="body2"
//           align="center"
//           sx={{
//             py: 1,
//             px: 2,
//             fontWeight: 400,
//             fontSize: "0.8rem",
//             color: "rgba(255,255,255,0.7)",
//             background: "transparent",
//             borderTop: "1px solid rgba(255,255,255,0.1)",
//           }}
//         >
//           &copy; {new Date().getFullYear()} Techasoft Pvt Ltd. All rights
//           reserved.
//         </Typography>
//       </Paper>

//       {/* Dialogs */}
//       <RecentActivitiesDialog
//         open={recentOpen}
//         handleClose={handleRecentClose}
//       />
//       <FavoritesDialog
//         open={favoritesOpen}
//         handleClose={handleFavoritesClose}
//       />
//     </Box>
//   );
// }
