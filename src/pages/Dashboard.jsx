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
} from "@mui/material";
import { styled } from "@mui/material/styles";
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: theme.shadows[4],
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

const data = [
  { name: "08 AM", production: 200 },
  { name: "10 AM", production: 400 },
  { name: "12 PM", production: 600 },
  { name: "2 PM", production: 700 },
  { name: "4 PM", production: 1000 },
];

export default function Dashboard() {
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
            value="2,000,000+"
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <InfoCard
            icon={<WarningAmber sx={{ fontSize: 40, color: "#fff" }} />}
            title="Rejected Biscuits"
            value="20,045"
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <InfoCard
            icon={<Engineering sx={{ fontSize: 40, color: "#fff" }} />}
            title="Active Machines"
            value="3 / 4"
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <InfoCard
            icon={<LiveTv sx={{ fontSize: 40, color: "#fff" }} />}
            title="Live Feed"
            value="Running"
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
              Production Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <Line
                  type="monotone"
                  dataKey="production"
                  stroke="#3f51b5"
                  strokeWidth={3}
                />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
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
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                startIcon={<PlayArrow />}
              >
                Start Machines
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                startIcon={<Stop />}
              >
                Stop All
              </Button>
            </Grid>
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
// import LiveFeed from "./sections/LiveFeed";
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
