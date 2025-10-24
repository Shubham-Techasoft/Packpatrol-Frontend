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
  const [selectedModelId, setSelectedModelId] = useState(null);

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

  const isManagerUser = isManager();

  const loadVariantForEdit = async (variantId) => {
    try {
      // 1. Fetch variant
      const res = await fetch(
        `${base_URL}/api/machinevariants/${variantId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const full = await res.json();

      // 2. Fetch all models
      const modelsRes = await fetch(`${base_URL}/api/mlmodels/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!modelsRes.ok) throw new Error(await modelsRes.text());
      const allModels = await modelsRes.json();

      // 3. Filter models linked to this variant
      let models = allModels
        .filter((mdl) => mdl.variant === variantId)
        .map((mdl) => ({
          id: mdl.id,
          name: mdl.name || "",
          version: mdl.version || "",
          description: mdl.description || "",
          recommended_threshold: mdl.recommended_threshold ?? "",
          model_file: null,
        }));

      // 4. If no models found, use active_ml_model
      if (models.length === 0 && full.active_ml_model) {
        models = [
          {
            id: full.active_ml_model.id,
            name: full.active_ml_model.name || "",
            version: full.active_ml_model.version || "",
            description: full.active_ml_model.description || "",
            recommended_threshold:
              full.active_ml_model.recommended_threshold ?? "",
            model_file: null,
          },
        ];
      }

      // 5. Find active model index
      const activeId = full.active_ml_model?.id || null;
      const activeIndex = models.findIndex((m) => m.id === activeId);

      // 6. Set state
      setVariant({
        id: full.id,
        name: full.name || "",
        description: full.description || "",
        biscuit_type: full.biscuit_type || "",
        models,
        activeModelIndex: activeIndex >= 0 ? activeIndex : 0,
      });

      if (activeId) setSelectedModelId(activeId);
    } catch (e) {
      console.error("❌ Failed to load variant + models:", e);
    }
  };

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
          recommended_threshold: "",
        },
      ],
    }));
  };

  // Set active model (radio)
  const setActiveModelIndex = (idx) => {
    setVariant((prev) => ({ ...prev, activeModelIndex: idx }));
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
        if (createdModels.length > 0) {
          const activeModel = createdModels[variant.activeModelIndex || 0];
          console.log("🔹 Candidate active model:", activeModel);

          const activeRes = await fetch(
            `${base_URL}/api/machinevariants/${variantId}/set_active_model/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: JSON.stringify({
                model_id: activeModel.id,
                biscuit_type: variant.biscuit_type || "",
                name: variant.name,
                is_active: true,
              }),
            }
          );

          if (!activeRes.ok) {
            const errText = await activeRes.text();
            throw new Error("❌ Failed to set active model: " + errText);
          }

          const activeData = await activeRes.json();
          console.log("✅ Active model set for variant:", activeData);
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

  // handleEditSubmit function
  const handleEditSubmit = async () => {
    console.log("🚀 handleEditSubmit triggered");

    const token = localStorage.getItem("access_token");
    const isManager = localStorage.getItem("designation") === "manager";
    const machineId = editData?.machine?.id;
    const cameraId = editData?.machine?.camera?.id;
    let variantId = editData?.machine?.variants?.[0]?.id || null;

    const mlModel =
      !useExistingVariant && variant.models?.length > 0
        ? variant.models[variant.activeModelIndex]
        : editData?.mlModel || {};

    // const variants = !useExistingVariant && variant.name ? [variant] : [];
    const variants =
      useExistingVariant && editData?.selectedVariantId
        ? [{ id: editData.selectedVariantId }]
        : !useExistingVariant && variant.name
          ? [{ ...variant, models: variant.models }]
          : [];

    try {
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

      // 3️⃣ Update/Create ML Model
      const mlModelChanged =
        editData?.mlModel &&
        ((mlModel.name && mlModel.name !== editData.mlModel.name) ||
          (mlModel.version && mlModel.version !== editData.mlModel.version) ||
          (mlModel.description &&
            mlModel.description !== editData.mlModel.description) ||
          (mlModel.recommended_threshold !== undefined &&
            mlModel.recommended_threshold !==
              editData.mlModel.recommended_threshold) ||
          mlModel.model_file instanceof File);

      console.log("🔹 mlModelChanged?", mlModelChanged);

      if (mlModelChanged) {
        if (editData?.mlModel?.id) {
          console.log("🔹 Editing existing ML model:", editData.mlModel.id);

          // Always send name + version (they must stay a unique pair)
          const mlPayload = {
            name: mlModel.name || editData.mlModel.name,
            version: mlModel.version || editData.mlModel.version,
          };

          if (
            mlModel.description &&
            mlModel.description !== editData.mlModel.description
          ) {
            mlPayload.description = mlModel.description;
          }
          if (
            mlModel.recommended_threshold !== undefined &&
            mlModel.recommended_threshold !==
              editData.mlModel.recommended_threshold
          ) {
            mlPayload.recommended_threshold = mlModel.recommended_threshold;
          }
          if (
            mlModel.is_active !== undefined &&
            mlModel.is_active !== editData.mlModel.is_active
          ) {
            mlPayload.is_active = mlModel.is_active;
          }

          // Check if we have a new file
          if (mlModel.model_file instanceof File) {
            console.log("🔹 ML model has new file, using FormData upload");

            const formData = new FormData();
            formData.append("model_file", mlModel.model_file);
            Object.entries(mlPayload).forEach(([key, value]) =>
              formData.append(key, value)
            );

            console.log("🔹 FormData keys:", Array.from(formData.keys()));

            const mlRes = await fetch(
              `${base_URL}/api/mlmodels/${editData.mlModel.id}/`,
              {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
              }
            );

            console.log("🔹 PATCH ML Model response status:", mlRes.status);
            console.log("🔹 PATCH ML Model response body:", await mlRes.text());
          } else {
            console.log("🔹 ML model file not changed, sending JSON only");

            delete mlPayload.model_file;

            console.log("🔹 PATCH ML Model JSON payload:", mlPayload);

            const mlRes = await fetch(
              `${base_URL}/api/mlmodels/${editData.mlModel.id}/`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(mlPayload),
              }
            );

            console.log("🔹 PATCH ML Model response status:", mlRes.status);
            const mlResText = await mlRes.text();
            console.log("🔹 PATCH ML Model response body:", mlResText);

            if (mlRes.ok) {
              const mlModelData = JSON.parse(mlResText);
              console.log("✅ ML Model updated:", mlModelData);
            } else {
              console.error("❌ ML Model update failed");
            }
          }
        } else {
          console.log("⚠️ ML Model is new, will use POST (FormData)");
        }
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

      alert("✅ Machine updated successfully!");
      if (onMachineCreated) onMachineCreated();
      if (onClose) onClose();
    } catch (error) {
      console.error("❌ Error updating machine:", error);
      alert(`❌ Failed to update machine: ${error.message}`);
    }

    // 5️⃣ Update active model if switched in UI
    if (variantId && variant?.activeModelIndex !== undefined) {
      const chosenModel = variant.models?.[variant.activeModelIndex];
      if (chosenModel && chosenModel.id) {
        console.log("🔹 Setting active model via API:", chosenModel);

        const activeRes = await fetch(
          `${base_URL}/api/machinevariants/${variantId}/set_active_model/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              model_id: chosenModel.id,
              is_active: true,
            }),
          }
        );

        const activeResText = await activeRes.text();
        if (activeRes.ok) {
          const activeData = JSON.parse(activeResText);
          console.log("✅ Active model updated:", activeData);
        } else {
          console.error("❌ Failed to set active model:", activeResText);
          alert("❌ Failed to update active model: " + activeResText);
        }
      }
    }
  };

  // model and variant form
  const renderStepOne = () => (
    <Box p={2}>
      <Typography variant="h6">ML Model / Variant</Typography>

      {/* Use Existing Variant Toggle */}
      <FormControlLabel
        control={
          <Checkbox
            checked={useExistingVariant}
            onChange={onToggleUseExisting}
          />
        }
        label="Use Existing Variant"
      />

      {/* Existing variant dropdown */}
      {useExistingVariant && (
        <FormControl fullWidth sx={{ mt: 2 }}>
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
          <Typography variant="h6" mt={4}>
            Variant
          </Typography>
          <Grid container spacing={2} mt={1}>
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
      {!useExistingVariant && variant.models.length > 0 && (
        <>
          <Typography variant="h6" mt={4}>
            ML Models
          </Typography>

          {variant.models.map((model, idx) => (
            <Grid container spacing={2} mt={1} key={idx}>
              {!isManagerUser && (
                <>
                  <Grid item xs={6}>
                    <TextField
                      label="Model Name"
                      fullWidth
                      name="name"
                      value={model.name}
                      onChange={(e) => handleModelChange(e, idx)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Version"
                      fullWidth
                      name="version"
                      value={model.version}
                      onChange={(e) => handleModelChange(e, idx)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      name="description"
                      value={model.description}
                      onChange={(e) => handleModelChange(e, idx)}
                    />
                  </Grid>

                  {!useExistingVariant && mode === "edit" && (
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "orange", fontStyle: "italic" }}
                      >
                        ⚠️ Leave model file empty to retain the existing values.
                      </Typography>
                    </Grid>
                  )}

                  {!useExistingVariant && (
                    <Grid item xs={12}>
                      <Button variant="outlined" fullWidth component="label">
                        Upload Model
                        <input
                          type="file"
                          hidden
                          name="model_file"
                          onChange={(e) => handleModelChange(e, idx)}
                        />
                      </Button>
                    </Grid>
                  )}
                </>
              )}

              <Grid item xs={6}>
                <TextField
                  label="Recommended Threshold"
                  fullWidth
                  name="recommended_threshold"
                  value={model.recommended_threshold ?? ""}
                  onChange={(e) => handleModelChange(e, idx)}
                />
              </Grid>

              {/* Active model selector */}
              <Grid item xs={2}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={variant.activeModelIndex === idx}
                      onChange={() => {
                        setActiveModelIndex(idx);
                        setSelectedModelId(variant.models[idx].id);
                      }}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          ))}

          {/* Add new model button */}
          {!isManagerUser && !useExistingVariant && (
            <Button onClick={addModel} sx={{ mt: 2 }}>
              + Add Model
            </Button>
          )}
        </>
      )}
    </Box>
  );

  // machine and camera form
  const renderStepTwo = () => (
    <Box p={2}>
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
                label="Camera Name"
                name="camera_name"
                fullWidth
                value={machine.camera_name}
                onChange={handleMachineChange}
                // disabled={isManager}
              />
            </Grid>

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
              <Button fullWidth variant="outlined" component="label">
                Upload Features File
                <input
                  type="file"
                  hidden
                  name="features_file_path"
                  onChange={handleMachineChange}
                />
              </Button>
            </Grid>
          </>
        )}

        {/* ✅ Manager CAN EDIT these camera fields  */}
        <Grid item xs={6}>
          <TextField
            label="Frame Height"
            name="frame_height"
            fullWidth
            value={machine.frame_height}
            onChange={handleMachineChange}
            disabled={!isManager ? false : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Frame Width"
            name="frame_width"
            fullWidth
            value={machine.frame_width}
            onChange={handleMachineChange}
            disabled={!isManager ? false : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Offset X"
            name="offset_x"
            fullWidth
            value={machine.offset_x}
            onChange={handleMachineChange}
            // disabled={!isManager ? false : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Offset Y"
            name="offset_y"
            fullWidth
            value={machine.offset_y}
            onChange={handleMachineChange}
            // disabled={!isManager ? false : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Exposure Time"
            name="exposure_time"
            fullWidth
            value={machine.exposure_time}
            onChange={handleMachineChange}
            // disabled={!isManager ? false : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Acquisition Frame Rate"
            name="acquisition_frame_rate"
            fullWidth
            value={machine.acquisition_frame_rate}
            onChange={handleMachineChange}
            // disabled={!isManager ? false : false}
          />
        </Grid>

        {/* 🔒 Manager should not edit this */}
        {!isManagerUser && (
          <>
            <Grid item xs={12}>
              <TextField
                label="Trigger Mode"
                name="trigger_mode"
                fullWidth
                value={machine.trigger_mode}
                onChange={handleMachineChange}
                // disabled={isManager}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Video Folder Path"
                name="video_folder_path"
                fullWidth
                value={machine.video_folder_path}
                onChange={handleMachineChange}
                // disabled={isManager}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Watchdog OBS Folder Path"
                name="watchdog_obs_folder_path"
                fullWidth
                value={machine.watchdog_obs_folder_path}
                onChange={handleMachineChange}
                // disabled={isManager}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Watchdog File Expiry Time (in seconds)"
                name="watchdog_file_expi_time"
                fullWidth
                value={machine.watchdog_file_expi_time}
                onChange={handleMachineChange}
                // disabled={isManager}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );

  const hasExistingModelOrVariants =
    mode === "edit" && (!!variant.name || (variant.models?.length || 0) > 0);
  // (!!mlModel.name || !!mlModel.version || variants.length > 0);

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

        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          {/* Back Button */}
          {activeStep === 1 && (
            <Button variant="outlined" onClick={() => setActiveStep(0)}>
              Back
            </Button>
          )}

          {/* skip button */}
          {activeStep === 0 && !(isManagerUser && mode === "edit") && (
            <Button variant="outlined" onClick={() => setSkipDialogOpen(true)}>
              Skip
            </Button>
          )}

          {/* Submit And Next Button */}
          {activeStep === 1 ? (
            <Button
              variant="contained"
              onClick={mode === "edit" ? handleEditSubmit : handleCreate}
            >
              {mode === "edit" ? "Confirm Edit" : "Submit"}
            </Button>
          ) : (
            <Button variant="contained" onClick={() => setActiveStep(1)}>
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
            color="error"
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
