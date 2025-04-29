import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";

export default function FavoritesDialog({ open, handleClose }) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Favorite Variants
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
      <DialogContent dividers></DialogContent>
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
