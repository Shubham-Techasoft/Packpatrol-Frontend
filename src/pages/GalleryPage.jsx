import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  IconButton,
  CardActionArea,
  CircularProgress,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MemoryIcon from '@mui/icons-material/Memory';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { base_URL } from '../utils/api';

const GalleryPage = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const res = await axios.get(`${base_URL}/api/machines/`);
      setMachines(res.data);
      console.log("Fetched machines:", res.data);
    } catch (err) {
      console.error("Failed to fetch machines", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar sx={{ background: "#062249", height:'fit-content', position:'static' }}>
        <Toolbar sx={{ minHeight: "fit-content !important", padding: "0px 16px"}}>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{fontSize:'smaller'}} />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h8">
            Machine Gallery
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: "#f5f7fa",
          minHeight: 'calc(100vh - 56px)',
          pt: 2,
          px: 4,
          opacity: animate ? 1 : 0, // Fade in
          transform: animate ? 'translateY(0px)' : 'translateY(20px)', // Slide up
          transition: 'all 0.8s ease-in-out',
        }}
      >
        <Box
          sx={{
            mb: 4,
            p: 3,
            background: "white",
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h4" fontWeight="700" color="primary.dark">
            Select a Machine to View Details
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Click on a machine card to view its details and available variants.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid
            container
            spacing={4}
            sx={{
              justifyContent: 'flex-start',
            }}
          >
            {machines.map((machine) => (
              <Grid item xs={12} sm={6} md={3.5} key={machine.id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 8 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(`/machine/${machine.id}`)}
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        width: '100%',
                        background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <MemoryIcon color="primary" sx={{ fontSize: 40 }} />
                          <Typography variant="h6" fontWeight="600" color="text.primary">
                            {machine.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={machine.is_operational ? 'Operational' : 'Offline'}
                          color={machine.is_operational ? 'success' : 'default'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ p: 2.5, width: '100%', flexGrow: 1 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
                        <CategoryIcon fontSize="small" />
                        <Typography variant="body2">
                          <span style={{ fontWeight: 'bold' }}>{machine.variants_count || 0}</span> Variants
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <Typography variant="body2">
                          Active Variant: <span style={{ fontWeight: 'bold', color: 'text.primary' }}>{machine.active_variant_name || 'N/A'}</span>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <Typography variant="body2">
                          Biscuit Type: <span style={{ fontWeight: 'bold', color: 'text.primary' }}>{machine.active_variant_biscuit_type || 'N/A'}</span>
                        </Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default GalleryPage;
