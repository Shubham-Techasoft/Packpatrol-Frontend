// // src/components/RecentActivitiesDialog.jsx
// import React from "react";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import Divider from "@mui/material/Divider";

// export default function RecentActivitiesDialog({ open, handleClose }) {
//   return (
//     <Dialog open={open} onClose={handleClose}>
//       <DialogTitle>Recent Activities</DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           Latest updates from the manufacturing floor:
//         </DialogContentText>
//         <List>
//           <ListItem>
//             <ListItemText
//               primary="Batch #45 completed successfully"
//               secondary="Today, 04:10 PM"
//             />
//           </ListItem>
//           <Divider />
//           <ListItem>
//             <ListItemText
//               primary="Line 2 restarted after maintenance"
//               secondary="Today, 03:50 PM"
//             />
//           </ListItem>
//           <Divider />
//           <ListItem>
//             <ListItemText
//               primary="Temperature Alert Resolved on Line 3"
//               secondary="Today, 03:20 PM"
//             />
//           </ListItem>
//           <Divider />
//           <ListItem>
//             <ListItemText
//               primary="New Batch started in Oven Line 1"
//               secondary="Today, 02:45 PM"
//             />
//           </ListItem>
//         </List>
//       </DialogContent>
//     </Dialog>
//   );
// }

// src/components/RecentActivitiesDialog.jsx
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function RecentActivitiesDialog({ open, handleClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          padding: theme.spacing(2),
          position: "relative",
          zIndex: 1301, // keep it above backdrop
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)", // optional: slight dark overlay
        },
      }}
    >
      <DialogTitle
        sx={{ fontWeight: 600, fontSize: theme.typography.h6.fontSize }}
      >
        Recent Activities
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            color: theme.palette.text.secondary,
            marginBottom: theme.spacing(2),
          }}
        >
          Latest updates from the manufacturing floor:
        </DialogContentText>
        <List>
          <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
            <ListItemText
              primaryTypographyProps={{ fontWeight: 500 }}
              primary="Batch #45 completed successfully"
              secondaryTypographyProps={{ color: theme.palette.text.secondary }}
              secondary="Today, 04:10 PM"
            />
          </ListItem>
          <Divider />
          <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
            <ListItemText
              primaryTypographyProps={{ fontWeight: 500 }}
              primary="Line 2 restarted after maintenance"
              secondaryTypographyProps={{ color: theme.palette.text.secondary }}
              secondary="Today, 03:50 PM"
            />
          </ListItem>
          <Divider />
          <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
            <ListItemText
              primaryTypographyProps={{ fontWeight: 500 }}
              primary="Temperature Alert Resolved on Line 3"
              secondaryTypographyProps={{ color: theme.palette.text.secondary }}
              secondary="Today, 03:20 PM"
            />
          </ListItem>
          <Divider />
          <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
            <ListItemText
              primaryTypographyProps={{ fontWeight: 500 }}
              primary="New Batch started in Oven Line 1"
              secondaryTypographyProps={{ color: theme.palette.text.secondary }}
              secondary="Today, 02:45 PM"
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
}
