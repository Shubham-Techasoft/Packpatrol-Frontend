// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Grid,
//   Typography,
//   TextField,
//   Switch,
//   Button,
//   Paper,
//   FormControlLabel,
//   Divider,
//   styled,
//   keyframes,
// } from "@mui/material";
// import axios from "axios";

// // Keyframes for subtle background animation
// const subtleGradient = keyframes`
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// `;

// // Styled Paper component for a modern look
// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   borderRadius: theme.shape.borderRadius * 2,
//   boxShadow: theme.shadows[8],
//   background: `linear-gradient(45deg, ${theme.palette.grey[100]} 30%, ${theme.palette.common.white} 90%)`,
//   animation: `${subtleGradient} 5s ease infinite`,
//   backgroundSize: "200% 200%",
// }));

// // Styled Typography for the main heading
// const StyledHeading = styled(Typography)(({ theme }) => ({
//   fontWeight: 600,
//   color: theme.palette.primary.dark,
//   marginBottom: theme.spacing(3),
// }));

// // Styled Typography for section headings
// const StyledSubHeading = styled(Typography)(({ theme }) => ({
//   fontWeight: 500,
//   color: theme.palette.secondary.main,
//   marginBottom: theme.spacing(2),
// }));

// // Styled Divider with a touch of color
// const StyledDivider = styled(Divider)(({ theme }) => ({
//   margin: theme.spacing(3, 0),
//   backgroundColor: theme.palette.primary.light,
//   height: 2,
// }));

// // Styled TextField for a consistent and modern input
// const StyledTextField = styled(TextField)(({ theme }) => ({
//   "& label.Mui-focused": {
//     color: theme.palette.primary.main,
//   },
//   "& .MuiInput-underline:after": {
//     borderBottomColor: theme.palette.primary.main,
//   },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       borderColor: theme.palette.grey[400],
//     },
//     "&:hover fieldset": {
//       borderColor: theme.palette.primary.light,
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: theme.palette.primary.main,
//     },
//   },
// }));

// // Styled Switch for a more prominent appearance
// const StyledSwitch = styled(Switch)(({ theme }) => ({
//   "& .MuiSwitch-switchBase.Mui-checked": {
//     color: theme.palette.primary.main,
//     "& + .MuiSwitch-track": {
//       backgroundColor: theme.palette.primary.main,
//     },
//   },
//   "& .MuiSwitch-switchBase.Mui-focusVisible": {
//     ".MuiSwitch-thumb": {
//       color: theme.palette.primary.main,
//     },
//   },
// }));

// // Styled Button with a more pronounced hover effect
// const StyledButton = styled(Button)(({ theme }) => ({
//   padding: theme.spacing(1.5, 3),
//   borderRadius: theme.shape.borderRadius,
//   fontWeight: 500,
//   boxShadow: theme.shadows[3],
//   "&:hover": {
//     boxShadow: theme.shadows[6],
//   },
// }));

// const DeveloperSettingsPage = () => {
//   const [settings, setSettings] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchSettings = async () => {
//     console.log("fetch Settings fire");

//     try {
//       const res = await axios.get(
//         "http://localhost:8000/dev/developer-settings"
//       );
//       console.log("this is the res: ", res.data);
//       setSettings(res.data);
//     } catch (err) {
//       console.error("Failed to fetch settings:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setSettings((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleCameraChange = (cameraNum, field, value) => {
//     setSettings((prev) => ({
//       ...prev,
//       [`camera_name_${cameraNum}`]:
//         field === "camera_name" ? value : prev[`camera_name_${cameraNum}`],
//       [`camera_serial_no_${cameraNum}`]:
//         field === "camera_serial_no"
//           ? value
//           : prev[`camera_serial_no_${cameraNum}`],
//       [`exposure_time_${cameraNum}`]:
//         field === "exposure_time" ? value : prev[`exposure_time_${cameraNum}`],
//       [`live_${cameraNum}`]:
//         field === "live" ? value : prev[`live_${cameraNum}`],
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.post(
//         "http://localhost:8000/dev/developer-settings",
//         settings
//       );
//       alert("Settings updated successfully!");
//     } catch (err) {
//       console.error("Update failed:", err);
//       alert("Update failed.");
//     }
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   if (loading || !settings)
//     return (
//       <Typography variant="h6" color="info">
//         Loading Developer Settings...
//       </Typography>
//     );

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "flex-start",
//         minHeight: "100vh",
//         padding: (theme) => theme.spacing(5),
//         background: `linear-gradient(135deg, #f0f2f5 0%, #e1e6ed 100%)`,
//       }}
//     >
//       <StyledPaper sx={{ maxWidth: 1200, width: "100%", }}>
//         <StyledHeading variant="h4" gutterBottom>
//           Developer Settings
//         </StyledHeading>

//         {/* Model Settings */}
//         <StyledSubHeading variant="h6">Model Settings</StyledSubHeading>
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           <Grid item xs={12} sm={4}>
//             <StyledTextField
//               fullWidth
//               label="Confidence Threshold"
//               type="number"
//               value={settings.model_confidence_threshold}
//               onChange={(e) =>
//                 handleChange(
//                   "model_confidence_threshold",
//                   parseFloat(e.target.value)
//                 )
//               }
//             />
//           </Grid>
//           <Grid item xs={12} sm={8}>
//             <StyledTextField
//               fullWidth
//               label="Model Weight Path"
//               value={settings.model_weight_path}
//               onChange={(e) =>
//                 handleChange("model_weight_path", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControlLabel
//               control={
//                 <StyledSwitch
//                   checked={settings.model_verbose}
//                   onChange={(e) =>
//                     handleChange("model_verbose", e.target.checked)
//                   }
//                 />
//               }
//               label="Verbose Output"
//             />
//           </Grid>
//         </Grid>

//         <StyledDivider />

//         {/* Camera Settings */}
//         <StyledSubHeading variant="h6">Camera Settings</StyledSubHeading>
//         {[1, 2, 3, 4].map((num) => (
//           <Grid container spacing={3} key={num} sx={{ mb: 3 }}>
//             <Grid item xs={12} sm={6}>
//               <StyledTextField
//                 fullWidth
//                 label={`Camera Name ${num}`}
//                 value={settings[`camera_name_${num}`]}
//                 onChange={(e) =>
//                   handleCameraChange(num, "camera_name", e.target.value)
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <StyledTextField
//                 fullWidth
//                 label={`Camera Serial No ${num}`}
//                 value={settings[`camera_serial_no_${num}`]}
//                 onChange={(e) =>
//                   handleCameraChange(num, "camera_serial_no", e.target.value)
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <StyledTextField
//                 fullWidth
//                 label={`Exposure Time ${num}`}
//                 type="number"
//                 value={settings[`exposure_time_${num}`]}
//                 onChange={(e) =>
//                   handleCameraChange(
//                     num,
//                     "exposure_time",
//                     parseInt(e.target.value)
//                   )
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControlLabel
//                 control={
//                   <StyledSwitch
//                     checked={settings[`live_${num}`]}
//                     onChange={(e) =>
//                       handleCameraChange(num, "live", e.target.checked)
//                     }
//                   />
//                 }
//                 label={`Live Mode ${num}`}
//               />
//             </Grid>
//           </Grid>
//         ))}

//         <StyledDivider />

//         {/* Frame Failure Settings */}
//         <StyledSubHeading variant="h6">Frame Failure Settings</StyledSubHeading>
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           <Grid item xs={12} sm={4}>
//             <FormControlLabel
//               control={
//                 <StyledSwitch
//                   checked={settings.frame_failed_check}
//                   onChange={(e) =>
//                     handleChange("frame_failed_check", e.target.checked)
//                   }
//                 />
//               }
//               label="Check Frame Failures"
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <StyledTextField
//               fullWidth
//               label="Failure Count Threshold"
//               type="number"
//               value={settings.frame_failed_count}
//               onChange={(e) =>
//                 handleChange("frame_failed_count", parseInt(e.target.value))
//               }
//             />
//           </Grid>
//         </Grid>

//         <StyledDivider />

//         {/* Machine Image Settings */}
//         <StyledSubHeading variant="h6">Machine Image Settings</StyledSubHeading>
//         {[1, 2, 3, 4].map((num) => (
//           <Grid container spacing={3} key={num} sx={{ mb: 2 }}>
//             <Grid item xs={12} sm={4}>
//               <StyledTextField
//                 fullWidth
//                 label={`Max Images Machine ${num}`}
//                 type="number"
//                 value={settings[`max_images_machine_${num}`]}
//                 onChange={(e) =>
//                   handleChange(
//                     `max_images_machine_${num}`,
//                     parseInt(e.target.value)
//                   )
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} sm={8}>
//               <StyledTextField
//                 fullWidth
//                 label={`Image Path Machine ${num}`}
//                 value={settings[`image_path_machine_${num}`]}
//                 onChange={(e) =>
//                   handleChange(`image_path_machine_${num}`, e.target.value)
//                 }
//               />
//             </Grid>
//           </Grid>
//         ))}

//         <StyledDivider />

//         {/* Email Suffix */}
//         <StyledSubHeading variant="h6">Company Email</StyledSubHeading>
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           <Grid item xs={12} sm={6}>
//             <StyledTextField
//               fullWidth
//               label="Email Suffix"
//               value={settings.company_email_suffix}
//               onChange={(e) =>
//                 handleChange("company_email_suffix", e.target.value)
//               }
//             />
//           </Grid>
//         </Grid>

//         <Box mt={4} display="flex" justifyContent="flex-end">
//           <StyledButton
//             variant="contained"
//             color="primary"
//             onClick={handleSubmit}
//           >
//             Save Settings
//           </StyledButton>
//         </Box>
//       </StyledPaper>
//     </Box>
//   );
// };

// export default DeveloperSettingsPage;

// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Divider,
//   Paper,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import MemoryIcon from "@mui/icons-material/Memory";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// const DeveloperSettings = () => {
//   const [machines, setMachines] = useState([]);
//   const [selectedMachine, setSelectedMachine] = useState(null);

//   const createMachine = () => {
//     const newMachine = {
//       name: `Machine ${machines.length + 1}`,
//       id: Date.now(),
//     };
//     setMachines([...machines, newMachine]);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         height: "100vh",
//         bgcolor: "#f0f4f8",
//         fontFamily: "Roboto, sans-serif",
//       }}
//     >
//       {/* Sidebar */}
//       <Box
//         sx={{
//           width: "22%",
//           background:
//             "linear-gradient(to bottom, rgb(24, 10, 73), rgb(26, 82, 203))",
//           color: "#fff",
//           p: 3,
//         }}
//       >
//         <Typography
//           variant="h5"
//           fontWeight={600}
//           mb={3}
//           display="flex"
//           alignItems="center"
//         >
//           <MemoryIcon sx={{ mr: 1 }} /> Add Machine
//         </Typography>

//         <Button
//           startIcon={<AddIcon />}
//           variant="contained"
//           fullWidth
//           onClick={createMachine}
//           sx={{
//             mb: 3,
//             background: "linear-gradient(to bottom, #00b09b, #96c93d)",
//             color: "#fff",
//             fontWeight: 600,
//             borderRadius: "8px",
//             boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//             "&:hover": {
//               background: "linear-gradient(to right, #ff4b2b, #ff416c)",
//               transform: "translateY(-2px)",
//             },
//           }}
//         >
//           Add Machine
//         </Button>

//         <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />

//         <Typography
//           variant="subtitle1"
//           gutterBottom
//           fontWeight={600}
//           sx={{ fontSize: 20 }}
//         >
//           Machines
//         </Typography>

//         <List>
//           {machines.map((machine) => (
//             <ListItem key={machine.id} disablePadding sx={{ mb: 1 }}>
//               <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
//                 <MemoryIcon />
//               </ListItemIcon>
//               <ListItemText primary={machine.name} />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Center Content */}
//       <Box sx={{ flexGrow: 1, p: 4 }}>
//         <Typography variant="h4" fontWeight={600} mb={4}>
//           Available Machines
//         </Typography>

//         {machines.map((machine) => (
//           <Paper
//             key={machine.id}
//             elevation={2}
//             sx={{
//               mb: 3,
//               p: 3,
//               borderRadius: 3,
//               //   background: "linear-gradient(to right, #8360c3, #2ebf91)",
//               //   backgroundImage:
//               //     "radial-gradient(circle 427px at 51.8% 56.2%, rgba(0,122,255,1) 0%, rgba(0,51,102,1) 64.4%)",
//               backgroundImage:
//                 "linear-gradient(90.2deg, rgba(1,47,95,1) -0.4%, rgba(56,141,217,1) 106.1%)",

//               color: "#fff",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               transition: "transform 0.2s ease",
//               "&:hover": {
//                 transform: "scale(1.01)",
//               },
//             }}
//           >
//             <Box>
//               <Typography variant="h6" fontWeight={600}>
//                 {machine.name}
//               </Typography>
//               <Typography variant="body2">Status: Active</Typography>
//             </Box>
//             <Button
//               variant="text"
//               endIcon={<ArrowForwardIosIcon />}
//               sx={{
//                 color: "#fff",
//                 fontWeight: 600,
//                 textTransform: "none",
//                 "&:hover": {
//                   textDecoration: "underline",
//                 },
//               }}
//               onClick={() => {
//                 // navigate to machine settings in future
//               }}
//             >
//               Machine Settings
//             </Button>
//           </Paper>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default DeveloperSettings;

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

  const fetchMachines = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/machines/");
      setMachines(res.data);
    } catch (err) {
      console.error("Error fetching machines:", err);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            >
              Machine Settings
            </Button>
          </Paper>
        ))}
      </Box>

      {/* Machine Creation Dialog */}

      {/* Machine Creation Dialog using AddMachineForm component */}
      {/* <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Machine</DialogTitle>
        <DialogContent>
          <AddMachineForm
            // onSubmit={handleCreateMachine}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog> */}
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
          <AddMachineStepper />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DeveloperSettings;
