import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {base_URL} from '../utils/api';

const MachineDetailsPage = () => {
  const { id } = useParams(); // Machine ID
  console.log("all params", useParams());
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [variant, setVariant] = useState(null);
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

  return (
    <>
      {/* Top AppBar */}
      <AppBar sx={{ background: "linear-gradient(to right, #4b6cb7, #182848)", height:'fit-content' }} position="static" >
        <Toolbar sx={{ minHeight: "fit-content !important", padding: "4px 16px" }}>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            {machine.name}'s Variants
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 10, px: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          📁 {machine.name}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 4,
            height: '80vh',
          }}
        >
          {machine.variants.map((variant) => (
            <Card
              key={variant.id}
              sx={{
                height: 300,
                borderRadius: 4,
                overflow: "hidden",
                background: "#ffffff",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                },
              }}
              onClick={() => navigate(`/machine/${machine.name}/${machine.id}/variant/${variant.name}/${variant.id}`)}
            >
              {/* Top image */}
              <Box
                sx={{
                  height: "70%",
                  width: "100%",
                  backgroundImage: `url('/images/variant-placeholder.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "#e0f7fa",
                }}
              />

              {/* Variant name */}
              <Box
                sx={{
                  height: "30%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTop: "1px solid #e0e0e0",
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  {variant.name}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default MachineDetailsPage;

