import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  Checkbox,
  Select,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { isManager } from "../utils/auth";
// import { isSuperAdmin } from "../utils/auth";
import {base_URL} from '../utils/api';

const AddMachineStepper = ({
  mode = "add",
  editData = null,
  onClose,
  onMachineCreated,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [editMachine, setEditMachine] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [variant, setVariant] = useState({
    id: null,
    name: "",
    description: "",
    biscuit_type: "",
    models: [
      {
        name: "",
        version: "",
        description: "",
        framework: "",
        model_file: null,
        recommended_threshold: "",
      },
    ],
    activeModelIndex: 0,
  });
  const [modelsByVariant, setModelsByVariant] = useState({});
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [useExistingVariant, setUseExistingVariant] = useState(false);
  const [existingVariants, setExistingVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  
  const [machine, setMachine] = useState({
    name: "",
    camera_serial_numbers: "",
    camera_name: "",
    features_file_path: null,
    frame_height: 720,
    frame_width: 1280,
    acquisition_frame_rate: 0,
    exposure_time: 0,
    trigger_mode: "",
    offset_x: 0,
    offset_y: 0,
    video_folder_path: "",
    watchdog_file_expi_time: "60",
    watchdog_obs_folder_path: "",
  });

  // New state for edit mode variant selection
  const [editingVariantId, setEditingVariantId] = useState("");
  const [machineVariants, setMachineVariants] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [originalModels, setOriginalModels] = useState([]); // <-- ADD THIS STATE
  const isManagerUser = isManager();

  const loadVariantForEdit = async (variantId) => {
      try {
        const res = await fetch(`${base_URL}/api/machinevariants/${variantId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });

        if (!res.ok) throw new Error(await res.text());
        const variantData = await res.json();

        // Load models for this variant
        const modelsRes = await fetch(`${base_URL}/api/mlmodels/?variant=${variantId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });

        const modelsData = await modelsRes.json();

        // Find active model index
        const activeIndex = modelsData.findIndex(model =>
          model.id === variantData.active_ml_model?.id
        );

        setVariant({
          id: variantData.id,
          name: variantData.name,
          description: variantData.description,
          biscuit_type: variantData.biscuit_type,
          models: modelsData,
          activeModelIndex: activeIndex >= 0 ? activeIndex : 0,
        });
        setOriginalModels(JSON.parse(JSON.stringify(modelsData))); // <-- STORE ORIGINAL MODELS

        // Set the selected model ID
        if (variantData.active_ml_model?.id) {
          setSelectedModelId(variantData.active_ml_model.id);
        }
      } catch (error) {
        console.error("❌ Failed to load variant:", error);
      }
    };
  // Handle variant selection change in edit mode
  const handleEditingVariantChange = async (variantId) => {
    setEditingVariantId(variantId);
    await loadVariantForEdit(variantId);
  };

  // Load machine variants when in edit mode
  useEffect(() => {
    if (mode === "edit" && editData?.machine?.variants) {
      setMachineVariants(editData.machine.variants);

      // Set the first variant as default for editing
      if (editData.machine.variants.length > 0) {
        const firstVariant = editData.machine.variants[0];
        setEditingVariantId(firstVariant.id);
        loadVariantForEdit(firstVariant.id);
      }
    }
  }, [mode, editData]);
  // fetch existig variants
  useEffect(() => {
    const fetchExistingVariants = async () => {
      try {
        const res = await fetch(`${base_URL}/api/machinevariants/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await res.json();
        console.log("Fetched existing variants:", data);
        setExistingVariants(data);
      } catch (err) {
        console.error("Failed to load existing variants", err);
      }
    };

    fetchExistingVariants();
  }, []);

  useEffect(() => {
    if (mode === "edit" && editData) {
      const m = editData.machine;

      setMachine({
        name: m.name || "",
        camera_serial_numbers: m.camera?.serial_number || "",
        camera_name: m.camera?.name || "",
        features_file_path: null,
        frame_height: m.camera?.frame_height || 720,
        frame_width: m.camera?.frame_width || 1280,
        acquisition_frame_rate: m.camera?.acquisition_frame_rate || 0,
        exposure_time: m.camera?.exposure_time || 0,
        trigger_mode: m.camera?.trigger_mode || "",
        offset_x: m.camera?.offset_x || 0,
        offset_y: m.camera?.offset_y || 0,
        video_folder_path: m.video_folder_path || "",
        watchdog_file_expi_time: m.watchdog_file_expi_time || "60",
        watchdog_obs_folder_path: m.base_dir_path || "",
      });

      const v = (m.variants && m.variants[0]) || null;
      if (v?.id) {
        setSelectedVariantId(v.id);

        // ✅ If this machine was created using an existing variant
        if (m.created_using_existing_variant) {
          setUseExistingVariant(true); // check the box
        }

        loadVariantForEdit(v.id); // load variant + models as usual
      }

      setActiveStep(0);
    }
  }, [mode, editData]);

  // const handleMLChange = (e) => {
  //   const { name, value, type, checked, files } = e.target;
  //   setMlModel((prev) => ({
  //     ...prev,
  //     [name]:
  //       type === "file" ? files[0] : type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleModelChange = (e, idx) => {
    const { name, value, files, type } = e.target;
    setVariant((prev) => {
      const models = [...prev.models];
      models[idx] = {
        ...models[idx],
        [name]: type === "file" ? files[0] : value,
      };
      return { ...prev, models };
    });
  };

  // Add a new empty model row
  const addModel = () => {
    setVariant((prev) => ({
      ...prev,
      models: [
        ...prev.models,
        {
          name: "",
          version: "",
          description: "",
          framework: "",
          model_file: null,
          // No ID for new models - this indicates they need to be created
          recommended_threshold: "",
        },
      ],
    }));
  };


  // Toggle "Use Existing Variant" and reset local variant state
  const onToggleUseExisting = () => {
    setUseExistingVariant((prev) => {
      const newVal = !prev; // new state after toggle

      if (mode === "add") {
        // Reset variant only in add mode
        if (!newVal) {
          // turning OFF → restore empty variant
          setVariant({
            name: "",
            description: "",
            biscuit_type: "",
            models: [
              {
                name: "",
                version: "",
                description: "",
                framework: "",
                model_file: null,
                recommended_threshold: "",
              },
            ],
            activeModelIndex: 0,
          });
          setSelectedVariantId("");
        } else {
          setSelectedVariantId(""); // just clear selection when turning ON
        }
      } else if (mode === "edit" && editData?.machine) {
        const originalVariant =
          (editData.machine.variants && editData.machine.variants[0]) || null;
        if (!newVal && originalVariant?.id) {
          // Only restore when unchecking
          loadVariantForEdit(originalVariant.id);
          setSelectedVariantId(originalVariant.id);
        } else if (newVal) {
          // When checking "Use Existing", clear variant fields
          setVariant({
            name: "",
            description: "",
            biscuit_type: "",
            models: [
              {
                name: "",
                version: "",
                description: "",
                framework: "",
                model_file: null,
                recommended_threshold: "",
              },
            ],
            activeModelIndex: 0,
          });
          setSelectedVariantId("");
        }
      }

      return newVal;
    });
  };

  const handleMachineChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setMachine((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  // machine creation function
  const handleCreate = async () => {
    let cameraId = null;
    // if (useExistingVariant && selectedVariantId && !selectedModelId) {
    //   alert("Please select an active model for the variant.");
    //   return;
    // }
    try {
      console.log("🚀 Starting machine creation...");
      console.log("Machine data: ", machine);
      console.log("Variant data: ", variant);
      console.log(
        "Use existing variant:",
        useExistingVariant,
        "Selected variant ID:",
        selectedVariantId
      );

      // Validation check for new variant and model
      if (!useExistingVariant) {
        if (!variant.name || !variant.biscuit_type) {
          alert("When creating a new variant, please provide a Variant Name and Biscuit Type.");
          return;
        }
        const hasValidModel = variant.models.some(m => m.name && m.version && m.model_file);
        if (!hasValidModel) {
          alert("Please provide a Model Name, Version, and upload a Model File for the new variant.");
          return;
        }
      } else if (!selectedVariantId) {
        alert("Please select an existing variant or create a new one.");
        return;
      }
      // 1) Create Camera
      console.log("📸 Creating camera...");
      const camFormData = new FormData();
      camFormData.append("is_active", true);
      camFormData.append("name", `${machine.name}-cam`);
      camFormData.append("serial_number", machine.camera_serial_numbers);
      camFormData.append("description", "Auto-generated camera");
      if (machine.features_file_path instanceof File) {
        camFormData.append("features_file_path", machine.features_file_path);
      }
      camFormData.append("frame_height", machine.frame_height);
      camFormData.append("frame_width", machine.frame_width);
      camFormData.append(
        "acquisition_frame_rate",
        machine.acquisition_frame_rate
      );
      camFormData.append("exposure_time", machine.exposure_time);
      camFormData.append("trigger_mode", machine.trigger_mode);
      camFormData.append("offset_x", machine.offset_x);
      camFormData.append("offset_y", machine.offset_y);
      camFormData.append("max_failed_frames", 5);
      camFormData.append("check_max_failed_frames", true);

      const camRes = await fetch(`${base_URL}/api/cameras/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: camFormData,
      });

      if (!camRes.ok) {
          // Log the response object before the body is read
          console.log(camRes);
          const errText = await camRes.text();
          try {
              // Attempt to parse the text as JSON
              const errObj = JSON.parse(errText);
              console.error("❌ Camera creation failed. Response:", errObj.serial_number[0]);
              alert("❌ Camera creation failed: " + JSON.stringify(errObj.serial_number[0], null, 2)); // Use stringify for a readable alert
          } catch (e) {
              // If parsing fails, it's not a valid JSON string. Log the raw text.
              console.error("❌ Camera creation failed. Response (not JSON):", errText);
              alert("❌ Camera creation failed: " + errText);
          }
          return;
      }

      const camData = await camRes.json();
      cameraId = camData.id;
      console.log("✅ Camera created:", camData);

      // 2) Variant + Models
      let variantId = null;

      if (useExistingVariant && selectedVariantId) {
        variantId =
          typeof selectedVariantId === "object"
            ? String(selectedVariantId.id)
            : String(selectedVariantId);
        console.log("🔗 Using existing variant:", variantId);

        // Prefill variant + models in state before saving
        await loadVariantForEdit(variantId);
      } else if (variant.name && variant.models && variant.models.length > 0) {
        console.log("🆕 Creating new Variant...");

        // Step 2a: Create Variant
        const variantPayload = {
          name: variant.name,
          description: variant.description || "",
          biscuit_type: variant.biscuit_type || "",
          model_threshold: 0.5,
          model_verbose: true,
        };

        const varRes = await fetch(
          `${base_URL}/api/machinevariants/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(variantPayload),
          }
        );

        if (!varRes.ok) {
          const errText = await varRes.text();
          throw new Error("❌ Variant creation failed: " + errText);
        }

        const varData = await varRes.json();
        // variantId = String(varData.id || varData.uuid || null);
        console.log("✅ Variant created:", varData);

        // Fetch the variant ID by name immediately after creation
        const variantsRes = await fetch(
          `${base_URL}/api/machinevariants/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const variantsList = await variantsRes.json();
        console.log("📋 Variants list: ", variantsList);
        const createdVariant = variantsList.find(
          (v) => v.name === variant.name
        );

        if (!createdVariant)
          throw new Error("❌ Could not find created variant by name");
        variantId = createdVariant.id || createdVariant.uuid;
        console.log("🔗 Fetched variant ID:", variantId);

        // Step 2b: Create ML models linked to this Variant
        const createdModels = [];
        for (let i = 0; i < variant.models.length; i++) {
          const m = variant.models[i];

          console.log("📦 Preparing model for POST:", m);

          if (!m.name || !m.version || !m.model_file) {
            console.warn("⚠️ Skipping model due to missing fields:", m);
            continue;
          }

          const mlFormData = new FormData();
          mlFormData.append("name", m.name);
          mlFormData.append("version", m.version);
          mlFormData.append("description", m.description || "");
          mlFormData.append(
            "recommended_threshold",
            m.recommended_threshold || 0
          );
          mlFormData.append("model_file", m.model_file);
          mlFormData.append("variant", variantId);
          mlFormData.append("is_active", true);

          console.log("📤 Sending ML Model POST →", [...mlFormData.entries()]);

          // ⚠️ do NOT send variant here (backend PATCH handles linking)
          const mlRes = await fetch(`${base_URL}/api/mlmodels/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: mlFormData,
          });

          const resText = await mlRes.text();
          console.log("📥 ML Model raw response:", resText);

          if (!mlRes.ok) {
            throw new Error("❌ ML model creation failed: " + resText);
          } else {
            const mlData = await JSON.parse(resText);
            createdModels.push(mlData);
            console.log("✅ ML model created:", mlData);
          }
        }
        // Step 2c: Set active model for Variant
        if (useExistingVariant && selectedVariantId && selectedModelId) {
          console.log("🔄 Setting active model for existing variant:", selectedModelId);
          
          const activeRes = await fetch(
            `${base_URL}/api/machinevariants/${selectedVariantId}/set_active_model/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: JSON.stringify({
                model_id: selectedModelId,
              }),
            }
          );

          if (!activeRes.ok) {
            const errText = await activeRes.text();
            console.error("❌ Failed to set active model:", errText);
            // Don't throw error here - the machine is already created
          } else {
            console.log("✅ Active model set for variant:", activeData);
          }
        }
      }

      // 3) Create Machine
      console.log("🏭 Creating machine...");
      const machinePayload = {
        is_active: true,
        name: machine.name,
        description: "Machine created via form",
        // cameras: cameraId,
        video_stream: true,
        video_folder_path: machine.video_folder_path,
        watchdog_file_expi_time: machine.watchdog_file_expi_time,
        base_dir_path: machine.watchdog_obs_folder_path,
        variant_ids: variantId ? [variantId] : [],
        active_variant_id: variantId || null,
      };

      const machineRes = await fetch(`${base_URL}/api/machines/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(machinePayload),
      });

      if (!machineRes.ok) {
        const errText = await machineRes.text();
        throw new Error("❌ Machine creation failed: " + errText);
      }

      let machineData = await machineRes.json();
      console.log("✅ Machine created:", machineData);

      // 4) PATCH machine to link camera
      if (cameraId) {
        const patchRes = await fetch(
          `${base_URL}/api/machines/${machineData.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({ camera_id: cameraId }),
          }
        );

        if (!patchRes.ok) throw new Error("❌ Failed to link camera");
        const patchedMachine = await patchRes.json();
        console.log("✅ Camera linked to machine:", patchedMachine);

        machineData = patchedMachine;
      }

      if (onMachineCreated) onMachineCreated();

      let msgA = "";
      if (useExistingVariant && selectedVariantId) {
        msgA = "✅ Machine created (linked to existing Variant).";
      } else if (variantId) {
        msgA = "✅ Machine, Variant and Models created.";
      } else {
        msgA = "✅ Machine and Camera created.";
      }

      alert(msgA);
      if (onClose) onClose();
    } catch (error) {
      console.error("❌ Error in submission:", error);

      // Cleanup orphan camera if machine creation fails
      if (cameraId) {
        console.warn("🧹 Cleaning up orphan camera:", cameraId);
        await fetch(`${base_URL}/api/cameras/${cameraId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        console.warn("🧹 Deleted orphan camera:", cameraId);
      }

      alert(error.message || "Failed to create machine");
    }
  };

  // ✅ NEW: Separate function to create ML models and return their IDs
  const createNewMLModels = async (variantId, token) => {
    let updatedModels = [...variant.models];
    let modelsChanged = false;

    for (let i = 0; i < variant.models.length; i++) {
      const model = variant.models[i];
      
      // Check if this is a NEW model (no ID) that has required fields
      if (!model.id && model.name && model.version && model.model_file) {
        console.log(`🆕 Creating new ML Model: ${model.name} v${model.version}`);
        
        const mlFormData = new FormData();
        mlFormData.append("name", model.name);
        mlFormData.append("version", model.version);
        mlFormData.append("description", model.description || "");
        mlFormData.append("recommended_threshold", model.recommended_threshold || 0);
        mlFormData.append("model_file", model.model_file);
        mlFormData.append("is_active", true);
        
        // If we have a variant ID, link the model to it
        if (variantId) {
          mlFormData.append("variant", variantId);
        }

        const mlRes = await fetch(`${base_URL}/api/mlmodels/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: mlFormData,
        });

        if (mlRes.ok) {
          const mlData = await mlRes.json();
          console.log("✅ New ML Model created:", mlData);
          updatedModels[i] = { ...updatedModels[i], id: mlData.id };
          modelsChanged = true;
        } else {
          const errorText = await mlRes.text();
          console.error("❌ New ML Model creation failed:", errorText);
          throw new Error(`Failed to create ML Model: ${errorText}`);
        }
      }
    }
    return { modelsChanged, updatedModels };
  };

  // handleEditSubmit function - Updated ML Model File Update Section
  const handleEditSubmit = async () => {
    console.log("🚀 handleEditSubmit triggered");

    const token = localStorage.getItem("access_token");
    const isManager = localStorage.getItem("designation") === "manager";
    const machineId = editData?.machine?.id;
    const cameraId = editData?.machine?.camera?.id;
    let variantId = editingVariantId || editData?.machine?.variants?.[0]?.id || null;

    const mlModel =
      !useExistingVariant && variant.models?.length > 0
        ? variant.models[variant.activeModelIndex]
        : editData?.mlModel || {};
        
    const currentActiveMlModelInState = variant.models[variant.activeModelIndex];

    console.log("🔹 Current active ML model in state:", currentActiveMlModelInState);
    // const variants = !useExistingVariant && variant.name ? [variant] : [];
    const variants =
      useExistingVariant && editData?.selectedVariantId
        ? [{ id: editData.selectedVariantId }]
        : !useExistingVariant && variant.name
          ? [{ ...variant, models: variant.models }]
          : [];

    try {
      // ✅ DEFINE the setActiveModelSafely function at the top of the try block
      const setActiveModelSafely = async (variantId, mlModelId, token) => {
        console.log("🔹 Setting active model - Variant:", variantId, "ML Model:", mlModelId);
        
        try {
          // 1. Verify ML model exists and is active
          const verifyResponse = await fetch(`${base_URL}/api/mlmodels/${mlModelId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (!verifyResponse.ok) {
            throw new Error(`ML Model ${mlModelId} not found (HTTP ${verifyResponse.status})`);
          }
          
          const mlModel = await verifyResponse.json();
          console.log("🔹 ML Model details:", mlModel);
          
          // 2. Reactivate if necessary
          if (!mlModel.is_active) {
            console.log("🔄 Reactivating inactive ML model...");
            const activateResponse = await fetch(`${base_URL}/api/mlmodels/${mlModelId}/`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ is_active: true }),
            });
            
            if (!activateResponse.ok) {
              throw new Error("Failed to reactivate ML Model");
            }
            console.log("✅ ML Model reactivated");
          }
          
          // 3. Set as active model
          console.log("🔹 Calling set_active_model API...");
          const response = await fetch(`${base_URL}/api/machinevariants/${variantId}/set_active_model/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ model_id: mlModelId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ set_active_model API error:", errorData);
            throw new Error(errorData.detail || `Failed to set active model (HTTP ${response.status})`);
          }

          console.log("✅ Active model set successfully! for variant:", variantId,"! with response:", response);
          return true;
          
        } catch (error) {
          console.error("❌ Failed to set active model:", error);
          throw error;
        }
      };

      // 1️⃣ Update Camera
      const camPayload = isManager
        ? {
            frame_height: machine.frame_height,
            frame_width: machine.frame_width,
            acquisition_frame_rate: machine.acquisition_frame_rate,
            exposure_time: machine.exposure_time,
            trigger_mode: machine.trigger_mode,
            offset_x: machine.offset_x,
            offset_y: machine.offset_y,
          }
        : {
            name: machine.camera_name,
            serial_number: machine.camera_serial_numbers,
            frame_height: machine.frame_height,
            frame_width: machine.frame_width,
            acquisition_frame_rate: machine.acquisition_frame_rate,
            exposure_time: machine.exposure_time,
            trigger_mode: machine.trigger_mode,
            offset_x: machine.offset_x,
            offset_y: machine.offset_y,
          };

      const cameraEndpoint = isManager
        ? `${base_URL}/api/cameras/${cameraId}/manager_update/`
        : `${base_URL}/api/cameras/${cameraId}/`;

      const camRes = await fetch(cameraEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(camPayload),
      });

      console.log("Camera update response:", camRes.status);

      // 2️⃣ Update Machine (non-manager)
      if (!isManager) {
        const machinePayload = {
          name: machine.name,
          description: "Updated via Edit",
          video_stream: true,
          video_folder_path: machine.video_folder_path,
          watchdog_file_expi_time: machine.watchdog_file_expi_time,
          base_dir_path: machine.watchdog_obs_folder_path,
        };

        const machineRes = await fetch(
          `${base_URL}/api/machines/${machineId}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(machinePayload),
          }
        );

        console.log("Machine update response:", machineRes.status);
      }

      // 3️⃣ UPDATED: Handle ML Model Updates with File Replacement
      let currentModels = variant.models;
      
 // In your handleEditSubmit function, before the model update loops:
      const activeModelIndex = variant.activeModelIndex;
      const activeModel = variant.models[activeModelIndex];

      const modelsWithNewFiles = currentModels.filter(model => 
        model.model_file instanceof File && 
        model.id && 
        model.id === activeModel.id  // Only active model
      );

      console.log("🔹 Models with new files to update:", modelsWithNewFiles);

      // Update models with new files using PUT request
      for (const model of modelsWithNewFiles) {
        console.log(`🔄 Updating ML Model ${model.id} with new file:`, model.model_file.name);
        
        const formData = new FormData();
        
        // Include ALL required fields for PUT
        formData.append('name', model.name);
        formData.append('version', model.version);
        formData.append('description', model.description || '');
        formData.append('recommended_threshold', model.recommended_threshold || 0.5);
        formData.append('is_active', true);
        formData.append('model_file', model.model_file); // The new .pt file
        
        console.log("🔹 PUT request form data:", {
          name: model.name,
          version: model.version,
          description: model.description,
          recommended_threshold: model.recommended_threshold,
          model_file: model.model_file.name
        });

        const mlModelUpdateResponse = await fetch(`${base_URL}/api/mlmodels/${model.id}/`, {
          method: "PUT", // Use PUT to replace entire model
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type for FormData - browser will set it with boundary
          },
          body: formData,
        });

        if (!mlModelUpdateResponse.ok) {
          const errorText = await mlModelUpdateResponse.text();
          console.error("❌ ML Model file update failed:", errorText);
          
          // Try to parse error for better message
          try {
            const errorData = JSON.parse(errorText);
            alert(`❌ Failed to update model file: ${JSON.stringify(errorData, null, 2)}`);
          } catch {
            alert(`❌ Failed to update model file: ${errorText}`);
          }
          return; // Stop execution if file update fails
        }

        const updatedModel = await mlModelUpdateResponse.json();
        console.log("✅ ML Model file updated successfully:", updatedModel);
        
        // Update the model in our state with the response data
        const modelIndex = currentModels.findIndex(m => m.id === model.id);
        if (modelIndex !== -1) {
          currentModels[modelIndex] = { 
            ...currentModels[modelIndex], 
            ...updatedModel,
            model_file: updatedModel.model_file // Use the file info from response
          };
        }
      }

      // For field changes, you might want to allow all models
      const modelsWithFieldChanges = currentModels.filter(model => {
        if (!model.id) return false; // Skip new models (handled separately)
        
        const originalModel = originalModels.find(om => om.id === model.id);
        return originalModel && (
          model.name !== originalModel.name ||
          model.version !== originalModel.version ||
          model.description !== originalModel.description ||
          // Use String comparison for threshold to avoid type issues (e.g., "0.5" vs 0.5)
          String(model.recommended_threshold) !== String(originalModel.recommended_threshold)

        );
      });

      console.log("🔹 Models with field changes:", modelsWithFieldChanges);

      for (const model of modelsWithFieldChanges) {
        // Skip if this model was already updated with a file
        if (modelsWithNewFiles.some(m => m.id === model.id)) {
          continue;
        }

        console.log(`🔹 Updating ML Model ${model.id} fields only`);
        
        const mlModelUpdateResponse = await fetch(`${base_URL}/api/mlmodels/${model.id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: model.name,
            version: model.version,
            description: model.description,
            recommended_threshold: model.recommended_threshold
          }),
        });

        if (!mlModelUpdateResponse.ok) {
          const errorData = await mlModelUpdateResponse.json();
          console.error("❌ ML Model field update failed:", errorData);
          alert(`❌ Failed to update model fields: ${JSON.stringify(errorData, null, 2)}`);
          return;
        }

        console.log("✅ ML Model fields updated successfully");
      }

      // ✅ Handle creating new ML models
      if (!useExistingVariant && variant.models && variant.models.length > 0) {
        const { modelsChanged, updatedModels } = await createNewMLModels(variantId, token);
        if (modelsChanged) {
          currentModels = updatedModels;
        }
      }

      // ✅ Set active model
      if (useExistingVariant && selectedVariantId && selectedModelId) {
        await setActiveModelSafely(selectedVariantId, selectedModelId, token);
      } else if (variantId && currentModels[variant.activeModelIndex]?.id) {
        await setActiveModelSafely(
          variantId, 
          currentModels[variant.activeModelIndex].id, 
          token
        );
      }

      // 4️⃣ Update existing variants or create new ones
      for (const variant of variants) {
        const variantPayload = {
          name: variant.name,
          description: variant.description,
          biscuit_type: variant.biscuit_type,
        };

        if (variant.id) {
          // PATCH existing variant
          const res = await fetch(
            `${base_URL}/api/machinevariants/${variant.id}/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(variantPayload),
            }
          );

          if (res.ok) {
            const updatedVariant = await res.json();
            setVariant((prev) => ({ ...prev, ...updatedVariant }));
          } else {
            const errorData = await res.json().catch(() => null);
            const errorMsg =
              errorData && typeof errorData === "object"
                ? JSON.stringify(errorData)
                : await res.text();
            console.warn("❌ Variant update failed:", errorMsg);
            alert(`❌ Variant update failed: ${errorMsg}`);
            return; // stop further execution
          }
        } else {
          // POST new variant
          const variantPayload = {
            name: variant.name,
            description: variant.description || "",
            biscuit_type: variant.biscuit_type || "",
            active_ml_model: null,     // will link later
            model_threshold: 0.5,      // default
            model_verbose: true,       // default
            variant_config_file: null, // optional
          };
          
          console.log("➡️ Creating new Variant:", variantPayload);

          const res = await fetch(
            `${base_URL}/api/machinevariants/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(variantPayload),
            }
          );

          if (res.ok) {

            const newVariant = await res.json();
            
            if (!newVariant.id) {
              console.error("❌ Variant created but no ID returned:", newVariant);
              alert("❌ Variant creation failed: Backend did not return an ID");
              return;
            }

            variantId = newVariant.id;
            console.log("✅ Variant created with ID:", variantId);

            // ✅ Patch machine to include this new variant
            const existingVariantIds = editData?.machine?.variants?.map(v => v.id) || [];
            const allVariantIds = [...existingVariantIds, variantId];

            const linkRes = await fetch(
              `${base_URL}/api/machines/${machineId}/`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  variant_ids: [variantId],
                  // variant_ids: allVariantIds,
                  active_variant_id: variantId,
                }),
              }
            );

            console.log("Machine link response:", linkRes.status);

            if (!linkRes.ok) {
              const err = await linkRes.text();
              console.error("❌ Linking variant to machine failed:", err);
              alert(`❌ Failed to link new variant: ${err}`);
              return;
            }

            console.log("✅ Variant linked to machine successfully");

            // ✅ Now create ML models for this new variant
            const createdModels = [];
            if (variant.models && variant.models.length > 0) {
              for (const m of variant.models) {
                if (!m.name || !m.version || !m.model_file) {
                  console.warn("⚠️ Skipping invalid model:", m);
                  continue;
                }

                const mlFormData = new FormData();
                mlFormData.append("name", m.name);
                mlFormData.append("version", m.version);
                mlFormData.append("description", m.description || "");
                mlFormData.append(
                  "recommended_threshold",
                  m.recommended_threshold || 0
                );
                mlFormData.append("model_file", m.model_file);
                mlFormData.append("variant", variantId);
                mlFormData.append("is_active", true);

                const mlRes = await fetch(
                  `${base_URL}/api/mlmodels/`,
                  {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: mlFormData,
                  }
                );

                const resText = await mlRes.text();
                if (mlRes.ok) {
                  const mlData = JSON.parse(resText);
                  createdModels.push(mlData);
                  console.log("✅ ML model created:", mlData);
                } else {
                  console.error("❌ ML model creation failed:", resText);
                }
              }
            }

            // ✅ If we created models, set the active one
            if (
              createdModels.length > 0 &&
              variant.activeModelIndex !== undefined
            ) {
              const activeModel = createdModels[variant.activeModelIndex];
              if (activeModel) {
                await fetch(
                  `${base_URL}/api/machinevariants/${variantId}/set_active_model/`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      model_id: activeModel.id,
                      is_active: true,
                    }),
                  }
                );
                console.log(
                  "✅ Active model set for new variant:",
                  activeModel
                );
              }
            }
          } else {
            const errorText = await res.text();
            console.warn("❌ Variant creation failed:", errorText);
            alert(`❌ Variant creation failed: ${errorText}`);
            return;
          }
        }
      }

      // 4.5 Handle adding an existing variant to the machine
      if (useExistingVariant && selectedVariantId) {
        const isVariantAlreadyAdded = editData?.machine?.variants?.some(v => String(v.id) === String(selectedVariantId));

        if (!isVariantAlreadyAdded) {
          console.log(`➕ Adding existing variant ${selectedVariantId} to machine ${machineId}`);
          const addVariantRes = await fetch(`${base_URL}/api/machines/${machineId}/add_variant/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ variant_id: selectedVariantId }),
          });

          if (!addVariantRes.ok) {
            const errorText = await addVariantRes.text();
            console.error('❌ Failed to add variant to machine:', errorText);
            alert(`Failed to add existing variant to machine: ${errorText}`);
            // We don't necessarily want to stop the whole edit process here, so we'll just log it.
          } else {
            console.log('✅ Successfully added variant to machine.');
          }
        } else {
          console.log('ℹ️ Variant is already associated with the machine, skipping add.');
        }
      }

      alert("✅ Machine updated successfully!");
      if (onMachineCreated) onMachineCreated();
      if (onClose) onClose();
    } catch (error) {
      console.error("❌ Error updating machine:", error);
      alert(`❌ Failed to update machine: ${error.message}`);
    }
  };
    const handleActiveModelChange = (modelId, idx) => {
      setSelectedModelId(modelId);

      setVariant(prev => ({
        ...prev,
        activeModelIndex: idx
      }));
    };

  // model and variant form
const renderStepOne = () => (
  <Box p={1}>
    <Typography variant="h5" gutterBottom sx={{ fontWeight: "700" }}>
      ML Model & Variant
    </Typography>
    
    {/* Use Existing Variant Toggle */}
    <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'action.hover' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={useExistingVariant}
            onChange={onToggleUseExisting}
          />
        }
        label="Add/Select Existing Variant to Machine"
      />
    </Paper>

    {/* Existing variant dropdown */}
    {useExistingVariant && (
      <FormControl fullWidth>
        <InputLabel>Select Existing Variant</InputLabel>
        <Select
          value={selectedVariantId}
          onChange={(e) => setSelectedVariantId(String(e.target.value))}
          label="Select Existing Variant"
        >
          {existingVariants.map((v) => (
            <MenuItem key={v.id} value={String(v.id)}>
              {v.name} (Model: {v.active_ml_model?.name || "N/A"})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}

    {/* Variant creation form */}
    {!useExistingVariant && !isManagerUser && (
      <>
        {/* Variant Selection Dropdown for Edit Mode */}
        {mode === "edit" && machineVariants.length > 0 && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#007a91ff", fontWeight: "bold" }}>
              Select Variant to Edit
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Choose Variant</InputLabel>
              <Select
                value={editingVariantId}
                onChange={(e) => handleEditingVariantChange(e.target.value)}
                label="Choose Variant"
              >
                {machineVariants.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name} ({v.biscuit_type}) - Active Model: {v.active_ml_model?.name || "N/A"}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Select which variant you want to edit. You can edit one variant at a time.
              </FormHelperText>
            </FormControl>
          </Paper>
        )}
        <Divider sx={{ my: 2 , border:'2px solid #062249'}} />
        <Typography variant="h5" gutterBottom sx={{ color: '#062249', fontWeight: "bold", mb: 2}}>
          {mode === "edit" && editingVariantId ? "Edit Variant" : "Create New Variant"}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Variant Name"
              value={variant.name}
              onChange={(e) =>
                setVariant((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Biscuit Type"
              value={variant.biscuit_type || ""}
              onChange={(e) =>
                setVariant((prev) => ({
                  ...prev,
                  biscuit_type: e.target.value,
                }))
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Description"
              value={variant.description}
              onChange={(e) =>
                setVariant((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Grid>
        </Grid>
      </>
    )}

    {/* ML Models Section */}
    {!useExistingVariant && (mode === 'add' ? variant.models.length > 0 : true) && (
      <>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
          <Typography variant="h5" sx={{ color: "#007a91ff", fontWeight: "bold" }}>
            ML Models {mode === "edit" && editingVariantId && `- ${variant.name}`}
          </Typography>
          
          {/* Add new model button moved to top */}
          {!isManagerUser && !useExistingVariant && (
            <Button 
              onClick={addModel} 
              variant="contained" 
              startIcon={<span>+</span>}
              size="small"
              sx={{
                bgcolor: "#062249",
                fontWeight: "bold",
                color: "white",
                '&:hover': { bgcolor: "#083068ff" },
                px: 2
              }}
            >
              Add Model
            </Button>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {variant.models.length} model(s) configured. Each model represents a different version or configuration.<br/>
          <span style={{ color: 'green' }}>To update the "Model file", the ML Model must be Set as ACTIVE first.</span>
        </Typography>

        {variant.models.map((model, idx) => (
          <Paper 
            variant="outlined" 
            sx={{
              p: 3, 
              mb: 3,
              position: 'relative',
              bgcolor: variant.activeModelIndex === idx ? '#f3fcffff' : '#fafafa',
              border: variant.activeModelIndex === idx ? '3px solid #0094b1ff' : '2px solid #c4c4c4ff',
              borderLeft: !model.id ? '4px solid #4CAF50' : undefined,
              '&:hover': {
                boxShadow: 5,
                borderColor: variant.activeModelIndex === idx ? '#0094b1ff' : '#bdbdbd'
              }
            }} 
            key={idx}
          >
            {/* Model Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h7" component="h3" sx={{ fontWeight: 600 }}>
                  {model.name || `Model ${idx + 1}`}
                  {model.version && ` v${model.version}`}
                </Typography>
                {model.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {model.description}
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* New Model Badge */}
                {!model.id && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      bgcolor: '#4CAF50', 
                      color: 'white', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      fontWeight: 'bold'
                    }}
                  >
                    NEW
                  </Typography>
                )}
                
                {/* Active Model Badge */}
                {(useExistingVariant ? selectedModelId === model.id : variant.activeModelIndex === idx) && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      bgcolor: '#006d83ff', 
                      color: 'white', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      fontWeight: 'bold'
                    }}
                  >
                    ACTIVE
                  </Typography>
                )}
              </Box>
            </Box>

            <Grid container spacing={3}>
              {!isManagerUser && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Model Name"
                      fullWidth
                      name="name"
                      value={model.name}
                      onChange={(e) => handleModelChange(e, idx)}
                      placeholder="Enter model name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Version"
                      fullWidth
                      name="version"
                      value={model.version}
                      onChange={(e) => handleModelChange(e, idx)}
                      placeholder="e.g., 1.0.0"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={2}
                      name="description"
                      value={model.description}
                      onChange={(e) => handleModelChange(e, idx)}
                      placeholder="Describe this model version..."
                    />
                  </Grid>

                  {!useExistingVariant && mode === "edit" && (
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#990000", fontStyle: "italic" }}
                      >
                        <b>Note:</b> On update, the existing model file will be replaced!
                      </Typography>
                    </Grid>
                  )}

                  {!useExistingVariant && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button 
                          variant="outlined" 
                          component="label" 
                          sx={{
                            bgcolor: "#062249",
                            color: "white",
                            '&:hover': { bgcolor: "#083068ff" }
                          }}
                        >
                          {model.model_file ? 'Change Model File' : 'Upload Model File'}
                          <input
                            type="file"
                            hidden
                            name="model_file"
                            onChange={(e) => handleModelChange(e, idx)}
                          />
                        </Button>
                        {model.model_file && (
                          <Typography variant="body1" sx={{ color: 'green', fontWeight: 500 }}>
                            <b>✓</b>{' '}
                            {typeof model.model_file === 'string'
                              ? model.model_file.split('/').pop()
                              : model.model_file.name}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  )}
                </>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Recommended Threshold"
                  fullWidth
                  name="recommended_threshold"
                  value={model.recommended_threshold ?? ""}
                  onChange={(e) => handleModelChange(e, idx)}
                  placeholder="0.0 - 1.0"
                />
              </Grid>

              {/* Active model selector */}
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={
                        useExistingVariant 
                          ? selectedModelId === model.id
                          : variant.activeModelIndex === idx
                      }
                      onChange={() => handleActiveModelChange(model.id, idx)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Set as Active Model
                    </Typography>
                  }
                />
              </Grid>
            </Grid>

            {/* Model Index Indicator */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pt: 1, borderTop: '2px dashed #ccc' }}>
              <Typography variant="caption" color="text.secondary">
                Model {idx + 1} of {variant.models.length}
              </Typography>
            </Box>
          </Paper>
        ))}

        {/* Bottom Add Model Button (alternative placement) */}
        {!isManagerUser && !useExistingVariant && variant.models.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button 
              onClick={addModel} 
              variant="outlined" 
              startIcon={<span>+</span>}
              fullWidth
              sx={{ minWidth: 200, bgcolor: "#062249", color: "white", fontWeight: 700, '&:hover': { bgcolor: "#083068ff"} }}
            >
              Add Another Model
            </Button>
          </Box>
        )}
      </>
    )}
  </Box>
);

  // machine and camera form
  const renderStepTwo = () => (
    <Box p={1}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight:"700"}}>Machine & Camera</Typography>
      <Typography variant="h6" sx={{ mt: 1, mb: 2, color:"#007a91ff", fontWeight:"bold"}}>Machine Details</Typography>
      <Grid container spacing={2}>
        {!isManagerUser && (
          <>
            
            <Grid item xs={6}>
              <TextField
                label="Machine Name"
                name="name"
                fullWidth
                value={machine.name}
                onChange={handleMachineChange}
                // disabled={isManager}
              />
            </Grid>
            <Grid item xs={6} /> 
            {/* Empty grid item for spacing */}

            <Grid item xs={12}>
              <TextField
                label="Video Folder Path"
                name="video_folder_path"
                fullWidth
                value={machine.video_folder_path}
                onChange={handleMachineChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Watchdog OBS Folder Path"
                name="watchdog_obs_folder_path"
                fullWidth
                value={machine.watchdog_obs_folder_path}
                onChange={handleMachineChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Camera Serial Number"
                name="camera_serial_numbers"
                fullWidth
                value={machine.camera_serial_numbers}
                onChange={handleMachineChange}
                // disabled={isManager}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Watchdog File Expiry Time (in seconds)"
                name="watchdog_file_expi_time"
                fullWidth
                value={machine.watchdog_file_expi_time}
                onChange={handleMachineChange}
              />
            </Grid>
          </>
        )}
        </Grid>
        <Divider sx={{ mt: 3, mb: 2}} />
        <Typography variant="h6" sx={{ mb: 2, color:"#007a91ff", fontWeight:"bold"}}>Camera Settings</Typography>
        <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Camera Name"
                name="camera_name"
                fullWidth
                value={machine.camera_name}
                onChange={handleMachineChange}
                disabled={isManagerUser}
              />
            </Grid>
            <Grid item xs={6} />
            {mode === "edit" && (
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: "orange", fontStyle: "italic" }}
                >
                  ⚠️ Leave features file empty to keep the existing one.
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button fullWidth variant="outlined" component="label" sx={{bgcolor:"#062249",color:"white",'&:hover': {bgcolor: "#083068ff"}}}>
                Upload Features File
                <input
                  type="file"
                  hidden
                  name="features_file_path"
                  onChange={handleMachineChange}
                />
              </Button>
            </Grid>

        {/* Camera hardware settings */}
        <Grid item xs={6}>
          <TextField
            label="Frame Height"
            name="frame_height"
            fullWidth
            value={machine.frame_height}
            onChange={handleMachineChange}
            disabled={isManagerUser && mode === 'edit'}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Frame Width"
            name="frame_width"
            fullWidth
            value={machine.frame_width}
            onChange={handleMachineChange}
            disabled={isManagerUser && mode === 'edit'}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Offset X"
            name="offset_x"
            fullWidth
            value={machine.offset_x}
            onChange={handleMachineChange}
            disabled={isManagerUser && mode === 'edit'}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Offset Y"
            name="offset_y"
            fullWidth
            value={machine.offset_y}
            onChange={handleMachineChange}
            disabled={isManagerUser && mode === 'edit'}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Exposure Time"
            name="exposure_time"
            fullWidth
            value={machine.exposure_time}
            onChange={handleMachineChange}
            disabled={isManagerUser && mode === 'edit'}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Acquisition Frame Rate"
            name="acquisition_frame_rate"
            fullWidth
            value={machine.acquisition_frame_rate}
            onChange={handleMachineChange}
            disabled={isManagerUser && mode === 'edit'}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Trigger Mode"
            name="trigger_mode"
            fullWidth
            value={machine.trigger_mode}
            onChange={handleMachineChange}
            disabled={isManagerUser && mode === 'edit'}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const hasExistingModelOrVariants =
    mode === "edit" && (!!variant.name || (variant.models?.length || 0) > 0);
  // (!!mlModel.name || !!mlModel.version || variants.length > 0);
  // console.log(variant);
  return (
    <>
      <Paper elevation={4} sx={{ p: 3 }}>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>ML Model + Variants</StepLabel>
          </Step>
          <Step>
            <StepLabel>Machine + Camera</StepLabel>
          </Step>
        </Stepper>

        <Box mt={4}>{activeStep === 0 ? renderStepOne() : renderStepTwo()}</Box>

        {activeStep === 1 &&
          !isManagerUser &&
          variant?.activeModelId &&
          variant.models.length === 0 && (
            <Typography color="warning.main" mt={2}>
              ⚠️ You skipped ML model creation. That’s okay — camera & machine
              will still be created.
            </Typography>
          )}

        <Divider sx={{ mt: 3, mb: 2, width: "100%", height: 1 }} />
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          {/* Back Button */}
          {activeStep === 1 && (
            <Button variant="outlined" onClick={() => setActiveStep(0)} sx={{border: '2px solid #062249', color: '#062249','&:hover': {bgcolor: '#e2e2e2ff'}}}>
              Back
            </Button>
          )}

          {/* skip button */}
          {activeStep === 0 && !(isManagerUser && mode === "edit") && (
            <Button variant="outlined" onClick={() => setSkipDialogOpen(true)} sx={{border: '2px solid #062249', color: '#062249','&:hover': {bgcolor: '#e2e2e2ff'}}}>
              Skip
            </Button>
          )}

          {/* Submit And Next Button */}
          {activeStep === 1 ? (
            <Button
              variant="contained"
              onClick={mode === "edit" ? handleEditSubmit : handleCreate}
              sx={{color:"white", bgcolor:"#006a0bff", border: '2px solid #006a0bff', '&:hover': {bgcolor: '#008a0eff', border: '2px solid #008a0eff'}}}
            >
              {mode === "edit" ? "Confirm Edit" : "Submit"}
            </Button>
          ) : (
            <Button variant="contained" onClick={() => setActiveStep(1)} sx={{bgcolor: '#062249', '&:hover': {bgcolor: '#083068ff'}}}>
              Next
            </Button>
          )}
        </Box>
      </Paper>

      {/* Edit Delete dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <DialogTitle>Developer Settings</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setMachine(editMachine);
              setActiveStep(1);
              setIsEditDialogOpen(false);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              handleDeleteMachine(editMachine.id);
              setIsEditDialogOpen(false);
            }}
            sx={{color: 'red'}}
          >
            Delete
          </Button>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Skip Confirmation Dialog */}
      <Dialog open={skipDialogOpen} onClose={() => setSkipDialogOpen(false)}>
        <DialogTitle>
          {hasExistingModelOrVariants
            ? "Discard Changes?"
            : "Skip ML Model & Variant Creation?"}
        </DialogTitle>

        <DialogContent>
          <Typography>
            {hasExistingModelOrVariants
              ? "Skipping this will discard your changes to the variant. Do you want to continue?"
              : "Are you sure you want to skip ML model and variant creation? You can add them later."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSkipDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setVariant({
                name: "",
                description: "",
                biscuit_type: "",
                models: [],
                activeModelIndex: 0,
              });
              setUseExistingVariant(false);
              setSelectedVariantId("");
              setActiveStep(1);
              setSkipDialogOpen(false);
            }}
            variant="contained"
            color="warning"
          >
            Yes, Skip
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddMachineStepper;
