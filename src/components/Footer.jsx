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

export default function Footer({ onRecentOpen, onApplyLog }) {
  const navigate = useNavigate();

  const [value, setValue] = React.useState(0);
  // const [galleryImages, setGalleryImages] = React.useState([]);

  const [recentOpen, setRecentOpen] = React.useState(false);
  // const [favoritesOpen, setFavoritesOpen] = React.useState(false);
  // const [galleryOpen, setGalleryOpen] = React.useState(false);

  const handleRecentOpen = () => setRecentOpen(true);
  const handleRecentClose = () => setRecentOpen(false);

  // const handleFavoritesOpen = () => setFavoritesOpen(true);
  // const handleFavoritesClose = () => setFavoritesOpen(false);

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
    <Box sx={{ pb: {xs: 5, sm: 4, md: 2} , backgroundColor: "#f5f5f5"}}>
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
              // handleRecentOpen();
              onRecentOpen?.();
              // trigger dialog in App.jsx → Home.jsx
            } else if (newValue === 1) {
              navigate("/gallery");
            }
          }}
        >
          <BottomNavigationAction label="Recents" icon={<RestoreIcon sx={{width:"20px", height:"20px"}}/>} />
          {/* <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} /> */}
          <BottomNavigationAction label="Archive" icon={<ArchiveIcon sx={{width:"20px", height:"20px"}} />} />
        </BottomNavigation>

        <Typography
          variant="body2"
          align="center"
          // sx={{ py: 1, backgroundColor: "#f5f5f5" }}
          sx={{ bgcolor: "rgb(209, 233, 237)", fontSize: { xs: '0.5rem', sm: '0.7rem', md: '0.8rem' }, padding: { xs: '2px 0', sm: '4px 0', md: '5px 0' } }}
        >
          &copy; {new Date().getFullYear()} Techasoft Pvt Ltd. All rights
          reserved.
        </Typography>
      </Paper>
      {/* <RecentActivitiesDialog
        open={recentOpen}
        handleClose={handleRecentClose}
        onApplyLog={onApplyLog}
      /> */}
      {/* <FavoritesDialog
        open={favoritesOpen}
        handleClose={handleFavoritesClose}
      /> */}
      {/* <GalleryDialog
        open={galleryOpen}
        handleClose={handleGalleryClose}
        images={galleryImages}
      /> */}
    </Box>
  );
}
