import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from '@mui/icons-material/Settings';
import MemoryIcon from "@mui/icons-material/Memory";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import AddMachineForm from "./AddMachineForm";

import AddMachineStepper from "./AddMachineStepper";
import { isManager } from "../utils/auth";
import { isAuthenticated, isPrivilegedUser } from "../utils/auth";
import { Navigate } from "react-router-dom";

const DeveloperSettings = () => {
  const [machines, setMachines] = useState([]);
  const [open, setOpen] = useState(false); // Controls dialog open state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedMachine, setSelectedMachine] = React.useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const [editData, setEditData] = useState(null);
  const [mode, setMode] = useState("add");

  const managerView = isManager();

  if (!isAuthenticated() || !isPrivilegedUser()) {
    return <Navigate to="/" replace />;
  }

  // fetch machines
  const fetchMachines = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/machines/");
      // Sort by created_at (oldest first)
      const sorted = res.data.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      console.log("Fetched machines:", sorted);
      setMachines(sorted);
    } catch (err) {
      console.error("Error fetching machines:", err);
    }
  };

  // call fetch machine once on load
  useEffect(() => {
    fetchMachines();
  }, []);

  const handleOpen = () => {
    setEditData(null);
    setMode("add");
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSettingsClick = (event, machine) => {
    setAnchorEl(event.currentTarget);
    setSelectedMachine(machine);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMachine(null);
  };

  //edit machine
  const handleEdit = async () => {
    const token = localStorage.getItem("access_token");
    if (!selectedMachine) return;

    try {
      // 1. Fetch full machine with variants
      const machineRes = await fetch(
        `http://localhost:8000/api/machines/${selectedMachine.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const machineData = await machineRes.json();

      // 2.  Fix camera null (fetch if it's ID string or missing)
      // if (!machineData.camera || typeof machineData.camera === "string") {
      //   const cameraId =
      //     machineData.camera ||
      //     (await fetchCameraIdByMachineName(machineData.name));

      //   const camRes = await fetch(
      //     `http://localhost:8000/api/cameras/${cameraId}/`,
      //     {
      //       headers: { Authorization: `Bearer ${token}` },
      //     }
      //   );
      //   const camData = await camRes.json();
      //   machineData.camera = camData; // ✅ Fix camera details
      // }

      if (!machineData.camera || typeof machineData.camera === "string") {
        const fallbackCameraId =
          machineData.camera ||
          (await fetchCameraIdByMachineName(machineData.name));

        if (!fallbackCameraId) {
          console.warn(
            "⚠️ Could not resolve camera ID for machine:",
            machineData.name
          );
        } else {
          const camRes = await fetch(
            `http://localhost:8000/api/cameras/${fallbackCameraId}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const camData = await camRes.json();
          machineData.camera = camData;
        }
      }

      // 3. Fetch ML model separately
      const mlModelId = machineData?.variants?.[0]?.active_ml_model?.id;

      if (!mlModelId) {
        console.warn("⚠️ No ML model linked to this machine.");
      }

      let mlModelData = null;
      if (mlModelId) {
        const mlModelRes = await fetch(
          `http://localhost:8000/api/mlmodels/${mlModelId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        mlModelData = await mlModelRes.json();
      }

      // 4. Pass all combined data to AddMachineStepper
      setEditData({
        machine: machineData,
        mlModel: mlModelData,
      });

      setMode("edit");
      setOpen(true);
      handleMenuClose();
    } catch (err) {
      console.error(
        "❌ Failed to fetch machine/Camera/ML model data for edit:",
        err
      );
    }
  };

  // Optional helper if camera ID is not embedded
  const fetchCameraIdByMachineName = async (machineName) => {
    const token = localStorage.getItem("access_token");
    const res = await fetch("http://localhost:8000/api/cameras/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const allCams = await res.json();
    const matched = allCams.find((cam) => cam.name === `${machineName}-cam`);
    return matched?.id;
  };

  //delete machine
  const handleDelete = async () => {
    const token = localStorage.getItem("access_token");

    if (!selectedMachine) return;

    try {
      console.log("Deleting Machine with ID:", selectedMachine.id);
      const response = await fetch(
        `http://localhost:8000/api/machines/${selectedMachine.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setMachines((prev) => prev.filter((m) => m.id !== selectedMachine.id));
        setOpenConfirmDialog(false);
      } else {
        console.error("Failed to delete machine");
      }
    } catch (error) {
      console.error("Error deleting machine:", error);
    } finally {
      handleMenuClose();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, minHeight: "100vh", bgcolor: "#f0f4f8" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", sm: "22%" },
          background: "linear-gradient(180deg, #002049ff 0%, #182848 100%)", // Dark blue professional gradient
          color: "common.white",
          p: { xs: 2 , sm: 1.5, md: 3 },
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={3}
          display="flex" // Ensures icon and text are aligned
          sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}
          alignItems="center"
        >
          <MemoryIcon sx={{ mr: 1 }} /> Developer Panel
        </Typography>

        {/* Add Machine Button */}
        {!managerView && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            fullWidth
            onClick={handleOpen}
            sx={{
              mb: 3,
              bgcolor: "rgba(255, 255, 255, 0.1)",
              color: "common.white",
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: "0.8rem",md: '0.9rem' } ,
              borderRadius: 2,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.5)",
                transform: "translateY(-1px)",
              },
              padding: { xs: '6px 12px', sm: '5px 16px', md: '10px 20px' }
            }}
          >
            Add Machine
          </Button>
        )}

        <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.15)" }} />
        <Typography
          variant="subtitle1"
          gutterBottom
          fontWeight={600}
          sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          Machines
        </Typography>

        <List>
          {machines.map((machine) => (
            <ListItem key={machine.id} disablePadding sx={{ mb: 1.5 }}>
              <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
                <MemoryIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ sx: { fontSize: { xs: '0.875rem', md: '1rem' } } }}
                primary={machine.name} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Section */}
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Typography variant="h4" fontWeight={600} mb={4} sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Available Machines
        </Typography>

        {machines.map((machine) => (
          <Paper
            key={machine.id}
            elevation={2}
            sx={{
              mb: 3,
              p: { xs: 2, md: 3 },
              borderRadius: "12px",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "&:hover": { transform: "scale(1.01)" },
            }}
          >
            <Box>
              <Typography variant="h6" color="#022149" fontWeight={600} sx={{fontSize: { xs: '1rem', md: '1.5rem' }}}>
                {machine.name}
              </Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status:{' '}
                  {machine.is_active ? (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
                  ) : (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>Inactive</span>
                  )}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="text"
              endIcon={<ArrowForwardIosIcon />}
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={(e) => handleSettingsClick(e, machine)}
            >
              Machine Settings
            </Button>
          </Paper>
        ))}

        {/* popup for edit and delete */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {/* Edit machine */}
          <MenuItem onClick={handleEdit}>Edit</MenuItem>

          {/* Delete Machine */}
          {!managerView && (
            <MenuItem
              onClick={() => {
                setOpenConfirmDialog(true);
                setAnchorEl(null);
              }}
            >
              Delete
            </MenuItem>
          )}
        </Menu>

        {/* Dialog box */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          aria-labelledby="confirm-delete-dialog"
        >
          <DialogTitle id="confirm-delete-dialog">Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete{" "}
              <strong>{selectedMachine?.name}</strong>?
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Machine Creation Dialog */}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        {/* <DialogTitle>Create New Machine</DialogTitle> */}
        <DialogContent>
          {/* <AddMachineForm
            // onSubmit={handleCreateMachine}
            onClose={handleClose}
          /> */}

          <Typography variant="h4" gutterBottom>
            Developer Settings
          </Typography>

          <AddMachineStepper
            mode={mode}
            editData={editData}
            onClose={handleClose}
            onMachineCreated={fetchMachines}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DeveloperSettings;
