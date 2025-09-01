import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  CardActionArea,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GalleryPage = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  const gradients = [
    "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  ];

  useEffect(() => {
    setAnimate(true);
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/machines/");
      setMachines(res.data);
    } catch (err) {
      console.error("Failed to fetch machines", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar sx={{ background: "linear-gradient(to right, #4b6cb7, #182848)", height:'fit-content' }} position="static">
        <Toolbar sx={{ minHeight: "fit-content !important", padding: "4px 16px" }}>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            BACK
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: "#f5f7fa",
          minHeight: "100vh",
          pt: 2,
          px: 4,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0px)" : "translateY(20px)",
          transition: "all 0.8s ease-in-out",
        }}
      >
        <Box
          sx={{
            mb: 6,
            p: 3,
            background: "rgba(255, 255, 255, 0.75)",
            borderRadius: 4,
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="primary">
            Choose Your Smart Machine
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Select a machine below to view its capabilities and customize your experience.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 4,
            }}
          >
            {machines.map((machine, idx) => (
              <Card
                key={machine.id}
                sx={{
                  position: "relative",
                  height: 300,
                  borderRadius: 4,
                  background: gradients[idx % gradients.length],
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/machine/${machine.id}`)}
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    flexDirection: "column",
                    px: 2,
                    py: 3,
                    position: "relative",
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold">
                      {machine.name}
                    </Typography>
                  </CardContent>

                  {/* Bottom reveal strip */}
                  <Box
                    className="glass-reveal"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: 40,
                      background: "rgba(255,255,255,0.4)",
                      color: "#000",
                      textAlign: "center",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      zIndex: 5,
                      transition: "height 0.4s ease",
                      overflow: "hidden",
                    }}
                  >
                    Click to View Details
                  </Box>

                  {/* Hover expansion logic */}
                  <style>
                    {`
                      .MuiCard-root:hover .glass-reveal {
                        height: 200px;
                      }
                    `}
                  </style>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default GalleryPage;
