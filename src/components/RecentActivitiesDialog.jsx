import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Typography,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CheckCircle, Cancel, AccessTime } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "hiddenActivityLogs";

export default function RecentActivitiesDialog({ open, handleClose }) {
  const theme = useTheme();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (open) {
      axios
        .get("http://127.0.0.1:8000/api/machinerunlogs/")
        .then((res) => {
          const hiddenIds =
            JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

          const filtered = res.data
            .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
            .filter((log) => !hiddenIds.includes(log.id));

          setLogs(filtered);
        })
        .catch((err) => console.error("Failed to fetch machine logs", err));
    }
  }, [open]);

  const handleHideActivity = (id) => {
    setLogs((prev) => {
      const updated = prev.filter((log) => log.id !== id);
      const currentHidden =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      const updatedHidden = [...new Set([...currentHidden, id])];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHidden));
      return updated;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
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
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <DialogTitle>
        Recent Activities
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

      <DialogContent dividers>
        {logs.length === 0 ? (
          <Typography variant="body2">
            No recent activities available
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {logs.map((log) => (
              <Grid item xs={12} md={6} key={log.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderLeft: "6px solid #1976d2",
                    backgroundColor: "#fafafa",
                    position: "relative",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Typography fontWeight="bold">
                      {log.machine_name || "Unknown Machine"} –{" "}
                      {log.variant_name || "Unknown Variant"}
                    </Typography>

                    {/* <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleHideActivity(log.id)}
                        sx={{ color: "#888", padding: 0, mb: 0.5 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      <Chip
                        label={log.is_running ? "Running" : "Stopped"}
                        color={log.is_running ? "success" : "error"}
                        icon={log.is_running ? <CheckCircle /> : <Cancel />}
                        size="small"
                      />
                    </Box> */}

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleHideActivity(log.id)}
                        sx={{ color: "#888", padding: 0, mb: 0.5 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      <Box display="flex" gap={1}>
                        <Chip
                          label={log.is_running ? "Running" : "Stopped"}
                          color={log.is_running ? "success" : "error"}
                          icon={log.is_running ? <CheckCircle /> : <Cancel />}
                          size="small"
                        />
                        <Chip
                          label="Apply"
                          size="small"
                          clickable
                          onClick={() => {
                            console.log("Apply clicked for:", log);
                            // You can implement form autofill or restore logic here
                          }}
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            color: "#fff",
                            fontWeight: "bold",
                            px: 2.5,
                            py: 1,
                            "&:hover": {
                              bgcolor: theme.palette.primary.dark,
                            },
                            boxShadow: 2,
                            borderRadius: "6px",
                            transition: "0.3s",
                          }}
                          variant="filled"
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" mt={1}>
                    Biscuit: {log.biscuit_type || "N/A"}
                  </Typography>

                  <Grid container spacing={1} mt={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Min Stack Size: {log.min_stack_size}
                      </Typography>
                      <Typography variant="body2">
                        Max Stack Size: {log.max_stack_size}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Min Stack Length: {log.min_stack_length}
                      </Typography>
                      <Typography variant="body2">
                        Max Stack Length: {log.max_stack_length}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      <AccessTime fontSize="inherit" /> Start:{" "}
                      {new Date(log.start_time).toLocaleString()}
                    </Typography>
                    <br />
                    {/* <Typography variant="caption" color="text.secondary">
                      <AccessTime fontSize="inherit" /> Stop:{" "}
                      {new Date(log.stop_time).toLocaleString()}
                    </Typography> */}
                    {log.stop_time ? (
                      <Typography variant="caption" color="text.secondary">
                        <AccessTime fontSize="inherit" /> Stop:{" "}
                        {new Date(log.stop_time).toLocaleString()}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        <AccessTime fontSize="inherit" /> Stop: Not available
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}

// import React from "react";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import Divider from "@mui/material/Divider";
// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";

// export default function RecentActivitiesDialog({ open, handleClose }) {
//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       fullScreen={fullScreen}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           padding: theme.spacing(2),
//           position: "relative",
//           zIndex: 1301, // keep it above backdrop
//         },
//       }}
//       BackdropProps={{
//         sx: {
//           backdropFilter: "blur(6px)",
//           backgroundColor: "rgba(0, 0, 0, 0.2)", // optional: slight dark overlay
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{ fontWeight: 600, fontSize: theme.typography.h6.fontSize }}
//       >
//         Recent Activities
//       </DialogTitle>
//       <DialogContent>
//         <DialogContentText
//           sx={{
//             color: theme.palette.text.secondary,
//             marginBottom: theme.spacing(2),
//           }}
//         >
//           Latest updates from the manufacturing floor:
//         </DialogContentText>
//         <List>
//           <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
//             <ListItemText
//               primaryTypographyProps={{ fontWeight: 500 }}
//               primary="Batch #45 completed successfully"
//               secondaryTypographyProps={{ color: theme.palette.text.secondary }}
//               secondary="Today, 04:10 PM"
//             />
//           </ListItem>
//           <Divider />
//           <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
//             <ListItemText
//               primaryTypographyProps={{ fontWeight: 500 }}
//               primary="Line 2 restarted after maintenance"
//               secondaryTypographyProps={{ color: theme.palette.text.secondary }}
//               secondary="Today, 03:50 PM"
//             />
//           </ListItem>
//           <Divider />
//           <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
//             <ListItemText
//               primaryTypographyProps={{ fontWeight: 500 }}
//               primary="Temperature Alert Resolved on Line 3"
//               secondaryTypographyProps={{ color: theme.palette.text.secondary }}
//               secondary="Today, 03:20 PM"
//             />
//           </ListItem>
//           <Divider />
//           <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
//             <ListItemText
//               primaryTypographyProps={{ fontWeight: 500 }}
//               primary="New Batch started in Oven Line 1"
//               secondaryTypographyProps={{ color: theme.palette.text.secondary }}
//               secondary="Today, 02:45 PM"
//             />
//           </ListItem>
//         </List>
//       </DialogContent>
//     </Dialog>
//   );
// }
