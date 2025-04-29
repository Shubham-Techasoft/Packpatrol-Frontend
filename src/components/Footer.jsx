// import * as React from "react";
// import Box from "@mui/material/Box";
// import CssBaseline from "@mui/material/CssBaseline";
// import BottomNavigation from "@mui/material/BottomNavigation";
// import BottomNavigationAction from "@mui/material/BottomNavigationAction";
// import RestoreIcon from "@mui/icons-material/Restore";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import ArchiveIcon from "@mui/icons-material/Archive";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import RecentActivitiesDialog from "./RecentActivitiesDialog";

// export default function Footer() {
//   const [value, setValue] = React.useState(0);
//   const [open, setOpen] = React.useState(false);

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Box sx={{ pb: 7 }}>
//       <CssBaseline />
//       <Paper
//         sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
//         elevation={3}
//       >
//         <BottomNavigation
//           showLabels
//           value={value}
//           onChange={(event, newValue) => {
//             setValue(newValue);
//             if (newValue === 0) {
//               handleOpen();
//             }
//           }}
//         >
//           <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
//           <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
//           <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
//         </BottomNavigation>
//         <Typography
//           variant="body2"
//           align="center"
//           sx={{ py: 1, backgroundColor: "#f5f5f5" }}
//         >
//           &copy; {new Date().getFullYear()} Techasoft Pvt Ltd. All rights
//           reserved.
//         </Typography>
//       </Paper>

//       <RecentActivitiesDialog open={open} handleClose={handleClose} />
//     </Box>
//   );
// }

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
import FavoritesDialog from "./FavoritesDialog"; // NEW IMPORT

export default function Footer() {
  const [value, setValue] = React.useState(0);
  const [recentOpen, setRecentOpen] = React.useState(false);
  const [favoritesOpen, setFavoritesOpen] = React.useState(false);

  const handleRecentOpen = () => setRecentOpen(true);
  const handleRecentClose = () => setRecentOpen(false);

  const handleFavoritesOpen = () => setFavoritesOpen(true);
  const handleFavoritesClose = () => setFavoritesOpen(false);

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
            setValue(newValue);
            if (newValue === 0) {
              handleRecentOpen();
            } else if (newValue === 1) {
              handleFavoritesOpen();
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
          sx={{ py: 1, backgroundColor: "#B0E0E6" }}
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
      />{" "}
    </Box>
  );
}
