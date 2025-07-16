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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  backgroundColor: "#ffffff",
}));

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

  const [machineStatus, setMachineStatus] = React.useState({
    active: 0,
    total: 0,
    liveFeed: "Stopped",
  });
  const [allMachines, setAllMachines] = React.useState([]);
  const [controlLoading, setControlLoading] = React.useState(false);
  const [controlText, setControlText] = React.useState("");
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [dateRange, setDateRange] = React.useState([null, null]);

  // production-time graph
  React.useEffect(() => {
    const auth = isAuthenticated();
    setRestricted(!auth);
    setLoading(true);

    const now = dayjs();

    Promise.all([
      fetch("http://127.0.0.1:8000/api/machinerunlogs/").then((res) =>
        res.json()
      ),
      fetch("http://127.0.0.1:8000/api/machines/").then((res) => res.json()),
    ])
      .then(([logs, machines]) => {
        console.log("Raw API Data:", logs);
        console.log("Machines List:", machines);

        // 🔎 Apply time filtering
        const filtered = logs.filter((item) => {
          const itemTime = dayjs(item.start_time);
          if (restricted) return now.diff(itemTime, "hour") <= 24;
          if (timeFilter === "24h") return now.diff(itemTime, "hour") <= 24;
          if (timeFilter === "7d") return now.diff(itemTime, "day") <= 7;
          if (timeFilter === "30d") return now.diff(itemTime, "day") <= 30;
          return true;
        });

        console.log(
          "Active Time Filter:",
          restricted ? "24h (restricted)" : timeFilter
        );
        console.log("Filtered Logs:", filtered);

        // 🧮 Group production per hour
        const grouped = {};
        filtered.forEach((item) => {
          const hourLabel = dayjs(item.start_time).format("hh A");
          const production = item.total_frames_processed || 0;
          grouped[hourLabel] = (grouped[hourLabel] || 0) + production;
        });

        const chart = Object.entries(grouped).map(([hour, production]) => ({
          name: hour,
          production,
        }));

        const sortedChart = chart.sort((a, b) =>
          dayjs(a.name, "hh A").isBefore(dayjs(b.name, "hh A")) ? -1 : 1
        );

        setChartData(sortedChart);
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
    fetch("http://127.0.0.1:8000/api/streamframelogs/performance_analysis/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Performance Stats:", data);
        setPerformanceStats(data);
      })
      .catch((err) => {
        console.error("Failed to fetch performance stats:", err);
      });
  }, [timeFilter, restricted]);

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

      console.log("✅ Enriched machines:", enrichedMachines);
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
    console.log("🟢 Sending start command to all machines ...");

    let successCount = 0;

    try {
      if (!allMachines || allMachines.length === 0) {
        setSnackbar({
          open: true,
          message: "⚠️ No machines available to start.",
          severity: "warning",
        });
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

        console.log(`▶️ Starting "${machine.name}"`);

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

      console.log("✅ All machines started.");

      await fetchMachinesWithRunLogInfo();
      await fetchRecentActivityLogs();

      if (successCount > 0) {
        setSnackbar({
          open: true,
          message: `✅ ${successCount} machine(s) started successfully!`,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "⚠️ No machines started. Please check configurations.",
          severity: "warning",
        });
      }
    } catch (err) {
      console.error("❌ Error starting machines:", err);
      setSnackbar({
        open: true,
        message: "❌ Failed to start machines.",
        severity: "error",
      });
    } finally {
      setControlText("");
      setIsStarting(false);
      setControlLoading(false);
    }
  };

  // stop all machine
  const handleStopAllMachines = async () => {
    setControlText("stopping");
    setIsStopping(true);
    setControlLoading(true);
    console.log("🔴 Sending stop command to all machines (no auth)...");

    let successCount = 0;

    try {

      if (!allMachines || allMachines.length === 0) {
        setSnackbar({
          open: true,
          message: "⚠️ No machines available to stop.",
          severity: "warning",
        });
        return;
      }

      for (const machine of allMachines) {
        if (!machine.is_running) {
          console.warn(`⚠️ Skipping stop for "${machine.name}" — not running.`);
          continue;
        }

        console.log(`⛔ Stopping "${machine.name}"`);

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

      console.log("✅ All machines stopped.");

      await fetchMachinesWithRunLogInfo();
      await fetchRecentActivityLogs();

      if (successCount > 0) {
        setSnackbar({
          open: true,
          message: `✅ ${successCount} machine(s) stopped successfully!`,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "⚠️ No machines were running.",
          severity: "warning",
        });
      }
    } catch (err) {
      console.error("❌ Error stopping machines:", err);
      setSnackbar({
        open: true,
        message: "❌ Failed to stop machines.",
        severity: "error",
      });
    } finally {
      setControlText("");
      setIsStopping(false);
      setControlLoading(false);
    }

   
  };
  console.log("🔄 Loading State:", controlLoading, controlText);

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

            {/* restricted chart buttons */}
            {!restricted && (
              <Box display="flex" gap={2} mb={2}>
                {["24h", "7d", "30d", "all"].map((filter) => (
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
                          : "All Time"}
                  </Button>
                ))}
              </Box>
            )}

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
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Time",
                      position: "insideBottomRight",
                      offset: -5,
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Units Produced",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} biscuits`, "Produced"]}
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
                backgroundColor: isStarting ? "#2e7d32" : undefined,
                "&:hover": {
                  backgroundColor: isStarting ? "#1b5e20" : undefined,
                },
              }}
            >
              {isStarting ? "Starting." : "Start All Machines"}
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

      {/* snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
    </Box>
  );
}
