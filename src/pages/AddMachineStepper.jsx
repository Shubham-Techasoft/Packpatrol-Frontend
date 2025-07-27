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

const AddMachineStepper = ({
  mode = "add",
  editData = null,
  onClose,
  onMachineCreated,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [editMachine, setEditMachine] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [variants, setVariants] = useState([{ name: "", description: "" }]);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);

  const [mlModel, setMlModel] = useState({
    name: "",
    version: "",
    description: "",
    framework: "",
    model_file: null,
    recommended_threshold: "",
  });

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

  useEffect(() => {
    if (mode === "edit" && editData) {
      const m = editData.machine;

      setMachine({
        name: m.name || "",
        camera_serial_numbers: m.camera?.serial_number || "",
        camera_name: m.camera?.name || "",
        features_file_path: null, // Can't prefill file input
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

      setMlModel({
        id: editData.mlModel?.id || null,
        name: editData.mlModel?.name || "",
        version: editData.mlModel?.version || "",
        description: editData.mlModel?.description || "",
        framework: editData.mlModel?.framework || "",
        model_file: null, // Can't prefill file input
        recommended_threshold: editData.mlModel?.recommended_threshold || "",
      });

      const variantList = (m.variants || []).map((v, idx) => ({
        name: v.name || "",
        description: v.description || "",
        biscuit_type: v.biscuit_type || "",
        is_active: v.is_active || idx === 0,
      }));

      setVariants(variantList);

      const activeIndex = variantList.findIndex((v) => v.is_active);
      setActiveVariantIndex(activeIndex !== -1 ? activeIndex : 0);

      setActiveStep(0);
    }
  }, [mode, editData]);

  const handleMLChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setMlModel((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleMachineChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setMachine((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  // Create Machine Logic
  const handleCreate = async () => {
    let cameraId = null;

    try {
      let mlModelId = null;

      // 1. Create ML Model (optional)
      if (mlModel.name && mlModel.version && mlModel.model_file) {
        const mlFormData = new FormData();
        for (const key in mlModel) {
          if (mlModel[key] !== undefined && mlModel[key] !== null) {
            if (key === "model_file") {
              mlFormData.append(key, mlModel[key]);
            } else {
              mlFormData.append(key, String(mlModel[key]));
            }
          }
        }

        const mlRes = await fetch("http://localhost:8000/api/mlmodels/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: mlFormData,
        });

        if (!mlRes.ok) {
          const err = await mlRes.json();
          console.error("❌ ML Model creation failed:", err);
          throw new Error("Failed to create ML model");
        }

        const mlData = await mlRes.json();
        mlModelId = mlData.id;
        console.log("✅ ML Model ID:", mlModelId);
      }

      // 2. Create Camera
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

      const camRes = await fetch("http://localhost:8000/api/cameras/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: camFormData,
      });

      if (!camRes.ok) {
        const err = await camRes.json();
        console.error("❌ Camera creation failed:", err);
        throw new Error("Failed to create camera");
      }

      const camData = await camRes.json();
      cameraId = camData.id;
      console.log("📷 Camera ID:", cameraId);

      // 3. Create Variants
      let variantIds = [];
      let activeVariantId = null;

      if (mlModelId && variants.length > 0) {
        for (const [index, variant] of variants.entries()) {
          const variantPayload = {
            name: variant.name,
            description: variant.description || "",
            biscuit_type: variant.biscuit_type,
            active_ml_model: mlModelId,
            model_threshold: 0.5,
            model_verbose: true,
          };

          const variantRes = await fetch(
            "http://localhost:8000/api/machinevariants/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: JSON.stringify(variantPayload),
            }
          );

          if (!variantRes.ok) {
            const err = await variantRes.json();
            console.error(`❌ Variant ${index + 1} creation failed:`, err);
            throw new Error("Failed to create variant");
          }

          const varData = await variantRes.json();
          console.log("🔍 Raw Variant Response:", varData);

          // 🔄 Re-fetch the latest variants to get their IDs
          const allVariantsRes = await fetch(
            "http://localhost:8000/api/machinevariants/",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );

          const allVariants = await allVariantsRes.json();
          const matching = allVariants.find(
            (v) => v.name === variant.name && v.active_ml_model.id === mlModelId
          );

          if (!matching || !matching.id) {
            console.error(
              `❌ Could not retrieve ID for Variant ${index + 1}`,
              matching
            );
            throw new Error("Variant ID missing after creation");
          }

          variantIds.push(matching.id);
          console.log(`✅ Variant ${index + 1} created with ID:`, matching.id);

          // ⭐ Set as active if selected via radio
          if (variant.is_active) {
            activeVariantId = matching.id;
          }
        }

        // Fallback: if user didn't select any variant, use first one
        if (!activeVariantId) {
          activeVariantId = variantIds[0];
        }
      }

      // 4. Create Machine with all variant info
      const machinePayload = {
        is_active: true,
        name: machine.name,
        description: "Machine created via form",
        camera_id: cameraId,
        video_stream: true,
        video_folder_path: machine.video_folder_path,
        watchdog_file_expi_time: machine.watchdog_file_expi_time,
        base_dir_path: machine.watchdog_obs_folder_path,
        variant_ids: variantIds,
        active_variant_id: activeVariantId,
      };

      console.log("🛠️ Final Machine Payload:", machinePayload);

      const machineRes = await fetch("http://localhost:8000/api/machines/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(machinePayload),
      });

      if (!machineRes.ok) {
        const err = await machineRes.json();
        console.error("❌ Machine creation failed:", err);
        throw new Error("Failed to create machine");
      }

      const machineData = await machineRes.json();
      console.log("✅ Machine created with ID:", machineData.id);

      // 🔄 Refresh machine list in DeveloperSettings
      if (onMachineCreated) onMachineCreated();

      // alert("✅ Machine and Variants created successfully!");
      let message = "✅ Machine created successfully!";
      if (mlModelId && variantIds.length > 0) {
        message += " ML Model and Variants also created.";
      } else if (mlModelId) {
        message += " ML Model created.";
      } else if (variantIds.length > 0) {
        message += " Variants created.";
      }

      alert(message);
      if (onClose) onClose();
    } catch (error) {
      console.error("❌ Error in submission:", error);

      // Cleanup orphan camera
      if (cameraId) {
        await fetch(`http://localhost:8000/api/cameras/${cameraId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        console.warn("🧹 Deleted orphan camera:", cameraId);
      }

      alert(error.message);
    }
  };

  // handleEditSubmit function
  const handleEditSubmit = async () => {
    const token = localStorage.getItem("access_token");
    const isManager = localStorage.getItem("designation") === "manager";

    const machineId = editData?.machine?.id;
    const cameraId = editData?.machine?.camera?.id;
    const variantId = editData?.variant?.id;

    try {
      // 1. Update Camera
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
        ? `http://localhost:8000/api/cameras/${cameraId}/manager_update/`
        : `http://localhost:8000/api/cameras/${cameraId}/`;

      await fetch(cameraEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(camPayload),
      });

      // 2. Update Machine or Variant depending on role
      if (isManager) {
        // Only send PATCH if model_threshold is defined
        if (mlModel.recommended_threshold !== undefined) {
          const variantPayload = {
            model_threshold: parseFloat(mlModel.recommended_threshold),
          };

          console.log("🔧 Sending manager update:", variantPayload);

          await fetch(
            `http://localhost:8000/api/machinevariants/${variantId}/manager_update/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(variantPayload),
            }
          );
        }
      } else {
        const machinePayload = {
          name: machine.name,
          description: "Updated via Edit",
          video_stream: true,
          video_folder_path: machine.video_folder_path,
          watchdog_file_expi_time: machine.watchdog_file_expi_time,
          base_dir_path: machine.watchdog_obs_folder_path,
        };

        await fetch(`http://localhost:8000/api/machines/${machineId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(machinePayload),
        });

        // 3. Create or update ML Model (only if provided)
        if (
          mlModel.name ||
          mlModel.version ||
          mlModel.description ||
          mlModel.recommended_threshold
        ) {
          const mlFormData = new FormData();
          for (const key in mlModel) {
            if (mlModel[key] !== undefined && mlModel[key] !== null) {
              if (key === "model_file" && mlModel[key] instanceof File) {
                mlFormData.append(key, mlModel[key]);
              } else if (key !== "model_file") {
                mlFormData.append(key, String(mlModel[key]));
              }
            }
          }

          const mlModelEndpoint = editData?.mlModel?.id
            ? `http://localhost:8000/api/mlmodels/${editData.mlModel.id}/`
            : "http://localhost:8000/api/mlmodels/";

          const method = editData?.mlModel?.id ? "PATCH" : "POST";

          const mlRes = await fetch(mlModelEndpoint, {
            method,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: mlFormData,
          });

          const mlModelData = await mlRes.json();
          const mlModelId = mlModelData.id;

          if (!mlRes.ok) {
            const err = await mlRes.json();
            console.error("❌ ML Model update/create failed:", err);
            throw new Error("Failed to update/create ML model");
          }

          console.log(
            `✅ ML Model ${editData?.mlModel?.id ? "updated" : "created"} successfully`
          );

          //  Link newly created ML model to the variant (only if it was just created)
          if (editData?.machine?.variants?.[0]?.id && mlModelId) {
            const linkVariantRes = await fetch(
              `http://localhost:8000/api/machinevariants/${editData.machine.variants[0].id}/`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  active_ml_model: mlModelId,
                }),
              }
            );

            if (!linkVariantRes.ok) {
              const err = await linkVariantRes.json();
              console.error("❌ Failed to re-link ML model to variant:", err);
              throw new Error("Variant linking failed");
            }

            console.log("✅ ML model re-linked to variant");
          }
        }

        // ✅ POST only new variants (ignore existing ones)
        for (const variant of variants) {
          if (!variant.id) {
            const variantPayload = {
              name: variant.name,
              description: variant.description,
              biscuit_type: variant.biscuit_type,
              model_threshold: variant.model_threshold ?? 0.5,
              model_verbose: variant.model_verbose ?? 0.5,
            };

            console.log("🟢 Creating new variant:", variantPayload);

            try {
              const res = await fetch(
                "http://localhost:8000/api/machinevariants/",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(variantPayload),
                }
              );

              if (!res.ok) {
                const err = await res.json();
                console.error(
                  "❌ Failed to create variant:",
                  variantPayload,
                  err
                );
              } else {
                const newVariant = await res.json();
                console.log("✅ Successfully created variant:", newVariant);

                // ✅ Link newly created variant to the machine
                const linkRes = await fetch(
                  `http://localhost:8000/api/machines/${machineId}/add_variant/`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ variant_id: newVariant.id }),
                  }
                );

                if (!linkRes.ok) {
                  const err = await linkRes.json();
                  console.error(
                    "❌ Failed to link variant to machine:",
                    newVariant.id,
                    err
                  );
                } else {
                  console.log("✅ Variant linked to machine:", newVariant.id);
                  variantsUpdated = true;
                }
              }
            } catch (error) {
              console.error(
                "❌ Exception while creating variant:",
                variantPayload,
                error
              );
            }
          } else {
            console.log(
              "⚠️ Skipping existing variant (no edits):",
              variant.name
            );
          }
        }

        // 🧹 Delete ML model if skipped
        if (!mlModel.name && editData?.mlModel?.id) {
          await fetch(
            `http://localhost:8000/api/mlmodels/${editData.mlModel.id}/`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("🧹 Deleted ML model due to skip.");
        }

        // 🧹 Delete all variants if skipped
        if (variants.length === 0 && editData?.machine?.variants?.length > 0) {
          for (const v of editData.machine.variants) {
            await fetch(`http://localhost:8000/api/machinevariants/${v.id}/`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("🧹 Deleted variant with ID:", v.id);
          }
        }
      }

      alert("✅ Machine updated successfully!");
      if (onMachineCreated) onMachineCreated();
      if (onClose) onClose();
    } catch (error) {
      console.error("❌ Error updating machine:", error);
      alert("Failed to update machine");
    }
  };

  // const handleSubmit = async () => {
  //   let cameraId = null;
  //   let machineId = null;

  //   try {
  //     let mlModelId = null;

  //     // 1. Create ML Model (optional)
  //     if (mlModel.name && mlModel.version && mlModel.model_file) {
  //       const mlFormData = new FormData();
  //       for (const key in mlModel) {
  //         if (mlModel[key] !== undefined && mlModel[key] !== null) {
  //           if (key === "model_file") {
  //             mlFormData.append(key, mlModel[key]);
  //           } else {
  //             mlFormData.append(key, String(mlModel[key]));
  //           }
  //         }
  //       }

  //       console.log("🚀 ML Model FormData:");
  //       for (let [key, value] of mlFormData.entries()) {
  //         console.log(`${key}:`, value);
  //       }

  //       const mlRes = await fetch("http://localhost:8000/api/mlmodels/", {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //         body: mlFormData,
  //       });

  //       console.log("📡 ML Response Status:", mlRes.status);
  //       if (!mlRes.ok) {
  //         const err = await mlRes.json();
  //         console.error("❌ ML Model creation failed:", err);
  //         throw new Error("Failed to create ML model");
  //       }

  //       const mlData = await mlRes.json();
  //       mlModelId = mlData.id;
  //       console.log("✅ ML Model ID:", mlModelId);
  //     }

  //     // 2. Create Camera
  //     const camFormData = new FormData();
  //     camFormData.append("is_active", true);
  //     camFormData.append("name", `${machine.name}-cam`);
  //     camFormData.append("serial_number", machine.camera_serial_numbers);
  //     camFormData.append("description", "Auto-generated camera");

  //     if (machine.features_file_path instanceof File) {
  //       camFormData.append("features_file_path", machine.features_file_path);
  //     }

  //     camFormData.append("frame_height", machine.frame_height);
  //     camFormData.append("frame_width", machine.frame_width);
  //     camFormData.append("acquisition_frame_rate", machine.acquisition_frame_rate);
  //     camFormData.append("exposure_time", machine.exposure_time);
  //     camFormData.append("trigger_mode", machine.trigger_mode);
  //     camFormData.append("offset_x", machine.offset_x);
  //     camFormData.append("offset_y", machine.offset_y);
  //     camFormData.append("max_failed_frames", 5);
  //     camFormData.append("check_max_failed_frames", true);

  //     const camRes = await fetch("http://localhost:8000/api/cameras/", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //       },
  //       body: camFormData,
  //     });

  //     if (!camRes.ok) {
  //       const err = await camRes.json();
  //       console.error("❌ Camera creation failed:", err);
  //       throw new Error("Failed to create camera");
  //     }

  //     const camData = await camRes.json();
  //     cameraId = camData.id;
  //     console.log("📷 Camera ID:", cameraId);

  //     // 3. Create Machine
  //     const machinePayload = {
  //       is_active: true,
  //       name: machine.name,
  //       description: "Machine created via form",
  //       camera: cameraId,
  //       video_stream: true,
  //       video_folder_path: machine.video_folder_path,
  //       watchdog_file_expi_time: machine.watchdog_file_expi_time,
  //       base_dir_path: machine.watchdog_obs_folder_path,
  //     };

  //     console.log("🛠️ Machine Payload:", machinePayload);

  //     const machineRes = await fetch("http://localhost:8000/api/machines/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //       },
  //       body: JSON.stringify(machinePayload),
  //     });

  //     if (!machineRes.ok) {
  //       const err = await machineRes.json();
  //       console.error("❌ Machine creation failed:", err);
  //       throw new Error("Failed to create machine");
  //     }

  //     const machineData = await machineRes.json();
  //     machineId = machineData.id;
  //     console.log("🏭 Machine ID:", machineId);

  //     // 4. Create Variants
  //     let variantIds = [];
  //     if (mlModelId && variants.length > 0) {
  //       for (const [index, variant] of variants.entries()) {
  //         const variantPayload = {
  //           name: variant.name,
  //           description: variant.description || "",
  //           biscuit_type: variant.biscuit_type,
  //           active_ml_model: mlModelId,
  //           machine: machineId,
  //           model_threshold: 0.5,
  //           model_verbose: true,
  //         };

  //         console.log(`🧬 Variant ${index + 1} Payload:`, variantPayload);

  //         const variantRes = await fetch("http://localhost:8000/api/machinevariants/", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //           },
  //           body: JSON.stringify(variantPayload),
  //         });

  //         if (!variantRes.ok) {
  //           const err = await variantRes.json();
  //           console.error(`❌ Variant ${index + 1} creation failed:`, err);
  //           throw new Error("Failed to create variant");
  //         }

  //         const varData = await variantRes.json();
  //         variantIds.push(varData.id);
  //         console.log(`✅ Variant ${index + 1} created with ID:`, varData.id);
  //       }
  //     }

  //     if (variantIds.length > 0 && machineId) {
  //       const patchPayload = {
  //         variant_ids: variantIds,
  //         active_variant_id: variantIds[0],
  //       };

  //       const patchRes = await fetch(`http://localhost:8000/api/machines/${machineId}/`, {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //         body: JSON.stringify(patchPayload),
  //       });

  //       if (!patchRes.ok) {
  //         const err = await patchRes.json();
  //         console.error("❌ Failed to link variants to machine:", err);
  //         throw new Error("Linking variants failed");
  //       }

  //       console.log("✅ Machine successfully patched with variants");
  //     }

  //     alert("✅ Machine and Variants created successfully!");
  //     if (onClose) onClose();

  //   } catch (error) {
  //     console.error("❌ Error in submission:", error);

  //     // Cleanup orphan camera
  //     if (cameraId) {
  //       await fetch(`http://localhost:8000/api/cameras/${cameraId}/`, {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //       });
  //       console.warn("🧹 Deleted orphan camera:", cameraId);
  //     }

  //     alert(error.message);
  //   }
  // };

  // const handleSubmit = async () => {
  //   let cameraId = null;
  //   let machineId = null;

  //   try {
  //     let mlModelId = null;

  //     // 1. Create ML Model (optional)
  //     if (mlModel.name && mlModel.version && mlModel.model_file) {
  //       const mlFormData = new FormData();
  //       for (const key in mlModel) {
  //         if (mlModel[key] !== undefined && mlModel[key] !== null) {
  //           if (key === "model_file") {
  //             mlFormData.append(key, mlModel[key]);
  //           } else {
  //             mlFormData.append(key, String(mlModel[key]));
  //           }
  //         }
  //       }

  //       console.log("🚀 ML Model FormData:");
  //       for (let [key, value] of mlFormData.entries()) {
  //         console.log(`${key}:`, value);
  //       }

  //       const mlRes = await fetch("http://localhost:8000/api/mlmodels/", {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //         body: mlFormData,
  //       });

  //       console.log("📡 ML Response Status:", mlRes.status);
  //       if (!mlRes.ok) {
  //         const err = await mlRes.json();
  //         console.error("❌ ML Model creation failed:", err);
  //         throw new Error("Failed to create ML model");
  //       }

  //       const mlData = await mlRes.json();
  //       mlModelId = mlData.id;
  //     }

  //     // 2. Create Camera (required)
  //     const camFormData = new FormData();
  //     camFormData.append("is_active", true);
  //     camFormData.append("name", `${machine.name}-cam`);
  //     camFormData.append("serial_number", machine.camera_serial_numbers);
  //     camFormData.append("description", "Auto-generated camera");

  //     if (machine.features_file_path instanceof File) {
  //       camFormData.append("features_file_path", machine.features_file_path);
  //     }

  //     camFormData.append("frame_height", machine.frame_height);
  //     camFormData.append("frame_width", machine.frame_width);
  //     camFormData.append(
  //       "acquisition_frame_rate",
  //       machine.acquisition_frame_rate
  //     );
  //     camFormData.append("exposure_time", machine.exposure_time);
  //     camFormData.append("trigger_mode", machine.trigger_mode);
  //     camFormData.append("offset_x", machine.offset_x);
  //     camFormData.append("offset_y", machine.offset_y);
  //     camFormData.append("max_failed_frames", 5);
  //     camFormData.append("check_max_failed_frames", true);

  //     const camRes = await fetch("http://localhost:8000/api/cameras/", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //       },
  //       body: camFormData,
  //     });

  //     if (!camRes.ok) {
  //       const err = await camRes.json();
  //       console.error("❌ Camera creation failed:", err);
  //       throw new Error("Failed to create camera");
  //     }

  //     const camData = await camRes.json();
  //     cameraId = camData.id;

  //     // 3. Create Machine
  //     const machinePayload = {
  //       is_active: true,
  //       name: machine.name,
  //       description: "Machine created via form",
  //       camera: cameraId,
  //       video_stream: true,
  //       video_folder_path: machine.video_folder_path,
  //       watchdog_file_expi_time: machine.watchdog_file_expi_time,
  //       base_dir_path: machine.watchdog_obs_folder_path,
  //     };

  //     console.log("🛠️ Machine Payload:", machinePayload);

  //     const machineRes = await fetch("http://localhost:8000/api/machines/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //       },
  //       body: JSON.stringify(machinePayload),
  //     });

  //     if (!machineRes.ok) {
  //       const err = await machineRes.json();
  //       console.error("❌ Machine creation failed:", err);
  //       throw new Error("Failed to create machine");
  //     }

  //     alert("✅ Machine created successfully!");
  //     if (onClose) onClose();
  //   } catch (error) {
  //     console.error(error);

  //     // 🧹 Cleanup orphan camera if needed
  //     if (cameraId) {
  //       await fetch(`http://localhost:8000/api/cameras/${cameraId}/`, {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //       });
  //       console.warn("🧹 Deleted orphan camera:", cameraId);
  //     }

  //     alert(error.message);
  //   }

  //   // 4. Create Variants (if mlModel exists)
  //   let variantIds = [];
  //   if (mlModelId) {
  //     for (const [index, variant] of variants.entries()) {
  //       const variantPayload = {
  //         name: variant.name,
  //         description: variant.description || "",
  //         biscuit_type: variant.biscuit_type,
  //         active_ml_model: mlModelId,
  //         model_threshold: 0.5,
  //         model_verbose: true,
  //         machine: machineId,
  //       };

  //       console.log(`🧬 Variant ${index + 1} Payload:`, variantPayload);

  //       const variantRes = await fetch(
  //         "http://localhost:8000/api/machinevariants/",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //           },
  //           body: JSON.stringify(variantPayload),
  //         }
  //       );

  //       if (!variantRes.ok) {
  //         const err = await variantRes.json();
  //         console.error(`❌ Variant ${index + 1} creation failed:`, err);
  //         throw new Error("Failed to create variant");
  //       }

  //       const varData = await variantRes.json();
  //       variantIds.push(varData.id);
  //     }
  //   }
  // };

  // mlmodel and variant form

  const renderStepOne = () => (
    <Box p={2}>
      {/* ml model */}
      <Typography variant="h6">ML Model (Optional)</Typography>
      <Grid container spacing={2} mt={1}>
        {/* name */}
        {!isManagerUser && (
          <>
            <Grid item xs={6}>
              <TextField
                label="Model Name"
                fullWidth
                name="name"
                value={mlModel.name}
                onChange={handleMLChange}
                // disabled={isManager}
              />
            </Grid>

            {/* version */}
            <Grid item xs={6}>
              <TextField
                label="Version"
                fullWidth
                name="version"
                value={mlModel.version}
                onChange={handleMLChange}
                // disabled={isManager}
              />
            </Grid>

            {/* description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                name="description"
                value={mlModel.description}
                onChange={handleMLChange}
                // disabled={isManager}
              />
            </Grid>

            {/* edit mode warning */}
            {mode === "edit" && (
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: "orange", fontStyle: "italic" }}
                >
                  ⚠️ Leave model file empty to retain the existing values.
                </Typography>
              </Grid>
            )}

            {/* framework */}
            {/* <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Framework</InputLabel>
                <Select
                  name="framework"
                  value={mlModel.framework}
                  onChange={handleMLChange}
                  // disabled={isManager}
                >
                  {frameworks.map((f) => (
                    <MenuItem key={f} value={f}>
                      {f}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}

            {/* model upload */}
            <Grid item xs={12}>
              <Button variant="outlined" fullWidth component="label">
                Upload Model
                <input
                  type="file"
                  hidden
                  name="model_file"
                  onChange={handleMLChange}
                  // disabled={isManager}
                />
              </Button>
            </Grid>
          </>
        )}

        {/* Threshold */}
        <Grid item xs={6}>
          <TextField
            label="Recommended Threshold"
            fullWidth
            name="recommended_threshold"
            value={mlModel.recommended_threshold}
            onChange={handleMLChange}
          />
        </Grid>
      </Grid>

      {/* Variants */}
      {!isManagerUser && (
        <>
          <Typography variant="h6" mt={4}>
            Variants (Optional)
          </Typography>

          {variants.map((v, idx) => (
            // variant name
            <Grid container spacing={2} key={idx} alignItems="center" mt={1}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Variant Name"
                  value={v.name}
                  onChange={(e) => {
                    const updated = [...variants];
                    updated[idx].name = e.target.value;
                    setVariants(updated);
                  }}
                  // disabled={isManagerUser}
                />
              </Grid>
              {/* biscuit type */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Biscuit Type"
                  value={v.biscuit_type || ""}
                  onChange={(e) => {
                    const updated = [...variants];
                    updated[idx].biscuit_type = e.target.value;
                    setVariants(updated);
                  }}
                  // disabled={isManagerUser}
                />
              </Grid>

              {/* variant description */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Description"
                  value={v.description}
                  onChange={(e) => {
                    const updated = [...variants];
                    updated[idx].description = e.target.value;
                    setVariants(updated);
                  }}
                  // disabled={isManagerUser}
                />
              </Grid>

              {/* active variant */}
              <Grid item xs={2}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={activeVariantIndex === idx}
                      onChange={() => setActiveVariantIndex(idx)}
                      // disabled={isManagerUser}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          ))}

          <Button
            onClick={() =>
              setVariants([...variants, { name: "", description: "" }])
            }
            sx={{ mt: 2 }}
            //  disabled={isManagerUser}
          >
            + Add Variant
          </Button>
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
    mode === "edit" &&
    (!!mlModel.name || !!mlModel.version || variants.length > 0);

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

        {activeStep === 1 && !mlModel.name && !isManagerUser && (
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
            ? "Remove Existing ML Model & Variants?"
            : "Skip ML Model & Variant Creation?"}
        </DialogTitle>

        <DialogContent>
          <Typography>
            {hasExistingModelOrVariants
              ? "⚠️ Skipping will remove the existing ML model and variants from this machine. Do you want to continue?"
              : "Are you sure you want to skip ML model and variant creation? You can add them later."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSkipDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setMlModel({
                name: "",
                version: "",
                model_file: null,
                description: "",
                input_shape: "",
                output_shape: "",
                framework: "",
                recommended_threshold: "",
              });
              setVariants([]);
              setActiveVariantIndex(null);
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
 