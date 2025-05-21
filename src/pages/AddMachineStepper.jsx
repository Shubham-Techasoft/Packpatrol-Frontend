import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Grid,
  Paper,
  FormHelperText,
} from "@mui/material";

const frameworks = ["PyTorch", "TensorFlow", "ONNX", "Other"];

const AddMachineStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Step 1: ML Model States
  const [mlModel, setMlModel] = useState({
    name: "",
    version: "",
    description: "",
    framework: "",
    model_file: null,
    input_shape: "",
    output_shape: "",
    recommended_threshold: "",
    is_yolo: false,
    confidence_threshold: "",
    nms_threshold: "",
    img_size: "",
    yolo_version: "",
    weights_file: null,
    classes_file: null,
    config_file: null,
  });

  // const [activeStep, setActiveStep] = useState(0);

  const [machine, setMachine] = useState({
    name: "",
    sdk_path: "",
    features_file_path: "",
    camera_serial_numbers: "",
    model_threshold: 0,
    model_verbose: true,
    max_failed_frames: 5,
    check_max_failed_frames: true,
    frame_height: 720,
    frame_width: 1280,
    acquisition_frame_rate: 0,
    exposure_time: 0,
    trigger_mode: "",
    offset_x: 0,
    offset_y: 0,
    input_log_dir_path: "",
    output_log_dir_path: "",
    watchdog_obs_folder_path: "",
    watchdog_obs_file_exts: ".log",
    watchdog_file_expi_time: "60",
    video_stream: true,
    video_folder_path: "",
    ml_model: "",
    is_active: true,
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleMLChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setMlModel((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleMachineChange = (e) => {
    const { name, value } = e.target;
    setMachine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Upload ML model first
    const formData = new FormData();
    for (const key in mlModel) {
      if (mlModel[key]) formData.append(key, mlModel[key]);
    }

    Object.entries(mlModel).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== "" &&
        !(typeof value === "boolean" && value === false)
      ) {
        formData.append(key, value);
      }
    });

    console.log("this is form data fro ml model: ", formData);
    try {
      const mlRes = await fetch("http://localhost:8000/api/ml-models/", {
        method: "POST",
        body: formData,
      });
      console.log("this is for ml data: ", mlModel);
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      // if (!mlRes.ok) {
      //   const errorText = await mlRes.json();
      //   console.error("Backend error:", errorText);
      //   throw new Error("Failed to create ML model");
      // }
      if (!mlRes.ok) throw new Error("Failed to create ML model");
      const mlData = await mlRes.json();
      const modelId = mlData.id;
      console.log("this is MOdelID that just created: ", modelId);

      const machineFormData = new FormData();

      for (const key in machine) {
        if (machine[key] !== null && machine[key] !== "") {
          machineFormData.append(key, machine[key]);
        }
      }

      machineFormData.append("ml_model", modelId);

      
      const machineRes = await fetch("http://localhost:8000/api/machines/", {
        method: "POST",
        body: machineFormData, // Do NOT set Content-Type manually
      });
      console.log("this is for machine data: ", machine);
      console.log("this is the machine api res: ", machineRes);

      const machineErrorText = await machineRes.json();
      console.error("Backend machine error:", machineErrorText);

      if (!machineRes.ok) throw new Error("Failed to create machine");

      alert("Machine successfully created with linked ML model!");
    } catch (error) {
      console.log("this is the submit error: ", error);
      alert(error.message);
    }
  };

  const renderMLModelForm = () => (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Model Name"
            name="name"
            value={mlModel.name}
            onChange={handleMLChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Version"
            name="version"
            value={mlModel.version}
            onChange={handleMLChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            label="Description"
            name="description"
            value={mlModel.description}
            onChange={handleMLChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Framework</InputLabel>
            <Select
              name="framework"
              value={mlModel.framework}
              onChange={handleMLChange}
            >
              {frameworks.map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button fullWidth variant="outlined" component="label">
            Upload Model File
            <input
              type="file"
              hidden
              name="model_file"
              onChange={handleMLChange}
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Input Shape"
            name="input_shape"
            value={mlModel.input_shape}
            onChange={handleMLChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Output Shape"
            name="output_shape"
            value={mlModel.output_shape}
            onChange={handleMLChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Recommended Threshold"
            name="recommended_threshold"
            value={mlModel.recommended_threshold}
            onChange={handleMLChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                name="is_yolo"
                checked={mlModel.is_yolo}
                onChange={handleMLChange}
              />
            }
            label="Is YOLO Model?"
          />
        </Grid>

        {mlModel.is_yolo && (
          <>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Confidence Threshold"
                name="confidence_threshold"
                value={mlModel.confidence_threshold}
                onChange={handleMLChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="NMS Threshold"
                name="nms_threshold"
                value={mlModel.nms_threshold}
                onChange={handleMLChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Image Size"
                name="img_size"
                value={mlModel.img_size}
                onChange={handleMLChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="YOLO Version"
                name="yolo_version"
                value={mlModel.yolo_version}
                onChange={handleMLChange}
              />
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth variant="outlined" component="label">
                Weights File
                <input
                  type="file"
                  hidden
                  name="weights_file"
                  onChange={handleMLChange}
                />
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth variant="outlined" component="label">
                Classes File
                <input
                  type="file"
                  hidden
                  name="classes_file"
                  onChange={handleMLChange}
                />
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth variant="outlined" component="label">
                Config File
                <input
                  type="file"
                  hidden
                  name="config_file"
                  onChange={handleMLChange}
                />
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );

  const renderMachineForm = () => {
    const handleChange = (e) => {
      const { name, type, value, checked, files } = e.target;
      setMachine((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? checked : type === "file" ? files[0] : value,
      }));
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    return (
      <Box p={2}>
        {activeStep === 1 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Machine Name"
                  name="name"
                  required
                  value={machine.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SDK Path"
                  name="sdk_path"
                  required
                  value={machine.sdk_path}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <input
                  type="file"
                  id="features_file_path"
                  name="features_file_path"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="features_file_path">
                  <Button fullWidth variant="outlined" component="span">
                    {machine.features_file_path?.name || "Select Features File"}
                  </Button>
                </label>
                {machine.features_file_path && (
                  <FormHelperText>
                    Selected file: {machine.features_file_path.name}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Camera Serial Numbers"
                  name="camera_serial_numbers"
                  value={machine.camera_serial_numbers}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Model Threshold"
                  name="model_threshold"
                  type="number"
                  value={machine.model_threshold}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Frame Height"
                  name="frame_height"
                  type="number"
                  value={machine.frame_height}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Frame Width"
                  name="frame_width"
                  type="number"
                  value={machine.frame_width}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Offset X"
                  name="offset_x"
                  type="number"
                  value={machine.offset_x}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Offset Y"
                  name="offset_y"
                  type="number"
                  value={machine.offset_y}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Exposure Time"
                  name="exposure_time"
                  type="number"
                  value={machine.exposure_time}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Acquisition Frame Rate"
                  name="acquisition_frame_rate"
                  type="number"
                  value={machine.acquisition_frame_rate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Trigger Mode"
                  name="trigger_mode"
                  value={machine.trigger_mode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Input Log Dir Path"
                  name="input_log_dir_path"
                  value={machine.input_log_dir_path}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Output Log Dir Path"
                  name="output_log_dir_path"
                  value={machine.output_log_dir_path}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Watchdog OBS Folder Path"
                  name="watchdog_obs_folder_path"
                  value={machine.watchdog_obs_folder_path}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Watchdog File Extensions"
                  name="watchdog_obs_file_exts"
                  value={machine.watchdog_obs_file_exts}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Watchdog File Expiry Time (s)"
                  name="watchdog_file_expi_time"
                  type="number"
                  value={machine.watchdog_file_expi_time}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Video Folder Path"
                  name="video_folder_path"
                  value={machine.video_folder_path}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* <Box display="flex" justifyContent="space-between" mt={3}>
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Box> */}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Paper elevation={4} sx={{ p: 3 }}>
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>Create ML Model</StepLabel>
        </Step>
        <Step>
          <StepLabel>Add Machine Details</StepLabel>
        </Step>
      </Stepper>

      <Box mt={4}>
        {activeStep === 0 ? renderMLModelForm() : renderMachineForm()}
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          disabled={activeStep === 2 && !activeStep === 1}
          onClick={handleBack}
        >
          Back
        </Button>
        {activeStep === 1 ? (
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default AddMachineStepper;
