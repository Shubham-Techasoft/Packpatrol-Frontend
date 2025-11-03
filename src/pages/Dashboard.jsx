import React, { useState, useEffect} from "react";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery'; 
import { Box, Typography, Grid, Paper, Button, Divider, Card, CardContent, CircularProgress, Snackbar, Alert, Chip, FormControl, InputLabel, Select, MenuItem,FormGroup, FormControlLabel, Checkbox, Switch } from "@mui/material";
import { Assessment, LiveTv, Engineering, WarningAmber, PlayArrow, Stop, RestartAlt, } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from 'dayjs/plugin/utc';
dayjs.extend(advancedFormat);
dayjs.extend(utc);
import axios from "axios";
import Stack from "@mui/material/Stack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MemoryIcon from "@mui/icons-material/Memory";
import { isAuthenticated } from "../utils/auth";
import ScrollToTopButton from "./sections/about/ScrollToTop";
import {base_URL} from '../utils/api';

import { useMachineSelection } from "../MachineSelectionContext";
import LiveImageFeed from "./sections/LiveImageFeed";

const sampleImagesUrl= [
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_1.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_2.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_3.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_4.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_5.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_6.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_7.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_8.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_9.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_10.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_11.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_12.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_13.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_14.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_15.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_16.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_17.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_18.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_19.bmp",
    "home/techasoft-testing-pc/packpatrol-frontend/public/Pune-Line-1-Machine6/Goodday/dummy_20.bmp"
]

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  backgroundColor: "#ffffff",
}));

const CustomTooltip = ({ active, payload, label, timeInterval }) => {
  if (!active || !payload || !payload.length) return null;

  const when =
    timeInterval === "hour"
      ? dayjs(label).format("YYYY-MM-DD HH:mm")
      : dayjs(label).format("YYYY-MM-DD");

  return (
    <Paper elevation={3} sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', minWidth: 220 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{when}</Typography>
      {payload.map((p) => (
        <Box key={p.dataKey} display="flex" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">{p.name}</Typography>
          <Typography variant="body2">
            {p.dataKey === 'rejection_rate' ? `${(p.value ?? 0).toFixed(2)}%` : (p.value ?? 0).toLocaleString()}
          </Typography>
        </Box>
      ))}
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

const getStart = (it) => it.start_time ?? it.starttime ?? it.startTime ?? null;
const getStop  = (it) => it.stop_time  ?? it.stoptime  ?? it.stopTime  ?? null;

const getMachineId   = (it) => it.machine_id   ?? it.machineid   ?? it.machineId   ?? null;
const getMachineName = (it) => it.machine_name ?? it.machinename ?? it.machineName ?? it.machine?.name ?? null;

const getProcessed = (it) =>
  it.total_frames_processed ?? it.totalframesprocessed ?? it.totalFramesProcessed ?? it.total_processed ?? 0;

const getRejected = (it) =>
  it.total_frames_rejected ?? it.totalframesrejected ?? it.totalFramesRejected ?? it.total_rejected ?? 0;

const getAccepted = (it) =>
  it.total_frames_accepted ?? it.totalframesaccepted ?? it.totalFramesAccepted ?? it.total_passed ?? 0;


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
  const [realtimeData, setRealtimeData] = useState(null);
  const [sseConnection, setSseConnection] = React.useState(null);
  const [isSseConnected, setIsSseConnected] = React.useState(false);
  const [sseError, setSseError] = React.useState(null);

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

  const [displaySrc, setDisplaySrc] = useState(null)

  const [seriesSelection, setSeriesSelection] = React.useState({
    processed: true,
    accepted: true,
    rejected: true
  });
  // time interval used for x-axis / tooltip formatting ('hour' | 'day' ...)
  const [chartTimeInterval, setChartTimeInterval] = React.useState("hour");


  const fetchDashboardSummary = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Machine filter - only add if specific machine selected
      if (selectedMachineId && selectedMachineId !== "all") {
        params.append('machine_id', selectedMachineId);
      }

      // Variant filter - only add if specific variant selected 
      if (selectedVariant && selectedVariant !== "all") {
        params.append('variant_id', selectedVariant);
      }

      // Date formatting helper
      const formatDateParam = (date) => {
        return dayjs(date).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
      };

      // Date parameters
      if (timeFilter === "Custom" && dateRange[0] && dateRange[1]) {
        params.append('start_time', formatDateParam(dayjs(dateRange[0]).startOf('day')));
        params.append('end_time', formatDateParam(dayjs(dateRange[1]).endOf('day')));
      } else if (timeFilter === "7d") {
        params.append('start_time', formatDateParam(dayjs().subtract(7, 'day')));
        params.append('end_time', formatDateParam(dayjs()));
      } else if (timeFilter === "30d") {
        params.append('start_time', formatDateParam(dayjs().subtract(30, 'day')));
        params.append('end_time', formatDateParam(dayjs()));
      } else if (timeFilter === "24h") {
        params.append('start_time', formatDateParam(dayjs().subtract(1, 'day')));
        params.append('end_time', formatDateParam(dayjs()));
      } else if (timeFilter === "all") {
        params.append('start_time', formatDateParam(dayjs().subtract(100, 'year')));
        params.append('end_time', formatDateParam(dayjs()));
      }

      // Ensure we have date params (fallback to last 24h)
      if (!params.get('start_time') || !params.get('end_time')) {
        params.append('start_time', formatDateParam(dayjs().subtract(1, 'day')));
        params.append('end_time', formatDateParam(dayjs()));
      }

      const url = `${base_URL}/api/machinerunlogs/dashboard_summary/?${params.toString()}`;
      console.log('Fetching dashboard summary:', url);

      const res = await axios.get(url);

      const stats = res.data.frame_statistics || {};
      setPerformanceStats({
        total_frames: stats.total_frames_processed || 0,
        rejected_frames: stats.total_frames_rejected || 0,
        rejection_rate_percent: stats.overall_rejection_rate || 0,
      });

      setLogs(res.data.recent_runs || []);
    } catch (err) {
      console.error("❌ Failed to fetch dashboard summary:", err);
      setPerformanceStats(null);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };


  // SSE connection management for Dashboard
  React.useEffect(() => {
    if (!selectedMachineId || selectedMachineId === "all") {
      if (sseConnection) {
        sseConnection.close();
        setSseConnection(null);
        setIsSseConnected(false);
        setDisplaySrc(null);
      }
      return;
    }

    const sseUrl = `${base_URL}/api/machines/${selectedMachineId}/sse/`;
    console.log("📡 Connecting SSE for dashboard:", sseUrl);

    let eventSource = new EventSource(sseUrl);
    setSseConnection(eventSource);

    eventSource.onopen = () => {
      console.log("✅ SSE connection opened successfully for dashboard");
      setIsSseConnected(true);
      setSseError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setRealtimeData(data);
        if (data.image_path) {
          const cleanImagePath = data.image_path.replace(/\\/g, "/");
          setDisplaySrc(cleanImagePath);
        }
      } catch (parseError) {
        console.error("❌ Error parsing SSE data on dashboard:", parseError);
      }
    };

    eventSource.onerror = (error) => {
      console.error("❌ SSE connection error on dashboard:", error);
      setIsSseConnected(false);
      setSseError(error);
      eventSource.close();
    };

    return () => {
      console.log("🛑 Cleaning up SSE connection on dashboard");
      if (eventSource) {
        eventSource.close();
      }
      setDisplaySrc(null);
      setSseConnection(null);
      setIsSseConnected(false);
      setSseError(null);
    };
  }, [selectedMachineId]);

  const getSseConnectionStatus = () => {
    if (status !== "running" || !selectedMachineId || selectedMachineId === "all") return "disconnected";
    if (sseError) return "error";
    if (isSseConnected && displaySrc) return "receiving_frames";
    if (isSseConnected) return "connected";
    return "connecting";
  };


  // production-time graph
  React.useEffect(() => {
    const auth = isAuthenticated();
    setRestricted(!auth);
    setLoading(true);

    // Format date params consistently
    const formatDateParam = (date) => {
      const utcOffsetDate = dayjs(date).format('YYYY-MM-DDTHH:mm:ss[Z]');
      console.log('UTC Offset:', utcOffsetDate);
      return utcOffsetDate;
    };

    // Build API parameters
    const params = new URLSearchParams();
    
    // Add machine filter if specific machine selected
    if (selectedMachineId && selectedMachineId !== "all") {
      params.append('machine_id', selectedMachineId);
    }

    // Add date range based on timeFilter
    if (timeFilter === "Custom" && dateRange[0] && dateRange[1]) {
      params.append('start_time', formatDateParam(dayjs(dateRange[0]).startOf('day')));
      params.append('end_time', formatDateParam(dayjs(dateRange[1]).add(1, 'day').startOf('day')));
    } else if (timeFilter === "7d") {
      params.append('start_time', formatDateParam(dayjs().subtract(7, 'day')));
      params.append('end_time', formatDateParam(dayjs().add(1, 'day').startOf('day')));
    } else if (timeFilter === "30d") {
      params.append('start_time', formatDateParam(dayjs().subtract(30, 'day')));
      params.append('end_time', formatDateParam(dayjs().add(1, 'day').startOf('day')));
    } else if (timeFilter === "24h") {
      params.append('start_time', formatDateParam(dayjs().subtract(1, 'day')));
      params.append('end_time', formatDateParam(dayjs().add(1, 'day').startOf('day')));
    } else if (timeFilter === "all") {
      params.append('start_time', formatDateParam(dayjs().subtract(100, 'year')));
      params.append('end_time', formatDateParam(dayjs().add(1, 'day').startOf('day')));
    }

    // Ensure date params exist (fallback to 24h)
    if (!params.get('start_time') || !params.get('end_time')) {
      params.append('start_time', formatDateParam(dayjs().startOf('day')));
      params.append('end_time', formatDateParam(dayjs().add(1, 'day').startOf('day')));
    }

    const summaryUrl = `${base_URL}/api/machinerunlogs/dashboard_summary/?${params.toString()}`;
    console.log('Fetching dashboard data:', summaryUrl);

    Promise.all([
      fetch(summaryUrl).then(res => res.json()),
      fetch(`${base_URL}/api/machines/`).then(res => res.json())
    ])
      .then(([summary, machines]) => {
        // Set performance stats from summary
        const stats = summary.frame_statistics || {};
        setPerformanceStats({
          total_frames: stats.total_frames_processed || 0,
          rejected_frames: stats.total_frames_rejected || 0,
          rejection_rate_percent: stats.overall_rejection_rate || 0,
        });

        // Set logs from summary
        setLogs(summary.recent_runs || []);
        console.log(`Recent Runs (${summary.recent_runs?.length}):`, summary.recent_runs || []);

        // Update chart data handling
          if (summary.chart_data) {
            const grouped = {};
            const labels = summary.chart_data.labels || [];
            const datasets = summary.chart_data.datasets || [];
            const startTimeRaw = summary.time_range?.start_time ?? null;
            // parse startTime as UTC
            const startTime = startTimeRaw ? dayjs(startTimeRaw) : null;
            const timeIntervalRaw = summary.chart_data.time_interval || "hour";
            const timeInterval = String(timeIntervalRaw).toLowerCase().replace(/ly$/, "");
            setChartTimeInterval(timeInterval);

            labels.forEach((label, index) => {
              // Determine timestamp for this label:
              // - If label already contains a date (e.g. "2025-10-29 16:00"), parse it directly
              // - Else if API provided a time_range.start_time, base timestamps on that + index hours
              // - Fallback: use today's date with the hour from the label
              let ts;
              if (/^\d{4}-\d{2}-\d{2}/.test(label) || /^\d{4}\/\d{2}\/\d{2}/.test(label)) {
                ts = dayjs(label).startOf('hour');
              } else if (startTime) {
                ts = startTime.startOf('hour').add(index, 'hour');
              } else {
                const hour = parseInt(String(label).split(':')[0], 10) || 0;
                ts = dayjs().startOf('day').hour(hour);
              }
              const timeKey = ts.format("YYYY-MM-DD HH:00:00");

              grouped[timeKey] = {
                processed: datasets[0]?.data[index] ?? 0,
                accepted: datasets[1]?.data[index] ?? 0,
                rejected: datasets[2]?.data[index] ?? 0,
                rejection_rate: datasets[3]?.data[index] ?? 0,
                time: timeKey,
                rejection_rate_percent: datasets[3]?.data[index] ?? 0,
                acceptance_rate: 100 - (datasets[3]?.data[index] ?? 0),
                acceptance_rate_percent: 100 - (datasets[3]?.data[index] ?? 0),
              };
            });

            setChartData(
              Object.entries(grouped)
                .map(([k, v]) => ({
                  // produce epoch ms from UTC timeKey
                  t: dayjs(k).valueOf(),
                  ...v,
                }))
                .sort((a, b) => a.t - b.t)
            );
          } else {
          setChartData([]);
        }

        // Update machine status
        const activeCount = machines.filter(m => m.is_running).length;
        setMachineStatus({
          active: activeCount,
          total: machines.length,
          liveFeed: activeCount > 0 ? "Running" : "Stopped"
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        setPerformanceStats(null);
        setChartData([]);
        setLogs([]);
        setLoading(false);
      });
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
    fetch(`${base_URL}/api/machines/${selectedMachineId}/`)
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

  // machine details
  const fetchMachinesWithRunLogInfo = async () => {
    try {
      // Step 1: Get all machines
      const machinesRes = await fetch(`${base_URL}/api/machines/`);
      const machines = await machinesRes.json();

      // Step 2: Get all machine run logs
      const logsRes = await fetch(`${base_URL}/api/machinerunlogs/`);
      const runLogs = await logsRes.json();

      // Step 3: Fetch camera + variants per machine
      const enrichedMachines = await Promise.all(
        machines.map(async (machine) => {
          const detailRes = await fetch(
            `${base_URL}/api/machines/${machine.id}/`
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
    fetchDashboardSummary();
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
          `${base_URL}/api/machines/${machine.id}/start_run/`,
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
          `${base_URL}/api/machines/${machine.id}/stop_run/`,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f0f0f9",
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
                key={filter}
                variant={timeFilter === filter ? "contained" : "outlined"}
                onClick={() => setTimeFilter(filter)}
                sx={{
                  color: timeFilter === filter ? "#fff" : "#062249",
                  borderColor: "#062249",
                  bgcolor: timeFilter === filter ? "#062249" : "transparent",
                  "&:hover": {
                    bgcolor: "#062249",
                    color: "#fff",
                }}}
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
      {isMobile ? (
        <MobileDatePicker
          label="Start Date"
          value={dateRange[0]}
          onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
          slotProps={{ 
            textField: { 
              size: 'small',
              fullWidth: true,
              inputProps: {
                style: { cursor: 'pointer' }
              }
            },
            dialog: {
              sx: { 
                '& .MuiDialogActions-root': { 
                  paddingBottom: 2
                }
              }
            }
          }}
        />
      ) : (
        <DesktopDatePicker
          label="Start Date"
          value={dateRange[0]}
          onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
          slotProps={{ 
            textField: { 
              size: 'small'
            },
            popper: {
              sx: { zIndex: 1300 }
            }
          }}
        />
      )}

      {isMobile ? (
        <>
          <MobileDatePicker
            label="End Date"
            value={dateRange[1]}
            onChange={(newValue) => setDateRange([dateRange[0], newValue])}
            slotProps={{ 
              textField: { 
                size: 'small',
                fullWidth: true,
                error: dateRange[0] && dateRange[1] && dayjs(dateRange[1]).isBefore(dayjs(dateRange[0])),
                inputProps: {
                  style: { cursor: 'pointer' }
                }
              },
              dialog: {
                sx: { 
                  '& .MuiDialogActions-root': { 
                    paddingBottom: 2
                  }
                }
              }
            }}
          />
          {dateRange[0] && dateRange[1] && dayjs(dateRange[1]).isBefore(dayjs(dateRange[0])) && (
            <Typography variant="caption" color="error" sx={{ position: 'absolute'}}>
              End date cannot be before start date
            </Typography>
          )}
        </>
      ) : (
        <>
          <DesktopDatePicker
            label="End Date"
            value={dateRange[1]}
            onChange={(newValue) => setDateRange([dateRange[0], newValue])}
            slotProps={{ 
              textField: { 
                size: 'small',
                error: dateRange[0] && dateRange[1] && dayjs(dateRange[1]).isBefore(dayjs(dateRange[0]))
              },
              popper: {
                sx: { zIndex: 1300 }
              }
            }}
          />
          {dateRange[0] && dateRange[1] && dayjs(dateRange[1]).isBefore(dayjs(dateRange[0])) && (
            <Typography variant="caption" color="error" sx={{ position: 'absolute', marginTop: '55px'}}>
              End date cannot be before start date
            </Typography>
          )}
        </>
      )}

      <Button
        variant="contained"
        onClick={handleDateFilter}
        disabled={!dateRange[0] || !dateRange[1] || (dateRange[0] && dateRange[1] && dayjs(dateRange[1]).isBefore(dayjs(dateRange[0])))}
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
              <>
                <Box mb={2} display="flex" gap={2} flexWrap="wrap">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={seriesSelection.processed}
                        onChange={(e) => setSeriesSelection(prev => ({...prev, processed: e.target.checked}))}
                        color="primary"
                      />
                    }
                    label="Total Processed"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={seriesSelection.accepted}
                        onChange={(e) => setSeriesSelection(prev => ({...prev, accepted: e.target.checked}))}
                        color="success"
                      />
                    }
                    label="Accepted"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={seriesSelection.rejected}
                        onChange={(e) => setSeriesSelection(prev => ({...prev, rejected: e.target.checked}))}
                        color="error"
                      />
                    }
                    label="Rejected"
                  />
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis
                      dataKey="t"
                      type="number"
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(unixMs) =>
                        chartTimeInterval === "hour"
                          ? dayjs(unixMs).format("HH:mm")
                          : dayjs(unixMs).format("MMM D")
                      }
                      label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      yAxisId="left"
                      label={{
                        value: 'Frames',
                        angle: -90,
                        position: 'insideLeft',
                        fontSize: 12
                      }}
                    />
                    {/* <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      label={{
                        value: 'Rejection Rate (%)',
                        angle: 90,
                        position: 'insideRight',
                        fontSize: 12
                      }}
                    /> */}
                    <Tooltip content={(props) => <CustomTooltip {...props} timeInterval={chartTimeInterval} />} />
                    <Legend />
                    
                    {seriesSelection.processed && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="processed"
                        name="Total Processed"
                        stroke="#007bceff"
                        strokeWidth={2}
                        dot={false}
                      />
                    )}
                    {seriesSelection.accepted && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="accepted"
                        name="Accepted"
                        stroke="#009122ff"
                        strokeWidth={2}
                        dot={false}
                      />
                    )}
                    {seriesSelection.rejected && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="rejected"
                        name="Rejected"
                        stroke="#b10127ff"
                        strokeWidth={2}
                        dot={false}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </>
            ) : (
              <Typography color="textSecondary" align="center" mt={2}>
                No production data available for this range.
              </Typography>
            )}
            {/* <Box sx={{paddingLeft:3}}>
              <Typography color="textPrimary" mt={2}>
                Chart Filters
              </Typography>
              <FormGroup row sx={{paddingLeft:3}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={seriesSelection.processed}
                      onChange={(e) =>
                        setSeriesSelection((s) => ({ ...s, processed: e.target.checked }))
                      }
                    />
                  }
                  label="Total Processed"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={seriesSelection.rejected}
                      onChange={(e) =>
                        setSeriesSelection((s) => ({ ...s, rejected: e.target.checked }))
                      }
                    />
                  }
                  label="Total Rejected"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={seriesSelection.accepted}
                      onChange={(e) =>
                        setSeriesSelection((s) => ({ ...s, accepted: e.target.checked }))
                      }
                    />
                  }
                  label="Total Accepted"
                />
              </FormGroup>
            </Box> */}
          </StyledPaper>
        </Grid>

        {/* Live Camera Preview */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Live Camera Feed
            </Typography>
            <LiveImageFeed
              status={status}
              imagePath={status === "stopped" ? null : displaySrc}
              connectionStatus={getSseConnectionStatus()} // This is for the small chip
            />
            <Typography variant="body2" color="text.secondary" mt={2}>
              * Only the running Machine live feed will be shown here!
            </Typography>
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
                {isMobile ? (
                  <MobileDatePicker
                    label="Start Date"
                    value={dateRange[0]}
                    onChange={(newValue) =>
                      setDateRange([newValue, dateRange[1]])
                    }
                    slotProps={{ 
                      textField: { 
                        size: 'small',
                        fullWidth: true,
                        inputProps: {
                          style: { cursor: 'pointer' }
                        }
                      }
                    }}
                  />
                ) : (
                  <DesktopDatePicker
                    label="Start Date"
                    value={dateRange[0]}
                    onChange={(newValue) =>
                      setDateRange([newValue, dateRange[1]])
                    }
                    slotProps={{ 
                      textField: { 
                        size: 'small'
                      }
                    }}
                  />
                )}

                {/* End Date Picker */}
                {isMobile ? (
                  <MobileDatePicker
                    label="End Date"
                    value={dateRange[1]}
                    onChange={(newValue) =>
                      setDateRange([dateRange[0], newValue])
                    }
                    slotProps={{ 
                      textField: { 
                        size: 'small',
                        fullWidth: true,
                        inputProps: {
                          style: { cursor: 'pointer' }
                        }
                      }
                    }}
                  />
                ) : (
                  <DesktopDatePicker
                    label="End Date"
                    value={dateRange[1]}
                    onChange={(newValue) =>
                      setDateRange([dateRange[0], newValue])
                    }
                    slotProps={{ 
                      textField: { 
                        size: 'small'
                      }
                    }}
                  />
                )}

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
