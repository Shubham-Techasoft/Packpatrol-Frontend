import * as React from "react";
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
import { isAuthenticated } from "../utils/auth";
import dayjs from "dayjs";

// const [designation] = useState(localStorage.getItem("designation") || "");

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  backgroundColor: "#ffffff",
}));

const InfoCard = ({ icon, title, value, color }) => (
  <StyledPaper style={{ backgroundColor: color }}>
    <Box display="flex" alignItems="center" gap={2}>
      {icon}
      <Box>
        <Typography variant="subtitle2" color="#fff">
          {title}
        </Typography>
        <Typography variant="h6" color="#fff" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Box>
  </StyledPaper>
);

// const data = [
//   { name: "08 AM", production: 200 },
//   { name: "10 AM", production: 400 },
//   { name: "12 PM", production: 600 },
//   { name: "2 PM", production: 700 },
//   { name: "4 PM", production: 1000 },
// ];

export default function Dashboard() {
  const [restricted, setRestricted] = React.useState(false);
  const [designation, setDesignation] = React.useState("");
  const [chartData, setChartData] = React.useState([]);
  const [timeFilter, setTimeFilter] = React.useState("all");
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

  // React.useEffect(() => {
  //   const auth = isAuthenticated();
  //   setRestricted(!auth);

  //   setLoading(true);
  //   // fetch machine run logs (chart data)
  //   fetch("http://127.0.0.1:8000/api/machinerunlogs/")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("Raw API Data:", data);

  //       const now = dayjs();

  //       const filtered = data.filter((item) => {
  //         const itemTime = dayjs(item.start_time);
  //         if (restricted) {
  //           return now.diff(itemTime, "hour") <= 24;
  //         }
  //         if (timeFilter === "24h") return now.diff(itemTime, "hour") <= 24;
  //         if (timeFilter === "7d") return now.diff(itemTime, "day") <= 7;
  //         if (timeFilter === "30d") return now.diff(itemTime, "day") <= 30;
  //         return true;
  //       });

  //       console.log(
  //         "Active Time Filter:",
  //         restricted ? "24h (restricted)" : timeFilter
  //       );
  //       console.log("Filtered Logs:", filtered);

  //       const grouped = {};
  //       filtered.forEach((item) => {
  //         const hourLabel = dayjs(item.start_time).format("hh A");
  //         const production = item.total_frames_processed || 0;

  //         if (!grouped[hourLabel]) grouped[hourLabel] = 0;
  //         grouped[hourLabel] += production;
  //       });

  //       const transformed = Object.entries(grouped).map(
  //         ([hour, production]) => ({
  //           name: hour,
  //           production,
  //         })
  //       );

  //       const sorted = transformed.sort((a, b) =>
  //         dayjs(a.name, "hh A").isBefore(dayjs(b.name, "hh A")) ? -1 : 1
  //       );
  //       console.log("Transformed Chart Data:", sorted);
  //       setChartData(sorted);
  //       setLoading(false);

  //       const allMachines = new Set();
  //       const activeMachines = new Set();

  //       data.forEach((log) => {
  //         allMachines.add(log.machine_name);
  //         if (log.is_running) activeMachines.add(log.machine_name);
  //       });

  //       setMachineStatus({
  //         active: activeMachines.size,
  //         total: allMachines.size,
  //         liveFeed: activeMachines.size > 0 ? "Running" : "Stopped"
  //       });
  //     });
  //     fetch("http://127.0.0.1:8000/api/machines/")
  //     .then((res) => res.json())
  //     .then((machineList) => {
  //       setMachineStatus((prev) => ({
  //         ...prev,
  //         total: machineList.length,
  //       }));
  //     })

  //     //     .map(item => ({
  //     //       name: dayjs(item.start_time).format("hh A"), // X axis label
  //     //       production: item.total_frames_processed || 0, // Y axis value
  //     //     }));
  //     //     console.log("Raw API Data:", data);

  //     //   setChartData(transformed);
  //     //   console.log("Transformed Chart Data:", transformed);
  //     // })
  //     .catch((err) => {
  //       console.error("Failed to load chart data:", err);
  //       setLoading(false);
  //     });

  //   // Fetch performance Stats
  //   fetch("http://127.0.0.1:8000/api/streamframelogs/performance_analysis/")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("Performance Stats:", data);
  //       setPerformanceStats(data);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch performance stats:", err);
  //     });
  // }, [timeFilter, restricted]);

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

  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/api/machines/")
      .then((res) => res.json())
      .then((data) => {
        setAllMachines(data);
      })
      .catch((err) => console.error("Failed to fetch machines:", err));
  }, []);

  // start all machine
  const handleStartAllMachines = async () => {
    const token = localStorage.getItem("token");
    setControlText("starting");
    setIsStarting(true);
    setControlLoading(true);
    console.log("🟢 Sending start command to all machines...");
  
    try {
      for (const machine of allMachines) {
        if (!machine.camera || !machine.variants || machine.variants.length === 0) {
          console.warn(`⚠️ Skipping ${machine.name} due to missing camera or variants`);
          continue;
        }
  
        console.log(`▶️ Starting ${machine.name} (${machine.id})`);
  
        const response = await fetch(`http://127.0.0.1:8000/api/machines/${machine.id}/start_run/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            camera_id: machine.camera?.id,
            variant_ids: machine.variants.map((v) => v.id),
            active_variant_id: machine.variants[0]?.id,
            is_active: true,
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
            is_running: true,
            is_operational: true,
            last_maintenance: machine.last_maintenance || new Date().toISOString(),
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to start ${machine.name}`);
        }
      }
  
      console.log("✅ All start commands sent.");
      setSnackbar({ open: true, message: "✅ Machines started successfully!", severity: "success" });
    } catch (err) {
      console.error("❌ Error starting machines:", err);
      setSnackbar({ open: true, message: "❌ Failed to start machines", severity: "error" });
    } finally {
      setControlText("");
      setIsStarting(false);
      setControlLoading(false);
    }
  };
  
  // stop all machine
  const handleStopAllMachines = async () => {
    const token = localStorage.getItem("token");
    setControlText("stopping");
    setIsStopping(true);
    setControlLoading(true);
    console.log("🔴 Sending stop command to all machines...");
  
    try {
      for (const machine of allMachines) {
        if (!machine.camera || !machine.variants || machine.variants.length === 0) {
          console.warn(`⚠️ Skipping ${machine.name} due to missing camera or variants`);
          continue;
        }
  
        console.log(`⛔ Stopping ${machine.name} (${machine.id})`);
  
        const response = await fetch(`http://127.0.0.1:8000/api/machines/${machine.id}/stop_run/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            camera_id: machine.camera?.id,
            variant_ids: machine.variants.map((v) => v.id),
            active_variant_id: machine.variants[0]?.id,
            is_active: false,
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
            is_running: false,
            is_operational: true,
            last_maintenance: machine.last_maintenance || new Date().toISOString(),
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to stop ${machine.name}`);
        }
      }
  
      console.log("✅ All stop commands sent.");
      setSnackbar({ open: true, message: "✅ Machines stopped successfully!", severity: "success" });
    } catch (err) {
      console.error("❌ Error stopping machines:", err);
      setSnackbar({ open: true, message: "❌ Failed to stop machines", severity: "error" });
    } finally {
      setControlText("");
      setIsStopping(false); 
      setControlLoading(false);
    }
  };
  
  console.log("🔄 Loading State:", controlLoading, controlText);

  return (
    <Box sx={{ p: 4, bgcolor: "rgb(209, 233, 237)" }}>
      {/* <Typography variant="h4" gutterBottom>
        Biscuit Manufacturing Dashboard 🍪
      </Typography> */}

      {/* Top Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
        <Grid item xs={12} md={3}>
          <InfoCard
            icon={<Engineering sx={{ fontSize: 40, color: "#fff" }} />}
            title="Active Machines"
            value={`${machineStatus.active} / ${machineStatus.total}`}
            color="#2196f3"
          />
        </Grid>
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
      <Box mt={4}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Machine Control Panel
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {/* Start all machines */}
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                startIcon={<PlayArrow />}
                onClick={handleStartAllMachines}
                disabled={controlLoading}
              >
                {isStarting ? "Starting..." : "Start Machines"}          
              </Button>
            </Grid>

            {/* stop all machines */}
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                startIcon={<Stop />}
                onClick={handleStopAllMachines}
                disabled={controlLoading}
              >
               {isStopping ? "Stopping..." : "Stop All"}
              </Button>
            </Grid>

            {/* Reset System */}
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                startIcon={<RestartAlt />}
              >
                Reset System
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>
      </Box>

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

      {/* Log Section */}
      <Box mt={4}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Recent Activity Logs
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
            <Typography variant="body2">
              [04:01 PM] – Line 3 paused due to temperature fluctuation.
            </Typography>
            <Typography variant="body2">
              [03:55 PM] – New batch started on Line 2.
            </Typography>
            <Typography variant="body2">
              [03:45 PM] – Rejected biscuits bin full alert triggered.
            </Typography>
            <Typography variant="body2">
              [03:30 PM] – Line 1 operational and stable.
            </Typography>
            <Typography variant="body2">
              [03:00 PM] – Daily cleaning complete.
            </Typography>
          </Box>
        </StyledPaper>
      </Box>
    </Box>
  );
}

// import * as React from "react";
// import { useState } from "react";
// import { Tabs, Tab, Box, Typography, Paper, Divider } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import Overview from "./sections/Overview";
// import ProductionLine from "./sections/ProductionLine";
// import MachineStatus from "./sections/MachineStatus";
// import LogHistory from "./sections/LogHistory";
// // import LiveFeed from "./sections/LiveFeed";
// import SocketMonitor from "./sections/SocketMonitor";

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   borderRadius: 16,
//   boxShadow: theme.shadows[4],
// }));

// const Dashboard = () => {
//   const [tab, setTab] = useState(0);

//   const renderTab = () => {
//     switch (tab) {
//       case 0:
//         return <Overview />;
//       case 1:
//         return <ProductionLine />;
//       case 2:
//         return <MachineStatus />;
//       case 3:
//         return <LogHistory />;
//       case 4:
//         return <LiveFeed />;
//       case 5:
//         return <SocketMonitor />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Biscuit Manufacturing Dashboard 🍪
//       </Typography>
//       <StyledPaper sx={{ mb: 3 }}>
//         <Tabs
//           value={tab}
//           onChange={(e, newTab) => setTab(newTab)}
//           textColor="primary"
//           indicatorColor="primary"
//           variant="scrollable"
//           scrollButtons="auto"
//         >
//           <Tab label="Overview" />
//           <Tab label="Production Line" />
//           <Tab label="Machine Status" />
//           <Tab label="Log History" />
//           <Tab label="Live Feed" />
//           <Tab label="Socket Monitor" />
//         </Tabs>
//       </StyledPaper>
//       <StyledPaper>
//         <Box sx={{ p: 2 }}>{renderTab()}</Box>
//       </StyledPaper>
//     </Box>
//   );
// };

// export default Dashboard;

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Button,
//   Divider,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { isAuthenticated, isSuperAdmin } from "../utils/auth";

// const Dashboard = () => {
//   const [designation, setDesignation] = useState("");

//   useEffect(() => {
//     const role = localStorage.getItem("designation");
//     setDesignation(role || "");
//   }, []);

//   if (!isAuthenticated()) {
//     return <Typography>You are not logged in.</Typography>;
//   }

//   if (isSuperAdmin()) {
//     return (
//       <div>
//         <Typography variant="h4" gutterBottom>Welcome, SuperAdmin 👑</Typography>
//         {/* SuperAdmin-specific dashboard: */}
//         <ul>
//           <li>🔐 Create Admins, Managers, Users</li>
//           <li>📊 See platform-wide metrics</li>
//           <li>⚙️ Access system config/dev settings</li>
//         </ul>
//       </div>
//     );
//   }

//   if (designation === "admin") {
//     return (
//       <div>
//         <Typography variant="h4">Welcome, Admin</Typography>
//         {/* Admin dashboard content */}
//       </div>
//     );
//   }

//   if (designation === "manager") {
//     return (
//       <div>
//         <Typography variant="h4">Welcome, Manager</Typography>
//         {/* Manager dashboard content */}
//       </div>
//     );
//   }

//   return (
//     <div>
//     <Typography variant="h4">Welcome, User</Typography>
//     {/* User dashboard content */}
//   </div>
//   );
// };

// export default Dashboard;
