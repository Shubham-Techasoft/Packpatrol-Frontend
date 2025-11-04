import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Button,
  IconButton,
  CardActionArea,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from '@mui/icons-material/Category';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SpeedIcon from '@mui/icons-material/Speed';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {base_URL} from '../utils/api';

const MachineDetailsPage = () => {
  const { id } = useParams(); // Machine ID
  console.log("all params", useParams());
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${base_URL}/api/machines/${id}/`)
      .then((res) => {
        console.log("Fetched machine data:", res.data);
        setMachine(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching machine", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  console.log("Rendering machine details for:", machine);

  return (
    <>
      {/* Top AppBar */}
      <AppBar sx={{ background: "#062249", height:'fit-content', position:'static' }}>
        <Toolbar sx={{ minHeight: "fit-content !important", padding: "0px 16px"}}>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{fontSize:'smaller'}} />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h8">
            {machine.name}'s Variants
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, background: "#f4f6f8", minHeight: "calc(100vh - 56px)" }}>
        {/* Machine Header */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 4, background: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" fontWeight="700" color="primary.dark" gutterBottom>
                {machine.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Last Update: {machine.description || 'No description available.'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={machine.is_running ? "Running" : "Stopped"}
                color={machine.is_running ? "success" : "default"}
                variant="outlined"
                sx={{ fontWeight: 'bold', borderStyle: 'dashed' }}
              />
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
            <CameraAltIcon />
            <Typography variant="body2">
              Camera: {machine.camera?.name || 'N/A'} (SN: {machine.camera?.serial_number || 'N/A'})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', mt: 1 }}>
            <PsychologyIcon />
            <Typography variant="body2">
              Active ML Model: {machine.active_variant?.active_ml_model?.name || 'N/A'} (Version: {machine.active_variant?.active_ml_model?.version || 'N/A'})
            </Typography>
          </Box>
        </Paper>

        {/* Variants Grid */}
        <Typography variant="h5" fontWeight="600" color="text.primary" mb={3}>
          Available Variants ({machine.variants?.length || 0})
        </Typography>

        {machine.variants && machine.variants.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 4,
            }}
          >
            {machine.variants.map((variant) => (
              <Card
                key={variant.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  border: machine.active_variant?.id === variant.id ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardActionArea onClick={() => navigate(`/machine/${machine.name}/${machine.id}/variant/${variant.name}/${variant.id}`)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ width: '100%', p: 2, background: machine.active_variant?.id === variant.id ? 'primary.lightest' : '#fafafa', borderBottom: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" fontWeight="600" color="text.primary">
                        {variant.name}
                      </Typography>
                      {machine.active_variant?.id === variant.id && (
                        <Chip label="Active" color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Biscuit Type: {variant.biscuit_type || 'N/A'}
                    </Typography>
                  </CardContent>
                  <CardContent sx={{ width: '100%', flexGrow: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CategoryIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Total Runs: <span style={{ fontWeight: 'bold' }}>{variant.total_runs || 0}</span>
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SpeedIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Avg. Inference: {variant.avg_inference_time_ms ? `${variant.avg_inference_time_ms.toFixed(2)} ms` : 'N/A'}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        ) : (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: '#fafafa',
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No Variants Found
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              This machine does not have any variants configured yet.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/dev-settings')} // Assuming this is where you add/edit machines
            >
              Configure Machine
            </Button>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default MachineDetailsPage;
