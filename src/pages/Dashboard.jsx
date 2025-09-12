import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Assessment,
  LiveTv,
  Engineering,
  WarningAmber,
  PlayArrow,
  Stop,
  RestartAlt,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);
import axios from "axios";
import Stack from "@mui/material/Stack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MemoryIcon from "@mui/icons-material/Memory";
import { isAuthenticated } from "../utils/auth";
import ScrollToTopButton from "./sections/about/ScrollToTop";

import { useMachineSelection } from "../MachineSelectionContext";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  backgroundColor: "#ffffff",
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const count = payload?.value ?? 0;
  const when = dayjs(label).format("YYYY-MM-DD HH:mm:ss"); // epoch ms -> formatted

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: "#fff",
        border: "1px solid #e0e0e0",
        minWidth: 200,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {when}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Produced: {count.toLocaleString()} biscuits
      </Typography>
    </Paper>
  );
};

// info cards
const InfoCard = ({ icon, title, value, color }) => {
  const gradients = {
    green: "linear-gradient(135deg, #43e97b, #38f9d7)",
    red: "linear-gradient(135deg, #ff0844, #ffb199)",
    blue: "linear-gradient(135deg, #1e3c72, #2a5298)",
    orange: "linear-gradient(135deg, #f7971e, #ffd200)",
  };

  let bgGradient = gradients.green; // default

  if (color === "#f44336") bgGradient = gradients.red;
  else if (color === "#2196f3") bgGradient = gradients.blue;
  else if (color === "#ff9800") bgGradient = gradients.orange;

  return (
    <StyledPaper
      style={{
        background: bgGradient,
        color: "#fff",
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        {/* Glowing icon bubble */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 36 } })}
        </Box>
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ color: "#f0f0f0", fontWeight: 500 }}
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontWeight: "bold", mt: 0.5 }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default function Dashboard() {
  const [restricted, setRestricted] = React.useState(false);
  // const [designation, setDesignation] = React.useState("");
  const [chartData, setChartData] = React.useState([]);
  const [timeFilter, setTimeFilter] = React.useState("24h");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [performanceStats, setPerformanceStats] = React.useState(null);
  const [isStarting, setIsStarting] = React.useState(false);
  const [isStopping, setIsStopping] = React.useState(false);

  //TOP CARDS
  const [machineStatus, setMachineStatus] = React.useState({
    active: 0,
    total: 0,
    liveFeed: "Stopped",
  });

  const [allMachines, setAllMachines] = React.useState([]);
  const [controlLoading, setControlLoading] = React.useState(false);
  const [controlText, setControlText] = React.useState("");
  const [statusMessage, setStatusMessage] = React.useState({
    text: "",
    type: "",
  });
  const [dateRange, setDateRange] = React.useState([null, null]);

  //added for machine filter
  // const [selectedMachineId, setSelectedMachineId] = React.useState("all");
  const { selectedMachineId, setSelectedMachineId } = useMachineSelection();
  const selectedMachine = React.useMemo(
    () =>
      selectedMachineId === "all"
        ? null
        : allMachines.find((m) => String(m.id) === String(selectedMachineId)) ||
          null,
          [selectedMachineId, allMachines]
        );

  //For Future use of starting machine with selected variant and stack parameters
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [status, setStatus] = useState("");
  const [minStackSize, setMinStackSize] = useState("");
  const [maxStackSize, setMaxStackSize] = useState("");
  const [minStackLength, setMinStackLength] = useState("");
  const [maxStackLength, setMaxStackLength] = useState("");
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);

  const fetchPerformanceStats = async () => {
    try {
      const params = {};

      // Machine filter
      if (selectedMachineId !== "all") {
        params.machine_id = selectedMachineId;
      }

      // Date filter
      //console.log(timeFilter)
      //console.log(dateRange)
      if (timeFilter === "Custom" && dateRange[0] && dateRange[1]) {
        params.start_time = dayjs(dateRange[0]).startOf("day").toISOString();
        params.end_time = dayjs(dateRange[1]).endOf("day").toISOString();
      }else if (timeFilter === "7d") {
        params.start_time = dayjs().subtract(7, "day").toISOString();
        params.end_time = dayjs().toISOString();
      } else if (timeFilter === "30d") {
        params.start_time = dayjs().subtract(30, "day").toISOString();
        params.end_time = dayjs().toISOString();
      } else if (timeFilter === "24h") {
        params.start_time = dayjs().subtract(1, "day").toISOString();
        params.end_time = dayjs().toISOString();
      }else if (timeFilter === "all"){
        params.start_time = dayjs().subtract(100, "year").toISOString();
        params.end_time = dayjs().toISOString();
      }

      const res = await axios.get(
        "http://127.0.0.1:8000/api/machinerunlogs/dashboard_summary/",
        { params }
      );
      //console.log("params:", params)
      //console.log("Performace State Recived:", res)

      const stats = res.data.frame_statistics || {};
      setPerformanceStats({
        total_frames: stats.total_frames_processed || 0,
        rejected_frames: stats.total_frames_rejected || 0,
        rejection_rate_percent: stats.overall_rejection_rate || 0,
      });
    } catch (err) {
      console.error("❌ Failed to fetch performance stats:", err);
      setPerformanceStats(null);
    }
  };

  // production-time graph
  React.useEffect(() => {
    const auth = isAuthenticated();
    setRestricted(!auth);
    setLoading(true);

    const now = dayjs();

    Promise.all([
      fetch("http://127.0.0.1:8000/api/machinerunlogs/").then((res) => res.json()),
      fetch("http://127.0.0.1:8000/api/machines/").then((res) => res.json()),
    ])
      .then(([logs, machines]) => {
        console.log("Raw API Data:", logs);
        //console.log("Machines List:", machines);

        // 🔎 Apply time filtering
        const filteredByTime = logs.filter((item) => {
          const itemTime = dayjs(item.start_time);
          if (restricted) return now.diff(itemTime, "hour") <= 24;
          if (timeFilter === "24h") return now.diff(itemTime, "hour") <= 24;
          if (timeFilter === "7d") return now.diff(itemTime, "day") <= 7;
          if (timeFilter === "30d") return now.diff(itemTime, "day") <= 30;
          if (timeFilter === "Custom") {
            const [start, end] = dateRange;
            if (!start || !end) return false;
            const ts = itemTime.valueOf();
            return (
              ts >= dayjs(start).startOf("day").valueOf() &&
              ts <= dayjs(end).endOf("day").valueOf()
            );
          }
          return true;
        });

        // 🔎 Apply machine filtering
        const filtered =
          selectedMachineId !== "all"
            ? filteredByTime.filter(
                (it) =>
                  String(it.machine_id ?? "") === String(selectedMachineId) ||
                  it.machine_name === (selectedMachine?.name ?? "")
              )
            : filteredByTime;

        //console.log("Active Time Filter:", restricted ? "24h (restricted)" : timeFilter);
        console.log(`Filtered Logs (with ${selectedMachine?.name}):`, filtered);
        // after computing filtered
        const rangeIsCustom = timeFilter === "Custom" && dateRange[0] && dateRange[1];

        const customDurationMs = rangeIsCustom
          ? dayjs(dateRange[1]).endOf("day").valueOf() -
            dayjs(dateRange[0]).startOf("day").valueOf()
          : null;

        const shortCustom =
          rangeIsCustom && (customDurationMs) <= 3 * 24 * 60 * 60 * 1000;
        const grouped = {};
        filtered.forEach((item) => {
          const ts = dayjs(item.start_time);

          const key = (restricted || timeFilter === "24h" || shortCustom)
            ? ts.format("YYYY-MM-DD HH:mm:ss")
            : ts.startOf("day").format("YYYY-MM-DD");

          grouped[key] = (grouped[key] || 0) + (item.total_frames_processed || 0);
        });

        // build numeric X
        const chart = Object.entries(grouped).map(([k, production]) => {
          const t = (restricted || timeFilter === "24h" || shortCustom)
            ? dayjs(k, "YYYY-MM-DD HH:mm:ss").valueOf()
            : dayjs(k, "YYYY-MM-DD").valueOf();
          return { t, production };
        });

        setChartData(chart.sort((a, b) => a.t - b.t));
        setLoading(false);

        // 🟢 Machine stats
        const activeMachines = new Set();
        logs.forEach((log) => {
          if (log.is_running) activeMachines.add(log.machine_name);
        });

        setMachineStatus({
          active: activeMachines.size,
          total: machines.length,
          liveFeed: activeMachines.size > 0 ? "Running" : "Stopped",
        });
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        setLoading(false);
      });

    // 📊 Fetch performance stats separately
    fetchPerformanceStats()

  }, [timeFilter, restricted, selectedMachineId, dateRange, selectedMachine]);

  // fetch variants when machine changes
  useEffect(() => {
    if (selectedMachineId === "all" || !selectedMachineId) {
      setVariants([]);
      setSelectedVariant("");
      setStatus("");
      setMinStackSize("");
      setMaxStackSize("");
      setMinStackLength("");
      setMaxStackLength("");
      return;
    }
    setIsLoadingVariants(true);
    fetch(`http://127.0.0.1:8000/api/machines/${selectedMachineId}/`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data.variants) ? data.variants : [];
        setVariants(list);

        // Prefer explicit active flag, then backend's active_variant id, then fallback
        const activeByFlag = list.find((v) => v.is_active === true);
        const fromActiveObj = data.active_variant?.id ?? null;
        //console.log("Variant Selected:", activeByFlag);

        if (activeByFlag) {
          setSelectedVariant(activeByFlag.id); // pick variant with is_active true
        } else if (fromActiveObj) {
          setSelectedVariant(fromActiveObj); // pick backend-declared active_variant
        } else {
          setSelectedVariant(""); // none active, force user selection
        }

        setStatus(data.is_running ? "running" : "stopped");

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
  }, [selectedMachineId]);

  // dashbaord summary real time update
  const fetchRecentActivityLogs = async () => {
    const startTime = dayjs().subtract(24, "hour").toISOString();
    const endTime = dayjs().toISOString();

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/machinerunlogs/dashboard_summary/",
        {
          params: {
            start_time: startTime,
            end_time: endTime,
          },
        }
      );

      setLogs(res.data.recent_runs || []);
    } catch (error) {
      console.error("❌ Error fetching dashboard summary logs:", error);
      console.error("Response data:", error?.response?.data);
      console.error("Status:", error?.response?.status);
      console.error("Request URL:", error?.config?.url);
      console.error("Start Time:", startTime);
      console.error("End Time:", endTime);
    } finally {
      setLoading(false);
    }
  };

  // dashboard summary
  React.useEffect(() => {
    fetchRecentActivityLogs();
  }, []);

  // machine details
  const fetchMachinesWithRunLogInfo = async () => {
    try {
      // Step 1: Get all machines
      const machinesRes = await fetch("http://127.0.0.1:8000/api/machines/");
      const machines = await machinesRes.json();

      // Step 2: Get all machine run logs
      const logsRes = await fetch("http://127.0.0.1:8000/api/machinerunlogs/");
      const runLogs = await logsRes.json();

      // Step 3: Fetch camera + variants per machine
      const enrichedMachines = await Promise.all(
        machines.map(async (machine) => {
          const detailRes = await fetch(
            `http://127.0.0.1:8000/api/machines/${machine.id}/`
          );
          const detailData = await detailRes.json();

          const latestLog = runLogs
            .filter((log) => log.machine_name === machine.name)
            .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))[0];

          return {
            ...machine,
            ...detailData, // includes camera, variants, etc.
            min_stack_length: latestLog?.min_stack_length ?? null,
            max_stack_length: latestLog?.max_stack_length ?? null,
            min_stack_size: latestLog?.min_stack_size ?? null,
            max_stack_size: latestLog?.max_stack_size ?? null,
            is_running: latestLog?.is_running ?? false,
          };
        })
      );

      //console.log("✅ Enriched machines:", enrichedMachines);
      setAllMachines(enrichedMachines);

      const activeCount = enrichedMachines.filter((m) => m.is_running).length;

      setMachineStatus({
        active: activeCount,
        total: enrichedMachines.length,
        liveFeed: activeCount > 0 ? "Running" : "Stopped",
      });
    } catch (err) {
      console.error("❌ Failed to fetch machine data with stack info:", err);
    }
  };

  // fetch full machine details
  React.useEffect(() => {
    fetchMachinesWithRunLogInfo();
  }, []);

  // handle date filter for summary
  const handleDateFilter = () => {
    if (!dateRange[0] || !dateRange[1]) return;

    const startTime = dayjs(dateRange[0]).startOf("day").toISOString();
    const endTime = dayjs(dateRange[1]).endOf("day").toISOString();

    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/machinerunlogs/dashboard_summary/", {
        params: {
          start_time: startTime,
          end_time: endTime,
        },
      })
      .then((res) => {
        setLogs(res.data.recent_runs || []);
      })
      .catch((error) => {
        console.error("❌ Error fetching filtered logs:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //  groupedLogs
  const groupedLogs = logs.reduce((acc, log) => {
    const dateKey = dayjs(log.stop_time || log.start_time).format(
      "MMM D, YYYY"
    );
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
    return acc;
  }, {});

  // start all machine
  const handleStartAllMachines = async () => {
    setControlText("starting");
    setIsStarting(true);
    setControlLoading(true);
    //console.log("🟢 Sending start command to all machines ...");

    let successCount = 0;

    try {
      if (!allMachines || allMachines.length === 0) {
        setStatusMessage({
          text: "⚠️ No machines available to start.",
          type: "warning",
        });
        setTimeout(() => {
          setStatusMessage({ text: "", type: "" });
        }, 4000);
        return;
      }

      for (const machine of allMachines) {
        const hasCamera = !!machine.camera?.id;
        const hasVariants =
          Array.isArray(machine.variants) && machine.variants.length > 0;
        const hasStackParams =
          machine.min_stack_length != null &&
          machine.max_stack_length != null &&
          machine.min_stack_size != null &&
          machine.max_stack_size != null;

        if (!hasCamera || !hasVariants || !hasStackParams) {
          console.warn(
            `⚠️ Skipping ${machine.name} — missing required fields.`,
            {
              camera: hasCamera,
              variants: machine.variants?.length,
              min_stack_length: machine.min_stack_length,
              max_stack_length: machine.max_stack_length,
              min_stack_size: machine.min_stack_size,
              max_stack_size: machine.max_stack_size,
            }
          );
          continue;
        }

        //console.log(`▶️ Starting "${machine.name}"`);

        const response = await fetch(
          `http://127.0.0.1:8000/api/machines/${machine.id}/start_run/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              camera_id: machine.camera.id,
              variant_ids: machine.variants.map((v) => v.id),
              active_variant_id: machine.variants[0].id,
              is_active: true,
              is_running: true,
              name: machine.name,
              description: machine.description || "",
              min_stack_length: machine.min_stack_length,
              max_stack_length: machine.max_stack_length,
              min_stack_size: machine.min_stack_size,
              max_stack_size: machine.max_stack_size,
              base_dir_path: machine.base_dir_path || "",
              watchdog_file_expi_time: machine.watchdog_file_expi_time || "",
              video_stream: machine.video_stream || false,
              video_folder_path: machine.video_folder_path || "",
              is_operational: true,
              last_maintenance:
                machine.last_maintenance || new Date().toISOString(),
            }),
          }
        );

        if (response.ok) {
          successCount++;
        } else {
          console.warn(`❌ Failed to start "${machine.name}"`);
        }
      }

      //console.log("✅ Start command completed.");

      await fetchMachinesWithRunLogInfo();
      await fetchRecentActivityLogs();

      if (successCount > 0) {
        setStatusMessage({
          text: `✅ ${successCount} machine(s) started successfully!`,
          type: "success",
        });

        setTimeout(() => {
          setStatusMessage({ text: "", type: "" });
        }, 4000);
        setControlText("started");
      } else {
        setStatusMessage({
          text: "⚠️ No machines started. Please check configurations.",
          type: "warning",
        });

        setTimeout(() => {
          setStatusMessage({ text: "", type: "" });
        }, 4000);
        setControlText("");
      }
    } catch (err) {
      console.error("❌ Error starting machines:", err);
      setStatusMessage({
        text: "❌ Failed to start machines.",
        type: "error",
      });

      setTimeout(() => {
        setStatusMessage({ text: "", type: "" });
      }, 4000);
      setControlText("");
    } finally {
      setIsStarting(false);
      setControlLoading(false);
    }
  };

  // stop all machine
  const handleStopAllMachines = async () => {
    setControlText("stopping");
    setIsStopping(true);
    setControlLoading(true);
    //console.log("🔴 Sending stop command to all machines...");

    let successCount = 0;

    try {
      if (!allMachines || allMachines.length === 0) {
        setStatusMessage({
          text: "⚠️ No machines available to stop.",
          type: "warning",
        });
        setTimeout(() => {
          setStatusMessage({ text: "", type: "" });
        }, 4000);
        return;
      }

      for (const machine of allMachines) {
        if (!machine.is_running) {
          console.warn(`⚠️ Skipping stop for "${machine.name}" — not running.`);
          continue;
        }

        //console.log(`⛔ Stopping "${machine.name}"`);

        const response = await fetch(
          `http://127.0.0.1:8000/api/machines/${machine.id}/stop_run/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              camera_id: machine.camera?.id,
              variant_ids: machine.variants?.map((v) => v.id),
              active_variant_id: machine.variants?.[0]?.id,
              is_active: false,
              is_running: false,
              name: machine.name,
              description: machine.description || "",
              min_stack_length: machine.min_stack_length || 0,
              max_stack_length: machine.max_stack_length || 0,
              min_stack_size: machine.min_stack_size || 0,
              max_stack_size: machine.max_stack_size || 0,
              base_dir_path: machine.base_dir_path || "",
              watchdog_file_expi_time: machine.watchdog_file_expi_time || "",
              video_stream: machine.video_stream || false,
              video_folder_path: machine.video_folder_path || "",
              is_operational: true,
              last_maintenance:
                machine.last_maintenance || new Date().toISOString(),
            }),
          }
        );

        if (response.ok) {
          successCount++;
        } else {
          console.warn(`❌ Failed to stop "${machine.name}"`);
        }
      }

      //console.log("✅ Stop command completed.");

      await fetchMachinesWithRunLogInfo();
      await fetchRecentActivityLogs();

      if (successCount > 0) {
        setStatusMessage({
          text: `✅ ${successCount} machine(s) stopped successfully!`,
          type: "success",
        });
        setTimeout(() => {
          setStatusMessage({ text: "", type: "" });
        }, 4000);

        setControlText("");
      } else {
        setStatusMessage({
          text: "⚠️ No machines were running.",
          type: "warning",
        });

        setTimeout(() => {
          setStatusMessage({ text: "", type: "" });
        }, 4000);
        setControlText("");
      }
    } catch (err) {
      console.error("❌ Error stopping machines:", err);
      setStatusMessage({
        text: "❌ Failed to stop machines.",
        type: "error",
      });

      setTimeout(() => {
        setStatusMessage({ text: "", type: "" });
      }, 4000);
      setControlText("");
    } finally {
      setIsStopping(false);
      setControlLoading(false);
    }
  };
  //console.log("🔄 Loading State:", controlLoading, controlText);

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "rgb(209, 233, 237)",
        minHeight: "100vh",
        pb: 10,
        overflowY: "auto",
      }}
    >
      {/* Tested ✅dropdown for filter */}
      <Box
        display="flex"
        gap={2}
        alignItems="center"
        mb={2}
        sx={{ width: "100%" }}
        justifyContent={"space-between"}
      >
        {!restricted && (
          <Box display="flex" alignItems="center" gap={2}>
            {["24h", "7d", "30d", "all", "Custom"].map((filter) => (
              <Button
                variant={timeFilter === filter ? "contained" : "outlined"}
                onClick={() => setTimeFilter(filter)}
                color="primary"
              >
                {filter === "24h"
                  ? "24 Hours"
                  : filter === "7d"
                    ? "7 Days"
                    : filter === "30d"
                      ? "30 Days"
                      : filter === "all"
                        ? "All Time"
                        : "Custom Range"}
              </Button>
            ))}
          </Box>
        )}
        <FormControl size="small" sx={{ width: "50%" }}>
          <InputLabel id="machine-select-label">Machine</InputLabel>
          <Select
            labelId="machine-select-label"
            label="Machine"
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
            sx={{ width: "100%" }}
          >
            <MenuItem value="all">All machines</MenuItem>
            {allMachines.map((m) => (
              <MenuItem key={m.id} value={String(m.id)}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {!restricted && timeFilter === "Custom" && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            {/* Start Date Picker */}
            <DatePicker
              label="Start Date"
              value={dateRange[0]} // Use the first element of dateRange
              onChange={(newValue) => setDateRange([newValue, dateRange[1]])} // Update only the start date
              renderInput={(params) => <TextField size="small" {...params} />}
            />
            {/* End Date Picker */}
            <DatePicker
              label="End Date"
              value={dateRange[1]} // Use the second element of dateRange
              onChange={(newValue) => setDateRange([dateRange[0], newValue])} // Update only the end date
              renderInput={(params) => <TextField size="small" {...params} />}
            />
            <Button
              variant="contained"
              onClick={handleDateFilter}
              disabled={!dateRange[0] || !dateRange[1]}
            >
              Apply
            </Button>
          </Box>
        </LocalizationProvider>
      )}

      {/* Top Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* total produced */}
        <Grid item xs={12} md={3}>
          <InfoCard
            icon={<Assessment sx={{ fontSize: 40, color: "#fff" }} />}
            title="Total Produced"
            value={
              performanceStats
                ? performanceStats.total_frames.toLocaleString()
                : "..."
            }
            color="#4caf50"
          />
        </Grid>

        {/* rejected biscuits */}
        <Grid item xs={12} md={3}>
          <InfoCard
            icon={<WarningAmber sx={{ fontSize: 40, color: "#fff" }} />}
            title="Rejected Biscuits"
            value={
              performanceStats
                ? performanceStats.rejected_frames.toLocaleString()
                : "..."
            }
            color="#f44336"
          />
        </Grid>

        {/* active machines */}
        <Grid item xs={12} md={3}>
          <InfoCard
            icon={<Engineering sx={{ fontSize: 40, color: "#fff" }} />}
            title="Active Machines"
            value={`${machineStatus.active} / ${machineStatus.total}`}
            color="#2196f3"
          />
        </Grid>

        {/* live feed */}
        <Grid item xs={12} md={3}>
          <InfoCard
            icon={<LiveTv sx={{ fontSize: 40, color: "#fff" }} />}
            title="Live Feed"
            value={machineStatus.liveFeed}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      {/* Charts and Live View */}
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Production Over Time {restricted && "(Last 24 Hours)"}
            </Typography>

            {performanceStats && (
              <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                padding={2}
                mb={2}
                bgcolor="#f5f5f5"
                borderRadius={2}
              >
                <Box textAlign="center">
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Frames
                  </Typography>
                  <Typography variant="h6">
                    {performanceStats.total_frames}
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="subtitle2" color="textSecondary">
                    Rejected Frames
                  </Typography>
                  <Typography variant="h6">
                    {performanceStats.rejected_frames}
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="subtitle2" color="textSecondary">
                    Rejection Rate (%)
                  </Typography>
                  <Typography variant="h6">
                    {performanceStats.rejection_rate_percent}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Tested ✅ */}
            {loading ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress color="primary" />
              </Box>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis
                    dataKey="t"
                    type="number"
                    domain={['auto','auto']}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(unixMs) => {
                      const isShort =
                        restricted ||
                        timeFilter === "24h" ||
                        (timeFilter === "Custom" && dateRange[0] && dateRange[1] &&
                        dayjs(dateRange[1]).endOf("day").diff(
                          dayjs(dateRange[0]).startOf("day"), 'day', true
                        ) <= 3);

                      return isShort ? dayjs(unixMs).format("YYYY-MM-DD HH:mm")
                                    : dayjs(unixMs).format("YYYY-MM-DD");
                    }}
                    label={{
                      value: "Time",
                      position: "insideBottom",
                      offset: -5,
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    label={{
                      value: "Units Produced",
                      angle: -90,
                      position: "insideCenter",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ strokeDasharray: "3 3" }}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="production"
                    stroke="#1976d2"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary" align="center" mt={2}>
                No production data available for this range.
              </Typography>
            )}
          </StyledPaper>
        </Grid>

        {/* Live Camera Preview */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Live Camera Feed
            </Typography>
            <Box
              component="img"
              src="http://localhost:5000/live.jpg"
              alt="Live Feed"
              sx={{ width: "100%", borderRadius: 2 }}
            />
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Machine Controls */}
      <Paper
        elevation={3}
        sx={{ p: 3, mt: 4, backgroundColor: "#fff", borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          Machine Control Panel
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} justifyContent="center">
          {/* Start all machines */}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<PlayArrow />}
              onClick={handleStartAllMachines}
              disabled={controlLoading || isStarting}
              sx={{
                backgroundColor:
                  isStarting || controlText === "started"
                    ? "#00c853"
                    : undefined,
                color: "#fff",
                fontWeight: controlText === "started" ? "bold" : undefined,
                boxShadow:
                  controlText === "started"
                    ? "0 0 18px 4px rgba(0, 200, 83, 0.8)"
                    : undefined,
                pointerEvents: controlText === "started" ? "none" : "auto",
                opacity: controlText === "started" ? 1 : undefined,
                "&:hover": {
                  backgroundColor:
                    isStarting || controlText === "started"
                      ? "#00b248"
                      : undefined,
                },
              }}
            >
              {isStarting
                ? "Starting..."
                : controlText === "started"
                  ? "Started"
                  : "Start All Machines"}
            </Button>
          </Grid>

          {/* Stop all machines */}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<Stop />}
              onClick={handleStopAllMachines}
              disabled={controlLoading || isStopping}
              sx={{
                backgroundColor: isStopping ? "#b71c1c" : undefined,
                "&:hover": {
                  backgroundColor: isStopping ? "#7f0000" : undefined,
                },
              }}
            >
              {isStopping ? "Stopped" : "Stop All Machines"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* alert box for control panel */}
      {statusMessage.text && (
        <Alert
          severity={statusMessage.type}
          onClose={() => setStatusMessage({ text: "", type: "" })}
          sx={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2000,
          }}
        >
          {statusMessage.text}
        </Alert>
      )}

      {/* Recent Activity Log Section */}
      <Box mt={4}>
        <Paper
          elevation={3}
          sx={{ p: 3, backgroundColor: "#fff", borderRadius: 2 }}
        >
          {/* data filter for recent activity log */}
          {!restricted && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                {/* Start Date Picker */}
                <DatePicker
                  label="Start Date"
                  value={dateRange[0]} // Use the first element of dateRange
                  onChange={(newValue) =>
                    setDateRange([newValue, dateRange[1]])
                  } // Update only the start date
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
                {/* End Date Picker */}
                <DatePicker
                  label="End Date"
                  value={dateRange[1]} // Use the second element of dateRange
                  onChange={(newValue) =>
                    setDateRange([dateRange[0], newValue])
                  } // Update only the end date
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
                <Button
                  variant="contained"
                  onClick={handleDateFilter}
                  disabled={!dateRange[0] || !dateRange[1]}
                >
                  Apply
                </Button>
              </Box>
            </LocalizationProvider>
          )}

          <Typography variant="h6" gutterBottom>
            Recent Activity Logs
          </Typography>
          <Divider sx={{ my: 2 }} />

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {logs.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No recent activity found.
                </Typography>
              ) : (
                Object.entries(groupedLogs).map(([date, items]) => (
                  <Box key={date} mb={2}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "gray", mb: 1 }}
                    >
                      {date}
                    </Typography>

                    {items.map((log) => (
                      <Box key={log.id} mb={1}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTimeIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                              {dayjs(log.stop_time || log.start_time).format(
                                "hh:mm A"
                              )}{" "}
                              – <strong>{log.machine_name}</strong> – Variant{" "}
                              <strong>{log.variant_name}</strong> ran biscuit{" "}
                              <strong>{log.biscuit_type}</strong>
                            </Typography>
                          </Box>

                          <Chip
                            label={log.is_running ? "Running" : "Stopped"}
                            color={log.is_running ? "success" : "default"}
                            size="small"
                          />
                        </Stack>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          pl={4}
                        >
                          Runtime:{" "}
                          {log.total_runtime_seconds
                            ? `${log.total_runtime_seconds.toFixed(1)} sec`
                            : "N/A"}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                      </Box>
                    ))}
                  </Box>
                ))
              )}
            </Box>
          )}
        </Paper>
      </Box>

      <ScrollToTopButton />
    </Box>
  );
}
