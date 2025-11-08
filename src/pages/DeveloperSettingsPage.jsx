import React, { useState, useEffect } from "react";
import axios from "axios";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
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
import PsychologyIcon from "@mui/icons-material/Psychology";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CategoryIcon from '@mui/icons-material/Category';
import DeleteIcon from "@mui/icons-material/Delete";
import { base_URL } from '../utils/api';
import AddMachineStepper from "./AddMachineStepper";
import { isManager } from "../utils/auth";
import { isAuthenticated, isPrivilegedUser } from "../utils/auth";
import { Navigate } from "react-router-dom";

const DeveloperSettings = () => {
  const [machines, setMachines] = useState([]);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedMachine, setSelectedMachine] = React.useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [variantDialogOpen, setVariantDialogOpen] = React.useState(false);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantDeleteDialog, setVariantDeleteDialog] = useState(false);
  
  // Add these states
  const [mlModels, setMlModels] = useState([]);
  const [selectedMLModel, setSelectedMLModel] = useState(null);
  const [mlModelDeleteDialog, setMlModelDeleteDialog] = useState(false);
  
  // ✅ SEPARATE STATE: Variant data
  const [newVariant, setNewVariant] = React.useState({
    name: "",
    biscuit_type: "",
    description: "",
    model_threshold: 0.5,
    model_verbose: true,
    variant_config_file: null,
  });

  // ✅ SEPARATE STATE: ML Model data
  const [newMLModel, setNewMLModel] = React.useState({
    name: "",
    version: "",
    model_file: null,
    description: "",
    recommended_threshold: 0.5,
  });

  const [editData, setEditData] = useState(null);
  const [mode, setMode] = useState("add");

  const managerView = isManager();

  if (!isAuthenticated() || !isPrivilegedUser()) {
    return <Navigate to="/" replace />;
  }

  // fetch machines
  const fetchMachines = async () => {
    try {
      const res = await axios.get(`${base_URL}/api/machines/`);
      const sorted = res.data.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      console.log("Fetched machines:", sorted);
      setMachines(sorted);
    } catch (err) {
      console.error("Error fetching machines:", err);
    }
  };

  // Add this function to fetch variants
  const fetchVariants = async () => {
    try {
      const res = await axios.get(`${base_URL}/api/machinevariants/`);
      setVariants(res.data);
    } catch (err) {
      console.error("Error fetching variants:", err);
    }
  };

  // Fetch ML models
  const fetchMLModels = async () => {
    try {
      const res = await axios.get(`${base_URL}/api/mlmodels/`);
      setMlModels(res.data);
    } catch (err) {
      console.error("Error fetching ML models:", err);
    }
  };

  useEffect(() => {
    fetchMachines();
    fetchVariants(); // Fetch variants too
    fetchMLModels();
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
        `${base_URL}/api/machines/${selectedMachine.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const machineData = await machineRes.json();
      console.log("Fetched machine data:", machineData);


      // 2.  Fix camera null (fetch if it's ID string or missing)
      // if (!machineData.camera || typeof machineData.camera === "string") {
      //   const cameraId =
      //     machineData.camera ||
      //     (await fetchCameraIdByMachineName(machineData.name));

      //   const camRes = await fetch(
      //     `${base_URL}/api/cameras/${cameraId}/`,
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
            `${base_URL}/api/cameras/${fallbackCameraId}/`,
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
          `${base_URL}/api/mlmodels/${mlModelId}/`,
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
    const res = await fetch(`${base_URL}/api/cameras/`, {
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
        `${base_URL}/api/machines/${selectedMachine.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
          credentials: "include",
        }
      );
      console.log("Response:", response);

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

  // Add delete variant function
  const handleDeleteVariant = async () => {
    if (!selectedVariant) return;
    
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${base_URL}/api/machinevariants/${selectedVariant.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        setVariants(prev => prev.filter(v => v.id !== selectedVariant.id));
        setVariantDeleteDialog(false);
        alert("Variant deleted successfully!");
      } else {
        alert("Failed to delete variant");
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      alert("Error deleting variant");
    }
  };

  // Delete ML model function
  const handleDeleteMLModel = async () => {
    if (!selectedMLModel) return;
    
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${base_URL}/api/mlmodels/${selectedMLModel.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        setMlModels(prev => prev.filter(m => m.id !== selectedMLModel.id));
        setMlModelDeleteDialog(false);
        alert("ML Model deleted successfully!");
      } else {
        alert("Failed to delete ML Model");
      }
    } catch (error) {
      console.error("Error deleting ML Model:", error);
      alert("Error deleting ML Model");
    }
  };

  const handleAddVariant = async () => {
    // ✅ SEPARATE VALIDATION
    if (!newVariant.name || !newVariant.biscuit_type) {
      alert("Please fill Variant Name and Biscuit Type.");
      return;
    }

    if (!newMLModel.name || !newMLModel.version || !newMLModel.model_file) {
      alert("Please fill ML Model Name, Version, and upload a Model File.");
      return;
    }

    const token = localStorage.getItem("access_token");
    let variantId = null;
    let createdModel = null;

    try {
      // ✅ STEP 1: Create ML Model with SEPARATE state
      console.log("Step 1: Creating ML Model...");
      const mlFormData = new FormData();
      mlFormData.append("name", newMLModel.name);
      mlFormData.append("version", newMLModel.version);
      mlFormData.append("model_file", newMLModel.model_file);
      mlFormData.append("description", newMLModel.description || `Model for ${newVariant.name} variant`);
      mlFormData.append("recommended_threshold", newMLModel.recommended_threshold || 0.5);

      const mlRes = await fetch(`${base_URL}/api/mlmodels/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: mlFormData,
      });

      if (!mlRes.ok) {
        const errorData = await mlRes.json();
        throw new Error(`ML Model creation failed: ${JSON.stringify(errorData)}`);
      }

      createdModel = await mlRes.json();
      console.log("✅ ML Model created:", createdModel);

      // ✅ STEP 2: Create Variant with SEPARATE state
      console.log("Step 2: Creating Variant with ML Model...");
      const variantFormData = new FormData();
      variantFormData.append("name", newVariant.name);
      variantFormData.append("biscuit_type", newVariant.biscuit_type);
      variantFormData.append("description", newVariant.description || "");
      variantFormData.append("model_threshold", newVariant.model_threshold || 0.5);
      variantFormData.append("model_verbose", newVariant.model_verbose);
      variantFormData.append("active_ml_model", createdModel.id); // Link the model

      if (newVariant.variant_config_file) {
        variantFormData.append("variant_config_file", newVariant.variant_config_file);
      }

      const variantRes = await fetch(`${base_URL}/api/machinevariants/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: variantFormData,
      });

      if (!variantRes.ok) {
        const errorData = await variantRes.json();
        // Clean up ML model if variant creation fails
        await fetch(`${base_URL}/api/mlmodels/${createdModel.id}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        throw new Error(`Variant creation failed: ${JSON.stringify(errorData)}`);
      }

      const createdVariant = await variantRes.json();
      console.log("✅ Variant created with ML model:", createdVariant);

      alert(`Variant "${createdVariant.name}" created successfully with ML model "${createdModel.name}"!`);
      handleCloseVariantDialog();
      
    } catch (error) {
      console.error("❌ Error creating variant:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCloseVariantDialog = () => {
    setVariantDialogOpen(false);
    // ✅ RESET BOTH STATES SEPARATELY
    setNewVariant({
      name: "",
      biscuit_type: "",
      description: "",
      model_threshold: 0.5,
      model_verbose: true,
      variant_config_file: null,
    });
    setNewMLModel({
      name: "",
      version: "",
      model_file: null,
      description: "",
      recommended_threshold: 0.5,
    });
  };

  // ✅ SEPARATE HANDLERS FOR VARIANT AND ML MODEL
  const handleVariantChange = (field, value) => {
    setNewVariant(prev => ({ ...prev, [field]: value }));
  };

  const handleMLModelChange = (field, value) => {
    setNewMLModel(prev => ({ ...prev, [field]: value }));
  };

  const handleVariantFileChange = (file) => {
    setNewVariant(prev => ({ ...prev, variant_config_file: file }));
  };

  const handleMLModelFileChange = (file) => {
    setNewMLModel(prev => ({ ...prev, model_file: file }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, minHeight: "100vh", bgcolor: "#f0f4f8"}}>
      {/* Sidebar - keep as is */}
      <Box sx={{ width: { xs: "100%", sm: "22%" }, background: "linear-gradient(180deg, #002049ff 0%, #182848 100%)", color: "common.white", p: { xs: 2, sm: 1.5, md: 3 }, flexShrink: 0, minWidth: "220px"}}>
        <Typography variant="h5" fontWeight={600} mb={3} display="flex" sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }} alignItems="center">
          Developer Panel
        </Typography>

        {!managerView && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            <Button startIcon={<AddIcon />} variant="contained" fullWidth onClick={handleOpen} sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", color: "common.white", fontWeight: 600, fontSize: { xs: '0.8rem', sm: "0.8rem", md: '0.9rem' }, borderRadius: 2, border: "1px solid rgba(255, 255, 255, 0.2)", "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)", borderColor: "rgba(255, 255, 255, 0.5)", transform: "translateY(-1px)" }, padding: { xs: '6px 12px', sm: '5px 16px', md: '10px 20px' } }}>
              Add Machine
            </Button>
            <Button startIcon={<CategoryIcon />} variant="contained" fullWidth onClick={() => setVariantDialogOpen(true)} sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", color: "common.white", fontWeight: 600, fontSize: { xs: '0.8rem', sm: "0.8rem", md: '0.9rem' }, borderRadius: 2, border: "1px solid rgba(255, 255, 255, 0.2)", "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)", borderColor: "rgba(255, 255, 255, 0.5)", transform: "translateY(-1px)" }, padding: { xs: '6px 12px', sm: '5px 16px', md: '10px 20px' } }}>
              Add Variant
            </Button>
          </Box>
        )}

        <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.52)" }} />
        <Typography variant="subtitle1" gutterBottom fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Machines
        </Typography>

        <List>
          {machines.map((machine) => (
            <ListItem key={machine.id} disablePadding sx={{ mb: 1.5 }}>
              <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
                <MemoryIcon />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ sx: { fontSize: { xs: '0.875rem', md: '1rem' } } }} primary={machine.name} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.52)" }} />

        {/* Variants Section */}
        <Typography variant="subtitle1" gutterBottom fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Variants
        </Typography>
        <List>
          {variants.map((variant) => (
            <ListItem key={variant.id} disablePadding sx={{ mb: 1.5 }}>
              <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText 
                primaryTypographyProps={{ sx: { fontSize: { xs: '0.875rem', md: '1rem' } } }} 
                primary={variant.name} 
              />
              <IconButton 
                size="small" 
                sx={{ color: "#fff", '&:hover': { color: 'red' } }}
                onClick={() => {
                  setSelectedVariant(variant);
                  setVariantDeleteDialog(true);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>

        {/* ML Models Section */}
        <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.52)" }} />
        <Typography variant="subtitle1" gutterBottom fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
          ML Models
        </Typography>
        <List>
          {mlModels.map((model) => (
            <ListItem key={model.id} disablePadding sx={{ mb: 1.5,}}>
              <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
                <PsychologyIcon />
              </ListItemIcon>
              <ListItemText 
                primaryTypographyProps={{ sx: { fontSize: { xs: '0.875rem', md: '1rem', wordBreak: "break-all" } } }} 
                primary={`${model.name} v${model.version}`} 
              />
              <IconButton 
                size="small" 
                sx={{ color: "#fff", '&:hover': { color: 'red' } }}
                onClick={() => {
                  setSelectedMLModel(model);
                  setMlModelDeleteDialog(true);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Section - keep as is */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" fontWeight={600} mb={4} sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Available Machines
        </Typography>

        {machines.map((machine) => (
          <Paper key={machine.id} elevation={2} sx={{ mb: 3, p: { xs: 2, md: 3 }, borderRadius: "12px", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center", "&:hover": { transform: "scale(1.01)" } }}>
            <Box>
              <Typography variant="h6" color="#022149" fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>
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
            <Button variant="text" endIcon={<ArrowForwardIosIcon />} sx={{ color: "text.secondary", fontWeight: 600, textTransform: "none", "&:hover": { bgcolor: "action.hover" } }} onClick={(e) => handleSettingsClick(e, machine)}>
              Machine Settings
            </Button>
          </Paper>
        ))}

        {/* Menu and Dialogs - keep as is */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          {!managerView && (
            <MenuItem onClick={() => { setOpenConfirmDialog(true); setAnchorEl(null); }}>Delete</MenuItem>
          )}
        </Menu>

        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} aria-labelledby="confirm-delete-dialog">
          <DialogTitle id="confirm-delete-dialog">Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete <strong>{selectedMachine?.name}</strong>?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained" autoFocus>Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Machine Creation Dialog - keep as is */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography variant="h4" gutterBottom>Developer Settings</Typography>
          <AddMachineStepper mode={mode} editData={editData} onClose={handleClose} onMachineCreated={fetchMachines} />
        </DialogContent>
      </Dialog>

      {/* ✅ UPDATED: Add Variant Dialog with SEPARATE state handling */}
      <Dialog open={variantDialogOpen} onClose={handleCloseVariantDialog} maxWidth="sm" fullWidth>
        <DialogTitle variant="h4" sx={{ fontWeight: 'bold', color: '#022149', pb: 1 }}>Create New Variant</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#7e7e7eff' }}>
            Create a new product type that can be assigned to machines.
          </Typography>
          
          {/* VARIANT FIELDS */}
          <TextField
            autoFocus
            margin="dense"
            label="Variant Name"
            fullWidth
            variant="outlined"
            value={newVariant.name}
            onChange={(e) => handleVariantChange('name', e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Biscuit Type"
            fullWidth
            variant="outlined"
            value={newVariant.biscuit_type}
            onChange={(e) => handleVariantChange('biscuit_type', e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newVariant.description}
            onChange={(e) => handleVariantChange('description', e.target.value)}
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2, color: '#ffffff', border: "none", bgcolor: '#022149' }}
          >
            {newVariant.variant_config_file ? `Config: ${newVariant.variant_config_file.name}` : "Upload Variant Config File"}
            <input type="file" hidden onChange={(e) => handleVariantFileChange(e.target.files[0])} />
          </Button>

          {/* ML MODEL FIELDS */}
          <Accordion sx={{ mt: 2, boxShadow: 'none', border: '3px solid #022149', borderRadius: 1, bgcolor: '#f5fdfdff', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#022149' }} />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#022149' }}>Add Initial ML Model (Required)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                ML Model will be automatically linked to this variant.
              </Typography>
              <TextField
                margin="dense"
                label="Model Name"
                fullWidth
                variant="outlined"
                value={newMLModel.name}
                onChange={(e) => handleMLModelChange('name', e.target.value)}
                required
              />
              <TextField
                margin="dense"
                label="Model Version"
                fullWidth
                variant="outlined"
                value={newMLModel.version}
                onChange={(e) => handleMLModelChange('version', e.target.value)}
                required
              />
              <TextField
                margin="dense"
                label="Model Description"
                fullWidth
                variant="outlined"
                value={newMLModel.description}
                onChange={(e) => handleMLModelChange('description', e.target.value)}
              />
              <TextField
                margin="dense"
                label="Recommended Threshold"
                type="number"
                fullWidth
                variant="outlined"
                value={newMLModel.recommended_threshold}
                onChange={(e) => handleMLModelChange('recommended_threshold', parseFloat(e.target.value) || 0)}
                helperText="Detection sensitivity (e.g., 0.65)"
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 2, color: '#ffffff', border: "none", bgcolor: '#022149' }}
              >
                {newMLModel.model_file ? `File: ${newMLModel.model_file.name}` : "Upload Model File"}
                <input type="file" hidden onChange={(e) => handleMLModelFileChange(e.target.files[0])} />
              </Button>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={handleCloseVariantDialog}>Cancel</Button>
          <Button onClick={handleAddVariant} variant="contained" sx={{ bgcolor: '#022149' }}>Create Variant</Button>
        </DialogActions>
      </Dialog>

      {/* Variant Delete Confirmation Dialog */}
      <Dialog open={variantDeleteDialog} onClose={() => setVariantDeleteDialog(false)}>
        <DialogTitle>Delete Variant</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete variant <strong>"{selectedVariant?.name}"</strong>?<br/>
            Many Machines may be still using this Variant.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVariantDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteVariant} color="error" variant="contained">
            Delete Variant
          </Button>
        </DialogActions>
      </Dialog>

      {/* ML Model Delete Confirmation Dialog */}
      <Dialog open={mlModelDeleteDialog} onClose={() => setMlModelDeleteDialog(false)}>
        <DialogTitle>Delete ML Model</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete ML Model <strong>"{selectedMLModel?.name} v{selectedMLModel?.version}"</strong>?<br/>
            Many Vairants may be still using this ML Model.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMlModelDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteMLModel} color="error" variant="contained">
            Delete ML Model
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeveloperSettings;