import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

export default function FavoritesDialog({ open, handleClose }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md" // same size as RecentActivitiesDialog
      PaperProps={{
        sx: {
          padding: theme.spacing(2),
          position: "relative",
          zIndex: 1301,
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)", // optional overlay
        },
      }}
    >
      <DialogTitle>
        Favorite Settings
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{/* Add your content here */}</DialogContent>
    </Dialog>
  );
}

// components/Favorites.jsx
// import React from "react";
// import { Box, Paper, Typography } from "@mui/material";

// export default function Favorites({ favorites }) {
//   return (
//     <Box sx={{ mt: 2 }}>
//       <Typography variant="h6">Favorites</Typography>
//       {favorites.length === 0 ? (
//         <Typography variant="body2">No favorites yet.</Typography>
//       ) : (
//         favorites.map((fav, index) => (
//           <Paper
//             key={index}
//             sx={{
//               padding: 2,
//               marginY: 1,
//               backgroundColor: "#f9f9f9",
//               border: "1px solid #ccc",
//             }}
//           >
//             <Typography>Machine: {fav.machine}</Typography>
//             <Typography>Min Stack Size: {fav.minStackSize}</Typography>
//             <Typography>Max Stack Size: {fav.maxStackSize}</Typography>
//             <Typography>Min Stack Length: {fav.minStackLength}</Typography>
//             <Typography>Max Stack Length: {fav.maxStackLength}</Typography>
//           </Paper>
//         ))
//       )}
//     </Box>
//   );
// }
