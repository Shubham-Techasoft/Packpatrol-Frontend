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
  SelectChangeEvent,
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
import {base_URL} from '../utils/api';

import { useMachineSelection } from "../MachineSelectionContext";

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

type AppliedLog = {
  machine_name: string;
  variant_name: string;
  min_stack_size: number | string;
  max_stack_size: number | string;
  min_stack_length: number | string;
  max_stack_length: number | string;
};

type HomeProps = {
  recentDialogOpen: boolean;
  closeRecentDialog: () => void;
  appliedLog: AppliedLog | null;
  clearAppliedLog: () => void;
};

export default function Home({ recentDialogOpen, closeRecentDialog, appliedLog, clearAppliedLog }: HomeProps) {
  // const [imageUrls, setImageUrls] = React.useState([]);
  const [imageUrls, setImageUrls] = React.useState<string>("");
  const [messages, setMessages] = React.useState(logMessages);
  const { selectedMachineId, setSelectedMachineId } = useMachineSelection();
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
  const [isMachineRunning, setIsMachineRunning] = React.useState(false);
  const [baseDirPath, setBaseDirPath] = React.useState("");
  const [skipMachineEffect, setSkipMachineEffect] = React.useState(false);

  // 1) Add state/refs near other state
  const frameQueueRef = React.useRef<string[]>([]); // holds fully-loaded frame srcs
  const [displaySrc, setDisplaySrc] = React.useState<string | null>(null); // current frame shown

  // SSE connection states
  const [sseConnection, setSseConnection] = React.useState<EventSource | null>(null);
  const [isSseConnected, setIsSseConnected] = React.useState(false);
  const [sseError, setSseError] = React.useState<Event | Error | null>(null);
  const lastMessageTimeRef = React.useRef<number | null>(null);

  // IMPORTANT DON'T REMOVE
  React.useEffect(() => {
    console.log("🔄 Syncing selectedMachineId from context:", selectedMachineId);
    setSelectedMachine(selectedMachineId);
  }, [selectedMachineId]);

  const [realtimeData, setRealtimeData] = React.useState({
    estimated_stack_length: 0,
    estimated_stack_count: 0,
    total_frame_processed: 0,
    total_frame_rejected: 0,
    total_passed: 0,
    image_path: "",
    timestamp: "",
  });

  // summary cards at top (sse data)
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
      value: realtimeData.total_passed?.toLocaleString() || "0",
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


  // Simple player loop
  React.useEffect(() => {
    const id = setInterval(() => {
      const q = frameQueueRef.current;

      // More aggressive cleanup - keep only latest frame
      if (q.length > 1) {
        frameQueueRef.current = [q[q.length - 1]];
      }

      const next = frameQueueRef.current.shift();
      if (next) setDisplaySrc(next);
    }, 100);

    return () => clearInterval(id);
  }, []);
  // NEW: unmount cleanup
  React.useEffect(() => {
    return () => {
      frameQueueRef.current = [];
      setDisplaySrc(null);
    };
  }, []);


  React.useEffect(() => {
    if (appliedLog && machines.length > 0) {
      applyRecentLog(appliedLog);
      // clearAppliedLog();
    }
  }, [appliedLog,machines]);

  // initial fetch for machines
  React.useEffect(() => {
    const fetchMachines = async () => {
      setIsLoadingMachines(true);
      try {
        console.log(base_URL)
        const response = await fetch(
          `${base_URL}/api/machines/??is_active=true`
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
    if (!selectedMachine || selectedMachine === "all") {
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

    fetch(`${base_URL}/api/machines/${selectedMachine}/`)
      .then((res) => res.json())
      .then((data) => {
        setVariants(data.variants || []);
        setSelectedVariant(data.active_variant?.id || "");

        setStatus(data.is_running ? "running" : "stopped");

        console.log( "📦 data received:", data );
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
  const handleVariantChange = async (event: SelectChangeEvent<string>) => {
    const newVariantId = event.target.value;
    setSelectedVariant(newVariantId);

    try {
      const machineRes = await fetch(
        `${base_URL}/api/machines/${selectedMachine}/`
      );
      const machineData = await machineRes.json();

      const payload = {
        variant_id: newVariantId,
        camera_id: machineData.camera?.id,
        variant_ids: machineData.variants.map((v: Variant) => v.id),
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
        `${base_URL}/api/machines/${selectedMachine}/switch_variant/`,
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
      if (!selectedMachine || !selectedVariant) {
        setMinStackSize("");
        setMaxStackSize("");
        setMinStackLength("");
        setMaxStackLength("");
        return;
      }

      if (skipAutoFetch) {
        console.log("⏭ Skipping auto-fetch due to applyRecentLog");
        // setSkipAutoFetch(false); Reset after one skip
        return;
      }

      try {
        const res = await fetch(`${base_URL}/api/machinerunlogs/`);
        const data = await res.json();

        // Find selected machine and variant names
        const machine = machines.find((m) => m.id === selectedMachine);
        const variant = variants.find((v) => v.id === selectedVariant);

        if (!machine || !variant) {
          setMinStackSize("");
          setMaxStackSize("");
          setMinStackLength("");
          setMaxStackLength("");
          return;
        }

        // Find matching log
        const matchingLog = data.find(
          (log:any) =>
            log.machine_name === machine.name &&
            log.variant_name === variant.name
        );

        if (matchingLog) {
          setMinStackSize(matchingLog.min_stack_size);
          setMaxStackSize(matchingLog.max_stack_size);
          setMinStackLength(matchingLog.min_stack_length);
          setMaxStackLength(matchingLog.max_stack_length);
        } else {
          setMinStackSize("");
          setMaxStackSize("");
          setMinStackLength("");
          setMaxStackLength("");
        }
      } catch (error) {
        console.error("Failed to fetch or match machinerunlogs", error);
        setMinStackSize("");
        setMaxStackSize("");
        setMinStackLength("");
        setMaxStackLength("");
      }
    };

    fetchRunLogsAndSetStackValues();
  }, [selectedMachine, selectedVariant, machines, variants, skipAutoFetch]);

  // apply recent logs
  const applyRecentLog = async (log: any) => {
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
        `${base_URL}/api/machines/${matchedMachine.id}/`
      );
      const machineData = await res.json();
      const allVariants = machineData.variants || [];

      setVariants(allVariants);
      console.log(
        "📦 Variants received:",
        allVariants.map((v: Variant) => v.name)
      );

      const matchedVariant = allVariants.find(
        (v: Variant) => v.name === log.variant_name
      );
      if (matchedVariant) {
        setSelectedVariant(matchedVariant.id);

      //   console.log("✅ Matched Variant ID:", matchedVariant.id);
      // } else {
      //   console.warn("❌ Variant not found:", log.variant_name);
      // }

      setTimeout(() =>{
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
      clearAppliedLog();
    },50);
  }

      alert("✅ Applied successfully!");
    } catch (err) {
      console.error("❌ Error in applyRecentLog:", err);
      alert("❌ Failed to apply log.");
    }
  };


  // fetch variants after selecting machines - UPDATED VERSION
  React.useEffect(() => {
    if (!selectedMachine || selectedMachine === "all") {
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

    fetch(`${base_URL}/api/machines/${selectedMachine}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch machine details: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setVariants(data.variants || []);
        setSelectedVariant(data.active_variant?.id || "");

        // More robust status checking from backend
        setStatus(data.is_running === true ? "running" : "stopped");
        setIsMachineRunning(data.is_running === true);

        console.log("📦 Machine data received:", data);
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
        alert(`❌ Failed to load machine details: ${err.message}`);
      })
      .finally(() => setIsLoadingVariants(false));
  }, [selectedMachine]);



  // sse endpoint
  const latestDataRef = React.useRef({
    estimated_stack_length: 0,
    estimated_stack_count: 0,
    total_frame_processed: 0,
    total_frame_rejected: 0,
    total_passed: 0,
    image_path: "",
    timestamp: "",
  });

  // const updateTimeoutRef = React.useRef(null);
  const updateTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const messageCountRef = React.useRef(0);

  // REPLACE your existing useEffect with this enhanced version:
  // SSE connection management - REPLACE your existing useEffect with this:
  React.useEffect(() => {
    // If no machine selected OR machine is stopped, clean up SSE connection
    // Reset timer when effect runs
    lastMessageTimeRef.current = null;

    if (!selectedMachine || selectedMachine === "all" || status !== "running") {
      console.log("🛑 Cleaning up SSE connection - machine stopped or no machine selected");
      
      if (sseConnection) {
        sseConnection.close();
        setSseConnection(null);
      }
      setIsSseConnected(false);
      setSseError(null);
      setDisplaySrc(null);
      
      // Reset realtime data when machine stops
      setRealtimeData({
        estimated_stack_length: 0,
        estimated_stack_count: 0,
        total_frame_processed: 0,
        total_frame_rejected: 0,
        total_passed: 0,
        image_path: "",
        timestamp: "",
      });
      
      return;
    }

    const sseUrl = `${base_URL}/api/machines/${selectedMachine}/sse/`;
    console.log("📡 Connecting to SSE:", sseUrl);

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    const reconnectDelay = 5000;
    let eventSource: EventSource | null = null;

    const connectSSE = () => {
      try {
        // Close existing connection if any
        if (eventSource) {
          eventSource.close();
        }

        eventSource = new EventSource(sseUrl);
        setSseConnection(eventSource);
        setSseError(null);

        eventSource.onopen = (event) => {
          console.log("✅ SSE connection opened:", event);
          setIsSseConnected(true);
          reconnectAttempts = 0;
        };

        eventSource.onmessage = (event) => {
          try {
            const now = performance.now();
            if (lastMessageTimeRef.current) {
              const interval = now - lastMessageTimeRef.current;
              console.log(`[Perf] 📨 SSE message received. Interval since last: ${interval.toFixed(2)}ms.`);
            } else {
              console.log(`[Perf] 📨 First SSE message received.`);
            }
            lastMessageTimeRef.current = now;

            const data = JSON.parse(event.data);
            messageCountRef.current++;
            console.log("DATA:", data);

            // Update realtime data only if machine is still running
            if (status === "running") {
              let cleanImagePath = "";
              if (data.image_path) {
                console.log("🖼️ Raw image path from SSE:", data.image_path);
                let basePath = data.image_path.split("?")[0];
                cleanImagePath = basePath.replace(/\\/g, "/");
              }

              latestDataRef.current = {
                estimated_stack_length: data.estimated_stack_length ?? latestDataRef.current.estimated_stack_length,
                estimated_stack_count: data.estimated_stack_count ?? latestDataRef.current.estimated_stack_count,
                total_passed: data.total_passed ?? latestDataRef.current.total_passed,
                total_frame_rejected: data.total_frame_rejected ?? data.total_rejected ?? latestDataRef.current.total_frame_rejected,
                image_path: cleanImagePath || latestDataRef.current.image_path,
                timestamp: data.timestamp ?? latestDataRef.current.timestamp,
                total_frame_processed: (data.total_passed ?? latestDataRef.current.total_passed) +
                                      (data.total_frame_rejected ?? latestDataRef.current.total_frame_rejected),
              };

              if (cleanImagePath) {
                setDisplaySrc(cleanImagePath);
                latestDataRef.current.image_path = cleanImagePath;
              }

              if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
              }

              updateTimeoutRef.current = setTimeout(() => {
                setRealtimeData({ ...latestDataRef.current });
                updateTimeoutRef.current = null;
              }, 250);
            }
          } catch (err) {
            console.error("🚫 SSE JSON parse error:", err);
          }
        };

        eventSource.onerror = (error) => {
          console.error("❌ SSE connection error:", error);
          setIsSseConnected(false);
          setSseError(error);

          if (eventSource?.readyState === EventSource.CLOSED) {
            console.warn("🔌 SSE connection closed by server.");
          } else if (eventSource?.readyState === EventSource.CONNECTING) {
            console.warn("🔄 SSE reconnecting...");
          }

          // Only attempt reconnect if machine is still running
          if (status === "running" && reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            console.log(`🔄 Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts}) in ${reconnectDelay}ms...`);
            setTimeout(connectSSE, reconnectDelay);
          } else {
            console.error("❌ Max reconnection attempts reached or machine stopped");
          }
        };

      } catch (error: unknown) {
        console.error("❌ Failed to create SSE connection:", error);
        if (error instanceof Error) {
          setSseError(error);
        } else {
          setSseError(new Error('An unknown error occurred during SSE connection'));
        }
        setIsSseConnected(false);
      }
    };

    connectSSE();

    // Cleanup function
    return () => {
      console.log("🛑 Cleaning up SSE connection");
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
      if (eventSource) {
        eventSource.close();
        setSseConnection(null);
      }
      setIsSseConnected(false);
      setSseError(null);
    };
  }, [selectedMachine, status]); // Depend on both selectedMachine AND status

  // // Add a new useEffect for polling machine status
  // React.useEffect(() => {
  //   if (status !== "running" || !selectedMachine || selectedMachine === "all") {
  //     return; // Don't poll if not running or no machine selected
  //   }

  //   const checkStatus = async () => {
  //     try {
  //       const response = await fetch(`${base_URL}/api/machines/${selectedMachine}/process_status/`);
  //       console.log(response);
  //       if (!response.ok) {
  //         // Don't stop on transient network errors, just log them.
  //         console.warn("Could not verify machine status, will retry.", response.statusText);
  //         return;
  //       }
  //       const data = await response.json();

  //       if (data.is_running === false) {
  //         console.warn("Machine process stopped unexpectedly on the backend. Syncing UI.");
  //         setStatus("stopped");
  //         setIsMachineRunning(false);
  //         alert("Machine stopped unexpectedly. The UI has been updated.");
  //       }
  //     } catch (error) {
  //       console.error("Error polling machine status:", error);
  //     }
  //   };

  //   const intervalId = setInterval(checkStatus, 5000); // Check every 5 seconds

  //   return () => clearInterval(intervalId); // Cleanup on component unmount or when dependencies change
  // }, [selectedMachine, status]);

  const getSseConnectionStatus = () => {
    if (status !== "running" || !selectedMachine || selectedMachine === "all") {
      return "disconnected";
    }
    if (sseError) return "error";
    if (isSseConnected && displaySrc) return "receiving_frames";
    if (isSseConnected) return "connected";
    return "connecting";
  };

  // Optional: Add this useEffect to monitor state changes (for debugging)
  // React.useEffect(() => {
  //   console.log("🎯 RealtimeData state updated:", realtimeData);
  // }, [realtimeData]);

  // handle submit
  const handleSubmit = async (actionType: string) => {
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

    const endpoint = `${base_URL}/api/machines/${selectedMachine}/${actionType}_run/`;
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
            : null,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Something went wrong.");
      }

      console.log("Machine Control Response:", data);
      
      // Update status based on API response
      if (actionType === "start") {
        // Check if machine is running from response
        if (data.is_running === true) {
          setStatus("running");
          setIsMachineRunning(true);
          console.log("✅ Machine started successfully");
          alert("✅ Machine started successfully!");
        } else {
          // This shouldn't happen but handle it anyway
          console.warn("⚠️ Start API call succeeded but is_running is false");
          alert("⚠️ Machine start command sent, but status is unclear. Please check machine status.");
          setStatus("stopped"); // Assume it's stpped since API succeeded but status is unclear
          setIsMachineRunning(false);
        }
      } else {
        // For stop action
        if (data.is_running === false || data.process_stopped === true || data.status === "stopped_successfully" || data.status === "already_stopped") {
          setStatus("stopped");
          setIsMachineRunning(false);
          setDisplaySrc(null);
          
          // Clear realtime data immediately
          setRealtimeData({
            estimated_stack_length: 0,
            estimated_stack_count: 0,
            total_frame_processed: 0,
            total_frame_rejected: 0,
            total_passed: 0,
            image_path: "",
            timestamp: "",
          });
          console.log("✅ Machine stopped successfully");
          
          // Show appropriate success message
          if (data.status === "already_stopped") {
            alert("ℹ️ Machine was already stopped.");
          } else {
            alert("✅ Machine stopped successfully!");
          }
        } else {
          console.warn("⚠️ Stop API call succeeded but machine might still be running");
          alert("⚠️ Stop command sent, but machine status is unclear. Please check machine status.");
          setStatus("stopped"); // Assume it's stopped since API succeeded
          setIsMachineRunning(false);
        }
      }
    } catch (err: unknown) {
      console.error("Control Error:", err);
      let errorMessage = "Failed to control machine.";
      
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      
      alert(`❌ ${errorMessage}`);
    }
  };

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
  //     `${base_URL}/home/image-stream`
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

  return (
    <Box
      sx={{
        flexGrow: 1,
        // height: "80vh",
        padding: 2,
        bgcolor: "rgb(209, 233, 237)",
        mb: {sx: 18, sm: 0},
        height: {sx:"100%", md: "80vh"}
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
                flexDirection: { xs: 'column', sm: 'row' },
              }}
              >
              <Box
                sx={{
                  // 2 columns
                  // 2 rows in small screen
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr 1fr" },
                  gridTemplateRows: { xs: "auto auto", sm: "auto" },
                  gap: 1,
                  flex: 3,
                  paddingX: 1,
                  paddingY: 0.5,
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
              </Box>

              {/* Machine Variant Dropdown */}
              <Box
                sx={{
                  flex: 1.2,
                  marginX: 0.5,
                  paddingY: 1.5,
                  borderRadius: 2,
                  // background: "linear-gradient(40deg, #e0f7fa, #b2ebf2)",
                  color: "#00695c",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  // gap: 1,
                  // borderRadius: 2,
                  width: { xs: "92%", sm: "auto" },
                }}
              >
                {/* Machine dropdown */}
                <TextField
                  fullWidth
                  select
                  label="Choose Machine"
                  value={selectedMachine || ""}
                  onChange={(e) => {
                    setSelectedMachine(e.target.value);
                    setSelectedMachineId(e.target.value);
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
            <LiveImageFeed
              status={status}
              imagePath={status === "stopped" ? null : displaySrc}
              connectionStatus={getSseConnectionStatus()}
            />

          </StyledPaper>
        </Grid>

        {/* Right Side - Logs and Controls */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ height: "75vh", display: "flex", flexDirection: "column",}}
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

          <StyledPaper sx={{ flex: 3, p: 2, mt: 2, bgcolor: "#f5f5f5", mb: {xs: 5, sm: 5, md: 0} }}>
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
              <Box sx={{ mb: 2, display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" },}}>
                <TextField
                  fullWidth
                  select
                  label="Choose Machine"
                  value={selectedMachine}
                  onChange={(e) => {setSelectedMachine(e.target.value)
                    setSelectedMachineId(e.target.value)}}
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
                  sx={{
                  width: "100%",
                  }}
                >
                  <MenuItem value="">Select Machine</MenuItem>
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
                  label="Variant"
                  value={selectedVariant as string}
                  onChange={handleVariantChange}
                  size="small"
                  disabled={!selectedMachine}
                >
                  <MenuItem value="">Select Variant</MenuItem>
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
