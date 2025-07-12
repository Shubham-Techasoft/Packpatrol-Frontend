// pages/Home.jsx
import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  styled,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
  TextField,
  MenuItem,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/Star";
import LiveImageFeed from "./sections/LiveImageFeed";

import StackIcon from "@mui/icons-material/StackedLineChart";
import HeightIcon from "@mui/icons-material/Straighten";
import ErrorIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RecentActivitiesDialog from "../components/RecentActivitiesDialog";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.shadows[3],
}));

// live updates messages
const logMessages = [
  "Batch #101 started: Stack size set to 45mm, targeting 200 stacks.",
  "Machine 2: 187 stacks successfully produced, 13 rejected due to uneven texture.",
  "Quality Control: 5 biscuits rejected from Stack #56 due to overbaking.",
  "Machine 1 completed batch: 95% pass rate achieved.",
  "Auto-inspection passed: Stack #89 — 20 biscuits, 0 defects.",
  "Stack size updated to 50mm for chocolate machine.",
  "Machine 3 paused — low dough pressure detected.",
  "Final check: 1,250 biscuits passed, 30 rejected in current batch.",
  "Packaging unit: 190 stacks sealed, 2 flagged for inspection.",
  "Stack Count: 205 stacks built in last cycle (97.5% efficiency).",
  "Warning: Stack #32 contained irregular biscuit height — rejected.",
  "Line 2 resumed — lubricant level optimized.",
  "Stack #77 manually inspected — 100% conformity confirmed.",
  "Min Stack Size set to 40mm, Max Stack Size adjusted to 55mm.",
  "machine change to 'Oats Delight' — expected yield: 1,500 biscuits.",
];

type Machine = {
  id: string;
  name: string;
};

type Variant = {
  id: string;
  name: string;
};

export default function Home({ recentDialogOpen, closeRecentDialog }) {

  const [imageUrls, setImageUrls] = React.useState([]);
  const [messages, setMessages] = React.useState(logMessages);
  const [selectedMachine, setSelectedMachine] = React.useState("");
  const [stackSize, setStackSize] = React.useState("");
  const [status, setStatus] = React.useState("stopped");

  const [selectedVariant, setSelectedVariant] = React.useState("");
  // const [favorites, setFavorites] = React.useState([]);
  const [minStackSize, setMinStackSize] = React.useState("");
  const [maxStackSize, setMaxStackSize] = React.useState("");
  const [minStackLength, setMinStackLength] = React.useState("");
  const [maxStackLength, setMaxStackLength] = React.useState("");
  const [skipAutoFetch, setSkipAutoFetch] = React.useState(false);

  const [realtimeData, setRealtimeData] = React.useState({
    estimated_stack_length: 0,
    estimated_stack_count: 0,
    total_frame_processed: 0,
    total_frame_rejected: 0,
  });

  // summary cards at top
  const stackData = [
    {
      title: "Stack Count",
      value: realtimeData.estimated_stack_count || 0,
      bg: "#FFD700, #FFA500",
      tooltip: "Total number of stacks processed",
      icon: <StackIcon sx={{ fontSize: 28, mb: 0.5 }} />,
    },
    {
      title: "Stack Length",
      value: `${realtimeData.estimated_stack_length || 0} mm`,
      bg: "#8E2DE2, #4A00E0",
      tooltip: "Length of each stack in millimeters",
      icon: <HeightIcon sx={{ fontSize: 28, mb: 0.5 }} />,
    },
    {
      title: "Rejected Count",
      value: realtimeData.total_frame_rejected?.toLocaleString() || "0",
      bg: "#FF416C, #FF4B2B",
      tooltip: "Total rejected items during inspection",
      icon: <ErrorIcon sx={{ fontSize: 28, mb: 0.5 }} />,
    },
    {
      title: "Passed Count",
      value: realtimeData.total_frame_processed?.toLocaleString() || "0",
      bg: "#00b09b, #96c93d",
      tooltip: "Items that passed quality checks",
      icon: <CheckCircleIcon sx={{ fontSize: 28, mb: 0.5 }} />,
    },
  ];

  // const [favoritesOpen, setFavoritesOpen] = React.useState(false);

  const [machines, setMachines] = React.useState<Machine[]>([]);
  const [variants, setVariants] = React.useState<Variant[]>([]);

  const [nextMachinesPage, setNextMachinesPage] = React.useState<string | null>(
    null
  );
  const [isLoadingMachines, setIsLoadingMachines] = React.useState(false);

  const [nextVariantsPage, setNextVariantsPage] = React.useState<string | null>(
    null
  );
  const [isLoadingVariants, setIsLoadingVariants] = React.useState(false);

  // initial fetch for machines
  React.useEffect(() => {
    const fetchMachines = async () => {
      setIsLoadingMachines(true);
      try {
        const response = await fetch(
          "http://localhost:8000/api/machines/??is_active=true"
        );
        const data = await response.json();
        setMachines(data);
      } catch (error) {
        console.error("Error fetching machines:", error);
      } finally {
        setIsLoadingMachines(false);
      }
    };

    fetchMachines();
  }, []);

  // load more machines function
  const loadMoreMachines = () => {
    // if (!nextMachinesPage || isLoadingMachines) return;

    // setIsLoadingMachines(true);
    // fetch(nextMachinesPage)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setMachines((prev) => [...prev, ...data.results]);
    //     setNextMachinesPage(data.next || null);
    //     setIsLoadingMachines(false);
    //   })
    //   .catch((err) => {
    //     console.error("Failed to fetch more machines", err);
    //     setIsLoadingMachines(false);
    //   });
    console.log("No pagination supported in API");
  };

  // fetch variants after selecting machines
  React.useEffect(() => {
    if (!selectedMachine) {
      // Clear everything when no machine selected
      setVariants([]);
      setSelectedVariant("");
      setMinStackSize("");
      setMaxStackSize("");
      setMinStackLength("");
      setMaxStackLength("");
      return;
    }

    setIsLoadingVariants(true);

    fetch(`http://127.0.0.1:8000/api/machines/${selectedMachine}/`)
      .then((res) => res.json())
      .then((data) => {
        setVariants(data.variants || []);
        setSelectedVariant(data.active_variant?.id || "");
        // Clear stack values when switching machines
        setMinStackSize("");
        setMaxStackSize("");
        setMinStackLength("");
        setMaxStackLength("");
      })
      .catch((err) => {
        console.error("Failed to fetch machine details", err);
        setVariants([]);
        setSelectedVariant("");
      })
      .finally(() => setIsLoadingVariants(false));
  }, [selectedMachine]);

  // handle active variant
  const handleVariantChange = async (event) => {
    const newVariantId = event.target.value;
    setSelectedVariant(newVariantId);

    try {
      const machineRes = await fetch(
        `http://127.0.0.1:8000/api/machines/${selectedMachine}/`
      );
      const machineData = await machineRes.json();

      const payload = {
        variant_id: newVariantId,
        camera_id: machineData.camera?.id,
        variant_ids: machineData.variants.map((v) => v.id),
        active_variant_id: newVariantId,
        is_active: machineData.is_active,
        name: machineData.name,
        description: machineData.description || "",
        min_stack_length: machineData.min_stack_length || 0,
        max_stack_length: machineData.max_stack_length || 0,
        min_stack_size: machineData.min_stack_size || 0,
        max_stack_size: machineData.max_stack_size || 0,
        base_dir_path: machineData.base_dir_path || "",
        watchdog_file_expi_time:
          machineData.watchdog_file_expi_time || "00:00:30",
        video_stream: machineData.video_stream,
        video_folder_path: machineData.video_folder_path || "",
        is_running: machineData.is_running,
        is_operational: machineData.is_operational,
        last_maintenance: machineData.last_maintenance,
      };

      const res = await fetch(
        `http://127.0.0.1:8000/api/machines/${selectedMachine}/switch_variant/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Backend Response:", errorText);
        throw new Error("Failed to switch variant on backend");
      }

      const data = await res.json();
      console.log("✅ Active variant switched:", data);
    } catch (err) {
      console.error("❌ Variant switch failed:", err);
      alert("Failed to switch variant. Please try again.");
    }
  };

  // load more varients funciton
  const loadMoreVariants = () => {
    // if (!nextVariantsPage || isLoadingVariants) return;

    // setIsLoadingVariants(true);
    // fetch(nextVariantsPage)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setVariants((prev) => [...prev, ...data.results]);
    //     setNextVariantsPage(data.next || null);
    //     setIsLoadingVariants(false);
    //   })
    //   .catch((err) => {
    //     console.error("Failed to fetch more variants", err);
    //     setIsLoadingVariants(false);
    //   });
    console.log("No pagination supported in API");
  };

  // load min-max stack length and size
  React.useEffect(() => {
    const fetchRunLogsAndSetStackValues = async () => {
      if (!selectedMachine || !selectedVariant) return;

      if (skipAutoFetch) {
        console.log("⏭ Skipping auto-fetch due to applyRecentLog");
        setSkipAutoFetch(false); // Reset after one skip
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/machinerunlogs/");
        const data = await res.json();

        // Find selected machine and variant names
        const machine = machines.find((m) => m.id === selectedMachine);
        const variant = variants.find((v) => v.id === selectedVariant);

        if (!machine || !variant) return;

        // Find matching log
        const matchingLog = data.find(
          (log) =>
            log.machine_name === machine.name &&
            log.variant_name === variant.name
        );

        if (matchingLog) {
          setMinStackSize(matchingLog.min_stack_size);
          setMaxStackSize(matchingLog.max_stack_size);
          setMinStackLength(matchingLog.min_stack_length);
          setMaxStackLength(matchingLog.max_stack_length);
        }
      } catch (error) {
        console.error("Failed to fetch or match machinerunlogs", error);
      }
    };

    fetchRunLogsAndSetStackValues();
  }, [selectedMachine, selectedVariant, machines, variants]);

  // apply recent logs
  const applyRecentLog = async (log) => {
    console.log("🟡 APPLY RECENT LOG START:", log);
    setSkipAutoFetch(true);

    const matchedMachine = machines.find((m) => m.name === log.machine_name);
    if (!matchedMachine) {
      console.warn("❌ Machine not found:", log.machine_name);
      alert("Machine not found. Cannot apply log.");
      return;
    }

    console.log("✅ Matched Machine ID:", matchedMachine.id);
    setSelectedMachine(matchedMachine.id);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/machines/${matchedMachine.id}/`
      );
      const machineData = await res.json();
      const allVariants = machineData.variants || [];

      setVariants(allVariants);
      console.log(
        "📦 Variants received:",
        allVariants.map((v) => v.name)
      );

      const matchedVariant = allVariants.find(
        (v) => v.name === log.variant_name
      );
      if (matchedVariant) {
        setSelectedVariant(matchedVariant.id);
        console.log("✅ Matched Variant ID:", matchedVariant.id);
      } else {
        console.warn("❌ Variant not found:", log.variant_name);
      }

      setMinStackSize(String(log.min_stack_size || ""));
      setMaxStackSize(String(log.max_stack_size || ""));
      setMinStackLength(String(log.min_stack_length || ""));
      setMaxStackLength(String(log.max_stack_length || ""));

      console.log("✅ Stack values set:", {
        minStackSize: log.min_stack_size,
        maxStackSize: log.max_stack_size,
        minStackLength: log.min_stack_length,
        maxStackLength: log.max_stack_length,
      });

      alert("✅ Applied successfully!");
    } catch (err) {
      console.error("❌ Error in applyRecentLog:", err);
      alert("❌ Failed to apply log.");
    }
  };

  // SSE stream
  React.useEffect(() => {
    if (!selectedMachine) return;

    const sseUrl = `http://localhost:8000/api/machines/${selectedMachine}/sse/`;
    console.log("📡 Connecting to SSE:", sseUrl);

    // Reset values when switching machines
    setRealtimeData({
      estimated_stack_length: 0,
      estimated_stack_count: 0,
      total_frame_processed: 0,
      total_frame_rejected: 0,
    });

    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      console.log("📨 SSE Message Received:", event.data);

      try {
        const data = JSON.parse(event.data);

        setRealtimeData((prev) => ({
          estimated_stack_length: data.estimated_stack_length,
          estimated_stack_count: data.estimated_stack_count,
          total_frame_processed: prev.total_frame_processed + 1,
          total_frame_rejected: prev.total_frame_rejected + (data.is_rejected ? 1 : 0),
        }));
      } catch (err) {
        console.error("🚫 SSE JSON parse error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("❌ SSE error:", err);
      eventSource.close();
    };

    return () => {
      console.log("🔌 Closing SSE connection");
      eventSource.close();
    };
  }, [selectedMachine]);

  // handle favourites
  // const handleFavorite = () => {
  //   if (
  //     selectedMachine &&
  //     minStackSize !== undefined &&
  //     minStackSize !== null &&
  //     maxStackSize !== undefined &&
  //     maxStackSize !== null &&
  //     minStackLength !== undefined &&
  //     minStackLength !== null &&
  //     maxStackLength !== undefined &&
  //     maxStackLength !== null
  //   ) {
  //     const favoriteSetting = {
  //       machine: selectedMachine,
  //       minStackSize: String(minStackSize), // Ensure consistent string type for comparison
  //       maxStackSize: String(maxStackSize),
  //       minStackLength: String(minStackLength),
  //       maxStackLength: String(maxStackLength),
  //     };

  //     // Check if this favorite setting already exists in the favorites array
  //     const isDuplicate = favorites.some(
  //       (fav) =>
  //         fav.machine === favoriteSetting.machine &&
  //         fav.minStackSize === favoriteSetting.minStackSize &&
  //         fav.maxStackSize === favoriteSetting.maxStackSize &&
  //         fav.minStackLength === favoriteSetting.minStackLength &&
  //         fav.maxStackLength === favoriteSetting.maxStackLength
  //     );

  //     if (!isDuplicate) {
  //       setFavorites((prev) => [...prev, favoriteSetting]);
  //       // setFavoritesOpen(true);
  //     } else {
  //       alert("This setting is already in your favorites.");
  //     }
  //   } else {
  //     alert(
  //       "Please ensure all input fields are filled before adding to favorites."
  //     );
  //   }
  // };

  // React.useEffect(() => {
  //   const eventSource = new EventSource(
  //     "http://localhost:8000/home/image-stream"
  //   );

  //   // eventSource.onmessage = (event) => {
  //   //   const imageUrl = event.data;
  //   //   setImageUrls((prevUrls) => [...prevUrls, imageUrl]);
  //   // };

  //   eventSource.onerror = (error) => {
  //     console.error("SSE error:", error);
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  const handleSubmit = async (actionType) => {
    if (!selectedMachine) {
      alert("Please select a machine.");
      return;
    }
    // For 'start', validate that required fields are filled
    if (actionType === "start") {
      if (
        !selectedVariant ||
        !minStackSize ||
        !maxStackSize ||
        !minStackLength ||
        !maxStackLength
      ) {
        alert("Please fill in all fields before starting the machine.");
        return;
      }
    }

    const endpoint = `http://127.0.0.1:8000/api/machines/${selectedMachine}/${actionType}_run/`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          actionType === "start"
            ? JSON.stringify({
                machine: selectedMachine,
                variant: selectedVariant,
                min_stack_length: Number(minStackLength),
                max_stack_length: Number(maxStackLength),
                min_stack_size: Number(minStackSize),
                max_stack_size: Number(maxStackSize),
              })
            : null, // 'stop' API doesn't need a body
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      console.log("Machine Control Response:", data);
      setStatus(actionType === "start" ? "running" : "stopped");
    } catch (err) {
      console.error("Control Error:", err);
      alert(err.message || "Failed to control machine.");
    }

    // fetch("http://localhost:8000/machine/control", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     action: actionType, // for now we are only sending the action type later on we can send the input val as well
    //   }),
    // })
    //   .then((res) => {
    //     if (!res.ok) {
    //       return res.json().then((err) => {
    //         throw new Error(err.detail || "Something went wrong");
    //       });
    //     }
    //     return res.json();
    //   })
    //   .then((data) => {
    //     console.log("Machine Control Response:", data);
    //     setStatus(actionType === "start" ? "running" : "stopped");
    //   })
    //   .catch((err) => {
    //     console.error("Control Error:", err);
    //     alert(err.message || "Failed to control machine.");
    //   });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "80vh",
        padding: 2,
        bgcolor: "rgb(209, 233, 237)",
      }}
    >
      <Grid container spacing={1.5} sx={{ height: "100%" }}>
        {/* Left side - Image + Header */}
        <Grid item xs={12} md={8} sx={{ height: "100%" }}>
          <StyledPaper
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: 0.5,
              height: "100%",
              backgroundColor: "#f5f5f5",
              boxShadow: "0 4px 20px rgba(196, 201, 255, 0.08)",
              borderRadius: 3,
            }}
          >
            {/* Header */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                paddingTop: 0.5,
              }}
            >
              {stackData.map((item, index) => (
                <Tooltip key={index} title={item.tooltip} arrow>

                  <Box
                    sx={{
                      flex: 1,
                      background: `linear-gradient(135deg, ${item.bg})`,
                      color: "#fff",
                      padding: 1.5,
                      marginX: 0.5,
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      cursor: "default",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        marginBottom: 0.5,
                        fontWeight: 600,
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{item.title}</span>
                      {item.icon}
                    </Box>
                    <span style={{ fontSize: "1.1rem" }}>{item.value}</span>
                  </Box>
                </Tooltip>
              ))}

              {/* Machine Variant Dropdown */}
              <Box
                sx={{
                  flex: 1.2,
                  marginX: 0.5,
                  paddingY: 1.5, 
                  borderRadius: 2,
                  background: "linear-gradient(40deg, #e0f7fa, #b2ebf2)",
                  color: "#00695c",               
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
                  textAlign: "center",
                  // gap: 1,
                  // borderRadius: 2,
                }}
              >
                {/* Machine dropdown */}
                <TextField
                  fullWidth
                  select
                  label="Choose Machine"
                  value={selectedMachine}
                  onChange={(e) => {      setSelectedMachine(e.target.value);
                  
                  }}
                  size="small" 
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#ccc",
                        boxShadow: "none",
                      },
                    },
                    "& label.Mui-focused": {
                      color: "#00695c",
                    },
                  }}        
                >
                  <MenuItem value="">Select</MenuItem>
                  {machines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.id}>
                      {machine.name}
                    </MenuItem>
                  ))}
                  {isLoadingMachines && (
                    <MenuItem disabled>
                      <em>Loading more machines...</em>
                    </MenuItem>
                  )}
                </TextField>

                {/* Variant dropdown */}
                {/* <TextField
                  fullWidth
                  select
                  label="Choose Variant"
                  value={selectedVariant}
                  onChange={handleVariantChange}
                  size="small"
                  disabled={!selectedMachine}
                
                >
                  <MenuItem value="">Select</MenuItem>
                  {variants.map((variant) => (
                    <MenuItem key={variant.id} value={variant.id}>
                      {variant.name}
                    </MenuItem>
                  ))}
                  {isLoadingVariants && (
                    <MenuItem disabled>
                      <em>Loading more variants...</em>
                    </MenuItem>
                  )}
                </TextField> */}
                
              </Box>

            </Box>

            {/* Image section */}

            <LiveImageFeed imageArray={imageUrls} />
          </StyledPaper>
        </Grid>

        {/* Right Side - Logs and Controls */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* Live Updates */}

          <StyledPaper sx={{ flex: 7, overflowY: "auto", bgcolor: "#f5f5f5" }}>
            <Box sx={{ mb: -1 }}>
              <Typography variant="h6" component="h4" gutterBottom>
                Live Updates
              </Typography>
            </Box>
            <Box>
              {messages.length > 0 ? (
                <List disablePadding>
                  {messages.map((msg, index) => (
                    <ListItem
                      key={index}
                      sx={{ padding: "8px 0", alignItems: "flex-start" }}
                    >
                      <ListItemAvatar sx={{ minWidth: "auto", mr: 1, mt: 0.5 }}>
                        <FiberManualRecordIcon
                          sx={{ fontSize: "1.2em", color: "primary.main" }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2">{msg}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  sx={{
                    padding: (theme) => theme.spacing(2),
                    textAlign: "center",
                    color: "text.secondary",
                    fontStyle: "italic",
                  }}
                  variant="subtitle2"
                >
                  No updates yet...
                </Typography>
              )}
            </Box>
          </StyledPaper>

          {/* Machine Control */}

          <StyledPaper sx={{ flex: 3, p: 2, mt: 2, bgcolor: "#f5f5f5" }}>
            <Box
              sx={{
                display: "flex",
                marginLeft: 0.3,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Machine Control
              </Typography>

              {/* add to favourite */}
              {/* <span
                title="add to favorites"
                style={{
                  marginRight: "2rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  padding: "0.5rem",
                  transition:
                    "background-color 0.3s ease-in-out, transform 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(38, 74, 193, 0.1)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={handleFavorite}
              >
                <StarIcon />
              </span> */}
            </Box>

            {/* form submit handler */}
            <form onSubmit={(e) => e.preventDefault()}>
              <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  select
                  label="Choose Machine"
                  value={selectedMachine}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                  size="small"
                  // SelectProps={{
                  //   MenuProps: {
                  //     PaperProps: {
                  //       style: { maxHeight: 300 },
                  //       onScroll: (event: React.UIEvent<HTMLDivElement>) => {
                  //         const bottom =
                  //           event.currentTarget.scrollHeight -
                  //             event.currentTarget.scrollTop <=
                  //           event.currentTarget.clientHeight * 1.25;

                  //         if (bottom) {
                  //           loadMoreMachines();
                  //         }
                  //       },
                  //     },
                  //   },
                  // }}
                >
                  <MenuItem value="">Select Machine</MenuItem>
                  {/* <MenuItem value="machine1">Machine 1</MenuItem>
                  <MenuItem value="machine2">Machine 2</MenuItem>
                  <MenuItem value="machine3">Machine 3</MenuItem>
                  <MenuItem value="machine4">Machine 4</MenuItem> */}
                  {machines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.id}>
                      {machine.name}
                    </MenuItem>
                  ))}
                  {isLoadingMachines && (
                    <MenuItem disabled>
                      <em>Loading more machines...</em>
                    </MenuItem>
                  )}
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Choose Variant"
                  value={selectedVariant}
                  onChange={handleVariantChange}
                  size="small"
                  disabled={!selectedMachine}
                  // SelectProps={{
                  //   MenuProps: {
                  //     PaperProps: {
                  //       style: { maxHeight: 300 },
                  //       onScroll: (event: React.UIEvent<HTMLDivElement>) => {
                  //         const bottom =
                  //           event.currentTarget.scrollHeight -
                  //             event.currentTarget.scrollTop <=
                  //           event.currentTarget.clientHeight * 1.25;

                  //         if (bottom) {
                  //           loadMoreVariants();
                  //         }
                  //       },
                  //     },
                  //   },
                  // }}
                >
                  <MenuItem value="">Select Variant</MenuItem>
                  {/* <MenuItem value="variant1">Variant 1</MenuItem>
                  <MenuItem value="variant2">Variant 2</MenuItem> */}
                  {variants.map((variant) => (
                    <MenuItem key={variant.id} value={variant.id}>
                      {variant.name}
                    </MenuItem>
                  ))}
                  {isLoadingVariants && (
                    <MenuItem disabled>
                      <em>Loading more variants...</em>
                    </MenuItem>
                  )}
                </TextField>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Stack Size"
                  value={minStackSize}
                  onChange={(e) => setMinStackSize(e.target.value)}
                  placeholder="e.g. 10"
                  size="small"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Max Stack Size"
                  value={maxStackSize}
                  onChange={(e) => setMaxStackSize(e.target.value)}
                  placeholder="e.g. 50"
                  size="small"
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Stack Length"
                  value={minStackLength}
                  onChange={(e) => setMinStackLength(e.target.value)}
                  placeholder="e.g. 10mm"
                  size="small"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Max Stack Length"
                  value={maxStackLength}
                  onChange={(e) => setMaxStackLength(e.target.value)}
                  placeholder="e.g. 100mm"
                  size="small"
                />
              </Box>

              <Box>
                {status === "stopped" ? (
                  <button
                    type="button"
                    onClick={() => handleSubmit("start")}
                    style={{
                      width: "100%",
                      padding: 12,
                      // backgroundColor: "green",
                      background: "linear-gradient(135deg, #00b09b, #96c93d)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 8,
                      textAlign: "center",
                      boxShadow: "none !important",
                      fontSize: "1rem",
                      fontFamily: "Arial, sans-serif",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Start
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubmit("stop")}
                    style={{
                      width: "100%",
                      padding: 12,
                      // backgroundColor: "red",
                      background: "linear-gradient(135deg, #FF416C, #FF4B2B)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 8,
                      textAlign: "center",
                      boxShadow: "none !important",
                      fontSize: "1rem",
                      fontFamily: "Arial, sans-serif",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Stop
                  </button>
                )}
              </Box>
            </form>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* recent activities*/}
      <RecentActivitiesDialog
        open={recentDialogOpen}
        handleClose={closeRecentDialog}
        onApplyLog={applyRecentLog}
      />
    </Box>
  );
}
