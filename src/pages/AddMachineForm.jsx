// // import React, { useState } from "react";
// // import {
// //   Stepper,
// //   Step,
// //   StepLabel,
// //   Button,
// //   TextField,
// //   Grid,
// //   Typography,
// //   Box,
// //   Paper,
// //   FormHelperText,
// // } from "@mui/material";
// // import axios from "axios";

// // const AddMachineForm = () => {
// //   const [activeStep, setActiveStep] = useState(0);
// //   const [pathFormatError, setPathFormatError] = useState("");

// //   const [formData, setFormData] = useState({
// //     name: "",
// //     sdk_path: "",
// //     features_file_path: "",
// //     camera_serial_numbers: "",
// //     model_threshold: 0,
// //     model_verbose: true,
// //     max_failed_frames: 5,
// //     check_max_failed_frames: true,
// //     frame_height: 720,
// //     frame_width: 1280,
// //     acquisition_frame_rate: 0,
// //     exposure_time: 0,
// //     trigger_mode: "",
// //     offset_x: 0,
// //     offset_y: 0,
// //     input_log_dir_path: "",
// //     output_log_dir_path: "",
// //     watchdog_obs_folder_path: "",
// //     // watchdog_obs_file_exts: "",
// //     // watchdog_file_expi_time: "",
// //     watchdog_obs_file_exts: ".log", // <-- Hardcoded default
// //     watchdog_file_expi_time: "60", // <-- Hardcoded default
// //     video_stream: true,
// //     video_folder_path: "",
// //     ml_model: "",
// //     is_active: true,
// //   });

// //   const steps = ["Add Machine Details", "More Details"];

// //   const handleChange = (e) => {
// //     const { name, type, value, files } = e.target;

// //     if (type === "file") {
// //       setFormData((prev) => ({
// //         ...prev,
// //         [name]: files[0], // Save the actual File object
// //       }));
// //     } else {
// //       setFormData((prev) => ({
// //         ...prev,
// //         [name]: type === "number" ? parseFloat(value) || 0 : value,
// //       }));
// //     }
// //   };

// //   const handleNext = () => {
// //     if (formData.name && formData.sdk_path && formData.features_file_path) {
// //       console.log("this is file name : ", formData.features_file_path.name);
// //       setActiveStep((prev) => prev + 1);
// //     } else {
// //       alert("Please fill in all required fields.");
// //     }
// //   };

// //   const handleBack = () => setActiveStep((prev) => prev - 1);

// //   const handleSubmit = async () => {
// //     const data = new FormData();
// //     for (const key in formData) {
// //       if (formData[key] !== null && formData[key] !== undefined) {
// //         data.append(key, formData[key]);
// //       }
// //     }

// //     try {
// //       const response = await axios.post(
// //         "http://localhost:8000/api/machines/",
// //         data,
// //         {
// //           headers: {
// //             "Content-Type": "multipart/form-data",
// //           },
// //         }
// //       );

// //       alert("Machine created successfully!");
// //       setActiveStep(0);
// //       // Reset form
// //       setFormData({
// //         name: "",
// //         sdk_path: "",
// //         features_file_path: "",
// //         camera_serial_numbers: "",
// //         model_threshold: 0,
// //         model_verbose: true,
// //         max_failed_frames: 5,
// //         check_max_failed_frames: true,
// //         frame_height: 720,
// //         frame_width: 1280,
// //         acquisition_frame_rate: 0,
// //         exposure_time: 0,
// //         trigger_mode: "",
// //         offset_x: 0,
// //         offset_y: 0,
// //         input_log_dir_path: "",
// //         output_log_dir_path: "",
// //         watchdog_obs_folder_path: "",
// //         // watchdog_obs_file_exts: "",
// //         // watchdog_file_expi_time: "",
// //         watchdog_obs_file_exts: ".log", // <-- Hardcoded default
// //         watchdog_file_expi_time: "60", // <-- Hardcoded default
// //         video_stream: true,
// //         video_folder_path: "",
// //         ml_model: "",
// //         is_active: true,
// //       });
// //     } catch (err) {
// //       console.error(
// //         "Error creating machine:",
// //         err.response?.data || err.message
// //       );
// //       alert("Failed to create machine.");
// //     }
// //   };

// //   return (
// //     <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
// //       {/* <Typography variant="h5" gutterBottom>
// //         Create New Machine
// //       </Typography> */}
// //       <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
// //         {steps.map((label) => (
// //           <Step key={label}>
// //             <StepLabel>{label}</StepLabel>
// //           </Step>
// //         ))}
// //       </Stepper>

// //       {activeStep === 0 && (
// //         <Box>
// //           <Grid container spacing={2}>
// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Machine Name"
// //                 name="name"
// //                 required
// //                 value={formData.name}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 fullWidth
// //                 label="SDK Path"
// //                 name="sdk_path"
// //                 required
// //                 value={formData.sdk_path}
// //                 onChange={handleChange}
// //               />
// //             </Grid>

// //             <Grid item xs={12}>
// //               <input
// //                 type="file"
// //                 id="features_file_path"
// //                 name="features_file_path"
// //                 onChange={handleChange}
// //                 required
// //                 style={{ display: "none" }}
// //               />
// //               <label htmlFor="features_file_path">
// //                 <Button fullWidth variant="outlined" component="span">
// //                   {formData.features_file_path?.name || "Select Features File"}
// //                 </Button>
// //               </label>
// //               {formData.features_file_path && (
// //                 <FormHelperText>
// //                   Selected file: {formData.features_file_path.name}
// //                 </FormHelperText>
// //               )}
// //             </Grid>

// //             <Grid item xs={12}>
// //               <TextField
// //                 fullWidth
// //                 label="Camera Serial Numbers"
// //                 name="camera_serial_numbers"
// //                 value={formData.camera_serial_numbers}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Model Threshold"
// //                 name="model_threshold"
// //                 type="number"
// //                 value={formData.model_threshold}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //           </Grid>
// //           <Box display="flex" justifyContent="flex-end" mt={3}>
// //             <Button variant="contained" onClick={handleNext}>
// //               Next
// //             </Button>
// //           </Box>
// //         </Box>
// //       )}

// //       {activeStep === 1 && (
// //         <Box>
// //           <Grid container spacing={2}>
// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Frame Height"
// //                 name="frame_height"
// //                 type="number"
// //                 value={formData.frame_height}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Frame Width"
// //                 name="frame_width"
// //                 type="number"
// //                 value={formData.frame_width}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Offset X"
// //                 name="offset_x"
// //                 type="number"
// //                 value={formData.offset_x}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={6}>
// //               <TextField
// //                 fullWidth
// //                 label="Offset Y"
// //                 name="offset_y"
// //                 type="number"
// //                 value={formData.offset_y}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12}>
// //               <TextField
// //                 fullWidth
// //                 label="Input Log Dir Path"
// //                 name="input_log_dir_path"
// //                 value={formData.input_log_dir_path}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12}>
// //               <TextField
// //                 fullWidth
// //                 label="Output Log Dir Path"
// //                 name="output_log_dir_path"
// //                 value={formData.output_log_dir_path}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12}>
// //               <TextField
// //                 fullWidth
// //                 label="Watchdog OBS Folder Path"
// //                 name="watchdog_obs_folder_path"
// //                 value={formData.watchdog_obs_folder_path}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //             <Grid item xs={12}>
// //               <TextField
// //                 fullWidth
// //                 label="ML Model UUID"
// //                 name="ml_model"
// //                 value={formData.ml_model}
// //                 onChange={handleChange}
// //               />
// //             </Grid>
// //           </Grid>

// //           <Box display="flex" justifyContent="space-between" mt={3}>
// //             <Button variant="outlined" onClick={handleBack}>
// //               Back
// //             </Button>
// //             <Box>
// //               <Button variant="text" onClick={handleSubmit} sx={{ mr: 1 }}>
// //                 Skip
// //               </Button>
// //               <Button variant="contained" onClick={handleSubmit}>
// //                 Submit
// //               </Button>
// //             </Box>
// //           </Box>
// //         </Box>
// //       )}
// //     </Paper>
// //   );
// // };

// // export default AddMachineForm;

// // import React, { useState } from "react";
// // import {
// //   Stepper,
// //   Step,
// //   StepLabel,
// //   Button,
// //   TextField,
// //   Grid,
// //   Box,
// //   Paper,
// //   FormHelperText,
// //   Typography,
// // } from "@mui/material";
// // import axios from "axios";

// // const AddMachineForm = () => {
// //   const [activeStep, setActiveStep] = useState(0);

// //   const [formData, setFormData] = useState({
// //     name: "",
// //     sdk_path: "",
// //     features_file_path: "",
// //     camera_serial_numbers: "",
// //     model_threshold: 0,
// //     model_verbose: true,
// //     max_failed_frames: 5,
// //     check_max_failed_frames: true,
// //     frame_height: 720,
// //     frame_width: 1280,
// //     acquisition_frame_rate: 0,
// //     exposure_time: 0,
// //     trigger_mode: "",
// //     offset_x: 0,
// //     offset_y: 0,
// //     input_log_dir_path: "",
// //     output_log_dir_path: "",
// //     watchdog_obs_folder_path: "",
// //     watchdog_obs_file_exts: ".log", // Hardcoded
// //     watchdog_file_expi_time: "60", // Hardcoded
// //     video_stream: true,
// //     video_folder_path: "",
// //     ml_model: "",
// //     is_active: true,
// //   });

// //   const steps = ["Add Machine Details", "More Details"];

// //   const handleChange = (e) => {
// //     const { name, type, value, files } = e.target;

// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]:
// //         type === "file"
// //           ? files[0]
// //           : type === "number"
// //             ? parseFloat(value) || 0
// //             : value,
// //     }));
// //   };

// //   const handleNext = () => {
// //     if (formData.name && formData.sdk_path && formData.features_file_path) {
// //       setActiveStep((prev) => prev + 1);
// //     } else {
// //       alert("Please fill in all required fields.");
// //     }
// //   };

// //   const handleBack = () => setActiveStep((prev) => prev - 1);

// //   const handleSubmit = async () => {
// //     const data = new FormData();
// //     for (const key in formData) {
// //       if (formData[key] !== null && formData[key] !== undefined) {
// //         data.append(key, formData[key]);
// //       }
// //     }

// //     try {
// //       await axios.post("http://localhost:8000/api/machines/", data, {
// //         headers: { "Content-Type": "multipart/form-data" },
// //       });
// //       alert("Machine created successfully!");
// //       setActiveStep(0);
// //       // Reset form
// //       setFormData((prev) => ({
// //         ...prev,
// //         name: "",
// //         sdk_path: "",
// //         features_file_path: "",
// //         camera_serial_numbers: "",
// //         model_threshold: 0,
// //         model_verbose: true,
// //         max_failed_frames: 5,
// //         check_max_failed_frames: true,
// //         frame_height: 720,
// //         frame_width: 1280,
// //         acquisition_frame_rate: 0,
// //         exposure_time: 0,
// //         trigger_mode: "",
// //         offset_x: 0,
// //         offset_y: 0,
// //         input_log_dir_path: "",
// //         output_log_dir_path: "",
// //         watchdog_obs_folder_path: "",
// //         watchdog_obs_file_exts: ".log",
// //         watchdog_file_expi_time: "60",
// //         video_stream: true,
// //         video_folder_path: "",
// //         ml_model: "",
// //         is_active: true,
// //       }));
// //     } catch (err) {
// //       console.error(
// //         "Error creating machine:",
// //         err.response?.data || err.message
// //       );
// //       alert("Failed to create machine.");
// //     }
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         position: "fixed",
// //         top: 0,
// //         left: 0,
// //         zIndex: 1300,
// //         width: "100vw",
// //         height: "100vh",
// //         backdropFilter: "blur(8px)",
// //         backgroundColor: "rgba(0,0,0,0.3)",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //       }}
// //     >
// //       <Paper
// //         elevation={4}
// //         sx={{
// //           p: 5,
// //           width: "90%",
// //           maxWidth: 1000,
// //           maxHeight: "90vh",
// //           overflowY: "auto",
// //           borderRadius: 4,
// //           backgroundColor: "rgba(255,255,255,0.9)",
// //         }}
// //       >
// //         <Typography variant="h5" align="center" gutterBottom>
// //           Add New Machine
// //         </Typography>

// //         <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
// //           {steps.map((label) => (
// //             <Step key={label}>
// //               <StepLabel>{label}</StepLabel>
// //             </Step>
// //           ))}
// //         </Stepper>

// //         {activeStep === 0 && (
// //           <Box>
// //             <Grid container spacing={2}>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Machine Name"
// //                   name="name"
// //                   required
// //                   value={formData.name}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="SDK Path"
// //                   name="sdk_path"
// //                   required
// //                   value={formData.sdk_path}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <input
// //                   type="file"
// //                   id="features_file_path"
// //                   name="features_file_path"
// //                   onChange={handleChange}
// //                   required
// //                   style={{ display: "none" }}
// //                 />
// //                 <label htmlFor="features_file_path">
// //                   <Button fullWidth variant="outlined" component="span">
// //                     {formData.features_file_path?.name ||
// //                       "Select Features File"}
// //                   </Button>
// //                 </label>
// //                 {formData.features_file_path && (
// //                   <FormHelperText>
// //                     Selected file: {formData.features_file_path.name}
// //                   </FormHelperText>
// //                 )}
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   fullWidth
// //                   label="Camera Serial Numbers"
// //                   name="camera_serial_numbers"
// //                   value={formData.camera_serial_numbers}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //               <Grid item xs={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Model Threshold"
// //                   name="model_threshold"
// //                   type="number"
// //                   value={formData.model_threshold}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //             </Grid>
// //             <Box display="flex" justifyContent="flex-end" mt={3}>
// //               <Button variant="contained" onClick={handleNext}>
// //                 Next
// //               </Button>
// //             </Box>
// //           </Box>
// //         )}

// //         {activeStep === 1 && (
// //           <Box>
// //             <Grid container spacing={2}>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Frame Height"
// //                   name="frame_height"
// //                   type="number"
// //                   value={formData.frame_height}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Frame Width"
// //                   name="frame_width"
// //                   type="number"
// //                   value={formData.frame_width}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //               <Grid item xs={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Offset X"
// //                   name="offset_x"
// //                   type="number"
// //                   value={formData.offset_x}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //               <Grid item xs={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Offset Y"
// //                   name="offset_y"
// //                   type="number"
// //                   value={formData.offset_y}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   fullWidth
// //                   label="Input Log Dir Path"
// //                   name="input_log_dir_path"
// //                   value={formData.input_log_dir_path}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   fullWidth
// //                   label="Output Log Dir Path"
// //                   name="output_log_dir_path"
// //                   value={formData.output_log_dir_path}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   fullWidth
// //                   label="Watchdog OBS Folder Path"
// //                   name="watchdog_obs_folder_path"
// //                   value={formData.watchdog_obs_folder_path}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   fullWidth
// //                   label="ML Model UUID"
// //                   name="ml_model"
// //                   value={formData.ml_model}
// //                   onChange={handleChange}
// //                 />
// //               </Grid>
// //             </Grid>

// //             <Box display="flex" justifyContent="space-between" mt={3}>
// //               <Button variant="outlined" onClick={handleBack}>
// //                 Back
// //               </Button>
// //               <Box>
// //                 <Button variant="text" onClick={handleSubmit} sx={{ mr: 1 }}>
// //                   Skip
// //                 </Button>
// //                 <Button variant="contained" onClick={handleSubmit}>
// //                   Submit
// //                 </Button>
// //               </Box>
// //             </Box>
// //           </Box>
// //         )}
// //       </Paper>
// //     </Box>
// //   );
// // };

// // export default AddMachineForm;

// import React, { useState } from "react";
// import {
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   TextField,
//   Grid,
//   Box,
//   Paper,
//   FormHelperText,
//   IconButton,
//   Fade,
//   Modal,
//   Typography,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";

// const AddMachineForm = ({ onClose }) => {
//   const [activeStep, setActiveStep] = useState(0);

//   const [formData, setFormData] = useState({
//     name: "",
//     sdk_path: "",
//     features_file_path: "",
//     camera_serial_numbers: "",
//     model_threshold: 0,
//     model_verbose: true,
//     max_failed_frames: 5,
//     check_max_failed_frames: true,
//     frame_height: 720,
//     frame_width: 1280,
//     acquisition_frame_rate: 0,
//     exposure_time: 0,
//     trigger_mode: "",
//     offset_x: 0,
//     offset_y: 0,
//     input_log_dir_path: "",
//     output_log_dir_path: "",
//     watchdog_obs_folder_path: "",
//     watchdog_obs_file_exts: ".log",
//     watchdog_file_expi_time: "60",
//     video_stream: true,
//     video_folder_path: "",
//     ml_model: "",
//     is_active: true,
//   });

//   const steps = ["Add Machine Details", "More Details"];

//   const handleChange = (e) => {
//     const { name, type, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "file"
//           ? files[0]
//           : type === "number"
//             ? parseFloat(value) || 0
//             : value,
//     }));
//   };

//   const handleNext = () => {
//     if (formData.name && formData.sdk_path && formData.features_file_path) {
//       setActiveStep((prev) => prev + 1);
//     } else {
//       alert("Please fill in all required fields.");
//     }
//   };

//   const handleBack = () => setActiveStep((prev) => prev - 1);

//   const handleSubmit = async () => {
//     const data = new FormData();
//     for (const key in formData) {
//       if (formData[key] !== null && formData[key] !== undefined) {
//         data.append(key, formData[key]);
//       }
//     }

//     try {
//       await axios.post("http://localhost:8000/api/machines/", data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Machine created successfully!");
//       setFormData({
//         ...formData,
//         name: "",
//         sdk_path: "",
//         features_file_path: "",
//       });
//       setActiveStep(0);
//       onClose();
//     } catch (err) {
//       console.error(
//         "Error creating machine:",
//         err.response?.data || err.message
//       );
//       alert("Failed to create machine.");
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       closeAfterTransition
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         zIndex: 1300,
//         width: "100vw",
//         height: "100vh",
//         backdropFilter: "blur(8px)",
//         backgroundColor: "rgba(0,0,0,0.3)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Fade in={open}>
//         <Paper
//           elevation={4}
//           sx={{
//             p: 4,
//             maxWidth: 900,
//             mx: "auto",
//             mt: 6,
//             position: "relative",
//             borderRadius: 3,
//           }}
//         >
//           <IconButton
//             onClick={onClose}
//             sx={{ position: "absolute", top: 8, right: 8 }}
//           >
//             <CloseIcon />
//           </IconButton>

//           <Typography variant="h5" gutterBottom>
//             Create New Machine
//           </Typography>

//           <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//           {activeStep === 0 && (
//             <Box>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Machine Name"
//                     name="name"
//                     required
//                     value={formData.name}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="SDK Path"
//                     name="sdk_path"
//                     required
//                     value={formData.sdk_path}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <input
//                     type="file"
//                     id="features_file_path"
//                     name="features_file_path"
//                     onChange={handleChange}
//                     required
//                     style={{ display: "none" }}
//                   />
//                   <label htmlFor="features_file_path">
//                     <Button fullWidth variant="outlined" component="span">
//                       {formData.features_file_path?.name ||
//                         "Select Features File"}
//                     </Button>
//                   </label>
//                   {formData.features_file_path && (
//                     <FormHelperText>
//                       Selected file: {formData.features_file_path.name}
//                     </FormHelperText>
//                   )}
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Camera Serial Numbers"
//                     name="camera_serial_numbers"
//                     value={formData.camera_serial_numbers}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Model Threshold"
//                     name="model_threshold"
//                     type="number"
//                     value={formData.model_threshold}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//               </Grid>
//               <Box display="flex" justifyContent="flex-end" mt={3}>
//                 <Button variant="contained" onClick={handleNext}>
//                   Next
//                 </Button>
//               </Box>
//             </Box>
//           )}

//           {activeStep === 1 && (
//             <Box>
//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Frame Height"
//                     name="frame_height"
//                     type="number"
//                     value={formData.frame_height}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Frame Width"
//                     name="frame_width"
//                     type="number"
//                     value={formData.frame_width}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Offset X"
//                     name="offset_x"
//                     type="number"
//                     value={formData.offset_x}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Offset Y"
//                     name="offset_y"
//                     type="number"
//                     value={formData.offset_y}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Input Log Dir Path"
//                     name="input_log_dir_path"
//                     value={formData.input_log_dir_path}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Output Log Dir Path"
//                     name="output_log_dir_path"
//                     value={formData.output_log_dir_path}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Watchdog OBS Folder Path"
//                     name="watchdog_obs_folder_path"
//                     value={formData.watchdog_obs_folder_path}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="ML Model UUID"
//                     name="ml_model"
//                     value={formData.ml_model}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//               </Grid>
//               <Box display="flex" justifyContent="space-between" mt={3}>
//                 <Button variant="outlined" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Box>
//                   <Button variant="text" onClick={handleSubmit} sx={{ mr: 1 }}>
//                     Skip
//                   </Button>
//                   <Button variant="contained" onClick={handleSubmit}>
//                     Submit
//                   </Button>
//                 </Box>
//               </Box>
//             </Box>
//           )}
//         </Paper>
//       </Fade>
//     </Modal>
//   );
// };

// export default AddMachineForm;




