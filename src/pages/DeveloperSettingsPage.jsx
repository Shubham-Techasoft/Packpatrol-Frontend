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
import MemoryIcon from "@mui/icons-material/Memory";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import AddMachineForm from "./AddMachineForm";

import AddMachineStepper from "./AddMachineStepper";

const DeveloperSettings = () => {
  const [machines, setMachines] = useState([]);
  const [open, setOpen] = useState(false); // Controls dialog open state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedMachine, setSelectedMachine] = React.useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const [editData, setEditData] = useState(null);
  const [mode, setMode] = useState("add");

  // fetch machines
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/machines/");
        // Sort by created_at (oldest first)
        const sorted = res.data.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        setMachines(sorted);
      } catch (err) {
        console.error("Error fetching machines:", err);
      }
    };

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
    try {
      const mlRes = await fetch(
        `http://localhost:8000/api/mlmodels/${selectedMachine.ml_model}/`
      );
      const mlModelData = await mlRes.json();
  
      setEditData({
        machine: selectedMachine,
        mlModel: mlModelData,
      });
      setMode("edit");
      setOpen(true);
      handleMenuClose();
    } catch (err) {
      console.error("Failed to fetch ML model for edit", err);
    }
  };

  //delete machine
  const handleDelete = async () => {
    // swagger token for development phase only
    const token =
      "";

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
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f0f4f8" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "22%",
          background:
            "linear-gradient(to bottom, rgb(24, 10, 73), rgb(26, 82, 203))",
          color: "#fff",
          p: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={3}
          display="flex"
          alignItems="center"
        >
          <MemoryIcon sx={{ mr: 1 }} /> Developer Panel
        </Typography>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          fullWidth
          onClick={handleOpen}
          sx={{
            mb: 3,
            background: "linear-gradient(to bottom, #00b09b, #96c93d)",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            "&:hover": {
              background: "linear-gradient(to right, #ff4b2b, #ff416c)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Add Machine
        </Button>

        <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />
        <Typography
          variant="subtitle1"
          gutterBottom
          fontWeight={600}
          sx={{ fontSize: 20 }}
        >
          Machines
        </Typography>

        <List>
          {machines.map((machine) => (
            <ListItem key={machine.id} disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
                <MemoryIcon />
              </ListItemIcon>
              <ListItemText primary={machine.name} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Section */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" fontWeight={600} mb={4}>
          Available Machines
        </Typography>

        {machines.map((machine) => (
          <Paper
            key={machine.id}
            elevation={2}
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 3,
              backgroundImage:
                "linear-gradient(90.2deg, rgba(1,47,95,1) -0.4%, rgba(56,141,217,1) 106.1%)",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.01)" },
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {machine.name}
              </Typography>
              <Typography variant="body2">Status: Active</Typography>
            </Box>
            <Button
              variant="text"
              endIcon={<ArrowForwardIosIcon />}
              sx={{
                color: "#fff",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { textDecoration: "underline" },
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
          <MenuItem
            onClick={() => {
              setOpenConfirmDialog(true);
              setAnchorEl(null); 
            }}
          >
            Delete
          </MenuItem>
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
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DeveloperSettings;
