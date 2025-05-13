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
// } from "@mui/material";
// import axios from "axios";

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

//   if (loading || !settings) return <Typography>Loading...</Typography>;

//   return (
//     <Box p={4}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Developer Settings
//         </Typography>

//         {/* Model Settings */}
//         <Typography variant="h6">Model Settings</Typography>
//         <Grid container spacing={2} sx={{ mb: 2 }}>
//           <Grid item xs={12} sm={4}>
//             <TextField
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
//             <TextField
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
//                 <Switch
//                   checked={settings.model_verbose}
//                   onChange={(e) =>
//                     handleChange("model_verbose", e.target.checked)
//                   }
//                 />
//               }
//               label="Verbose"
//             />
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 2 }} />

//         {/* Camera Settings */}
//         <Typography variant="h6">Camera Settings</Typography>
//         {[1, 2, 3, 4].map((num) => (
//           <Grid container spacing={2} key={num} sx={{ mb: 2 }}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label={`Camera Name ${num}`}
//                 value={settings[`camera_name_${num}`]}
//                 onChange={(e) =>
//                   handleCameraChange(num, "camera_name", e.target.value)
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label={`Camera Serial No ${num}`}
//                 value={settings[`camera_serial_no_${num}`]}
//                 onChange={(e) =>
//                   handleCameraChange(num, "camera_serial_no", e.target.value)
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
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
//                   <Switch
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

//         <Divider sx={{ my: 2 }} />

//         {/* Frame Failure Settings */}
//         <Typography variant="h6">Frame Failure Settings</Typography>
//         <Grid container spacing={2} sx={{ mb: 2 }}>
//           <Grid item xs={12} sm={4}>
//             <FormControlLabel
//               control={
//                 <Switch
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
//             <TextField
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

//         <Divider sx={{ my: 2 }} />

//         {/* Machine Image Settings */}
//         <Typography variant="h6">Machine Image Settings</Typography>
//         {[1, 2, 3, 4].map((num) => (
//           <Grid container spacing={2} key={num} sx={{ mb: 1 }}>
//             <Grid item xs={12} sm={4}>
//               <TextField
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
//               <TextField
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

//         <Divider sx={{ my: 2 }} />

//         {/* Email Suffix */}
//         <Typography variant="h6">Company Email</Typography>
//         <Grid container spacing={2} sx={{ mb: 2 }}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Email Suffix"
//               value={settings.company_email_suffix}
//               onChange={(e) =>
//                 handleChange("company_email_suffix", e.target.value)
//               }
//             />
//           </Grid>
//         </Grid>

//         <Button variant="contained" color="primary" onClick={handleSubmit}>
//           Save Settings
//         </Button>
//       </Paper>
//     </Box>
//   );
// };

// export default DeveloperSettingsPage;

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Switch,
  Button,
  Paper,
  FormControlLabel,
  Divider,
  styled,
  keyframes,
} from "@mui/material";
import axios from "axios";

// Keyframes for subtle background animation
const subtleGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Paper component for a modern look
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[8],
  background: `linear-gradient(45deg, ${theme.palette.grey[100]} 30%, ${theme.palette.common.white} 90%)`,
  animation: `${subtleGradient} 5s ease infinite`,
  backgroundSize: "200% 200%",
}));

// Styled Typography for the main heading
const StyledHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(3),
}));

// Styled Typography for section headings
const StyledSubHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(2),
}));

// Styled Divider with a touch of color
const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  backgroundColor: theme.palette.primary.light,
  height: 2,
}));

// Styled TextField for a consistent and modern input
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& label.Mui-focused": {
    color: theme.palette.primary.main,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: theme.palette.primary.main,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.grey[400],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.light,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// Styled Switch for a more prominent appearance
const StyledSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.primary.main,
    "& + .MuiSwitch-track": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  "& .MuiSwitch-switchBase.Mui-focusVisible": {
    ".MuiSwitch-thumb": {
      color: theme.palette.primary.main,
    },
  },
}));

// Styled Button with a more pronounced hover effect
const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
  boxShadow: theme.shadows[3],
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
}));

const DeveloperSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    console.log("fetch Settings fire");

    try {
      const res = await axios.get(
        "http://localhost:8000/dev/developer-settings"
      );
      console.log("this is the res: ", res.data);
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleCameraChange = (cameraNum, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [`camera_name_${cameraNum}`]:
        field === "camera_name" ? value : prev[`camera_name_${cameraNum}`],
      [`camera_serial_no_${cameraNum}`]:
        field === "camera_serial_no"
          ? value
          : prev[`camera_serial_no_${cameraNum}`],
      [`exposure_time_${cameraNum}`]:
        field === "exposure_time" ? value : prev[`exposure_time_${cameraNum}`],
      [`live_${cameraNum}`]:
        field === "live" ? value : prev[`live_${cameraNum}`],
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:8000/dev/developer-settings",
        settings
      );
      alert("Settings updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed.");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading || !settings)
    return (
      <Typography variant="h6" color="info">
        Loading Developer Settings...
      </Typography>
    );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        padding: (theme) => theme.spacing(5),
        background: `linear-gradient(135deg, #f0f2f5 0%, #e1e6ed 100%)`,
      }}
    >
      <StyledPaper sx={{ maxWidth: 1200, width: "100%", }}>
        <StyledHeading variant="h4" gutterBottom>
          Developer Settings
        </StyledHeading>

        {/* Model Settings */}
        <StyledSubHeading variant="h6">Model Settings</StyledSubHeading>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <StyledTextField
              fullWidth
              label="Confidence Threshold"
              type="number"
              value={settings.model_confidence_threshold}
              onChange={(e) =>
                handleChange(
                  "model_confidence_threshold",
                  parseFloat(e.target.value)
                )
              }
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <StyledTextField
              fullWidth
              label="Model Weight Path"
              value={settings.model_weight_path}
              onChange={(e) =>
                handleChange("model_weight_path", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <StyledSwitch
                  checked={settings.model_verbose}
                  onChange={(e) =>
                    handleChange("model_verbose", e.target.checked)
                  }
                />
              }
              label="Verbose Output"
            />
          </Grid>
        </Grid>

        <StyledDivider />

        {/* Camera Settings */}
        <StyledSubHeading variant="h6">Camera Settings</StyledSubHeading>
        {[1, 2, 3, 4].map((num) => (
          <Grid container spacing={3} key={num} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label={`Camera Name ${num}`}
                value={settings[`camera_name_${num}`]}
                onChange={(e) =>
                  handleCameraChange(num, "camera_name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label={`Camera Serial No ${num}`}
                value={settings[`camera_serial_no_${num}`]}
                onChange={(e) =>
                  handleCameraChange(num, "camera_serial_no", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledTextField
                fullWidth
                label={`Exposure Time ${num}`}
                type="number"
                value={settings[`exposure_time_${num}`]}
                onChange={(e) =>
                  handleCameraChange(
                    num,
                    "exposure_time",
                    parseInt(e.target.value)
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={settings[`live_${num}`]}
                    onChange={(e) =>
                      handleCameraChange(num, "live", e.target.checked)
                    }
                  />
                }
                label={`Live Mode ${num}`}
              />
            </Grid>
          </Grid>
        ))}

        <StyledDivider />

        {/* Frame Failure Settings */}
        <StyledSubHeading variant="h6">Frame Failure Settings</StyledSubHeading>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <StyledSwitch
                  checked={settings.frame_failed_check}
                  onChange={(e) =>
                    handleChange("frame_failed_check", e.target.checked)
                  }
                />
              }
              label="Check Frame Failures"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledTextField
              fullWidth
              label="Failure Count Threshold"
              type="number"
              value={settings.frame_failed_count}
              onChange={(e) =>
                handleChange("frame_failed_count", parseInt(e.target.value))
              }
            />
          </Grid>
        </Grid>

        <StyledDivider />

        {/* Machine Image Settings */}
        <StyledSubHeading variant="h6">Machine Image Settings</StyledSubHeading>
        {[1, 2, 3, 4].map((num) => (
          <Grid container spacing={3} key={num} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <StyledTextField
                fullWidth
                label={`Max Images Machine ${num}`}
                type="number"
                value={settings[`max_images_machine_${num}`]}
                onChange={(e) =>
                  handleChange(
                    `max_images_machine_${num}`,
                    parseInt(e.target.value)
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <StyledTextField
                fullWidth
                label={`Image Path Machine ${num}`}
                value={settings[`image_path_machine_${num}`]}
                onChange={(e) =>
                  handleChange(`image_path_machine_${num}`, e.target.value)
                }
              />
            </Grid>
          </Grid>
        ))}

        <StyledDivider />

        {/* Email Suffix */}
        <StyledSubHeading variant="h6">Company Email</StyledSubHeading>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Email Suffix"
              value={settings.company_email_suffix}
              onChange={(e) =>
                handleChange("company_email_suffix", e.target.value)
              }
            />
          </Grid>
        </Grid>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Save Settings
          </StyledButton>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default DeveloperSettingsPage;
