import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
  Snackbar,
  Pagination,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";

const IMAGES_PER_PAGE = 20;

// NEW: Function to convert absolute path to web URL
const convertToWebPath = (absolutePath) => {
  if (!absolutePath) return null;
  return absolutePath.replace('/home/techasoft-testing-pc/PackImages', '/public/packimages');
};

const VariantGallaryView = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { machineId, variantId } = useParams();

  const [imagesList, setImagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const [machineInfo, setMachineInfo] = useState({
    machineName: "",
    variantName: "",
  });

  // Pagination state
  const [page, setPage] = useState(1);

  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpen = (img) => {
    setCurrentImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentImage(null);
  };

  // Fetch machine + variant names
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const [machineRes, variantRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/machines/${machineId}/`),
          fetch(`http://127.0.0.1:8000/api/machinevariants/${variantId}/`),
        ]);

        if (!machineRes.ok || !variantRes.ok) {
          throw new Error("Failed to fetch machine/variant details");
        }

        const machineData = await machineRes.json();
        const variantData = await variantRes.json();

        setMachineInfo({
          machineName: machineData.name || machineData.machine_name,
          variantName: variantData.name || variantData.variant_name,
        });
      } catch (err) {
        console.error("Error fetching machine/variant info:", err);
        setError("Failed to load machine/variant info.");
      }
    };

    fetchNames();
  }, [machineId, variantId]);

  // NEW: Fetch images from database API
  useEffect(() => {
    const fetchImagesFromDB = async () => {
      try {
        setLoading(true);
        setError(null);
        setImagesList([]);
        setPage(1);

        if (!machineInfo.machineName || !machineInfo.variantName) return;

        showSnackbar("Fetching images from database...", "info");

        // NEW: Fetch images from your Django API
        const response = await fetch(
          `http://127.0.0.1:8000/api/machine-images/?machine_name=${encodeURIComponent(
            machineInfo.machineName
          )}&variant_name=${encodeURIComponent(machineInfo.variantName)}&limit=1000`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch images from database");
        }

        const data = await response.json();
        
        // Convert database records to image objects
        const images = data.images || data.results || [];
        
        const imageObjects = images.map((record, index) => {
          const webPath = convertToWebPath(record.image_path);
          return {
            id: record.id || record.image_name || `img-${index}`,
            url: webPath,
            label: record.image_name || "Image",
            timestamp: record.timestamp,
            is_rejected: record.is_rejected,
            originalPath: record.image_path // Keep for reference
          };
        });

        // Sort by timestamp (newest first)
        imageObjects.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setImagesList(imageObjects);
        showSnackbar(`Loaded ${imageObjects.length} images successfully!`, "success");

      } catch (err) {
        console.error("Error fetching images from database:", err);
        setError("Failed to load images from database. Please try again.");
        showSnackbar("Failed to load images.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (machineInfo.machineName && machineInfo.variantName) {
      fetchImagesFromDB();
    }
  }, [machineInfo.machineName, machineInfo.variantName]);

  // Alternative: If you don't have an API endpoint yet, use this direct SQLite approach
  const fetchImagesDirectFromDB = async () => {
    try {
      showSnackbar("Fetching images directly from database...", "info");
      
      // This would require a backend endpoint - create one in Django
      const response = await fetch('http://127.0.0.1:8000/api/get-variant-images/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          machine_id: machineId,
          variant_id: variantId,
          machine_name: machineInfo.machineName,
          variant_name: machineInfo.variantName
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const imageObjects = data.images.map(img => ({
          id: img.id,
          url: convertToWebPath(img.image_path),
          label: img.image_name,
          timestamp: img.timestamp
        }));
        
        setImagesList(imageObjects);
        showSnackbar(`Loaded ${imageObjects.length} images`, "success");
      } else {
        throw new Error(data.error || "Failed to fetch images");
      }
    } catch (err) {
      console.error("Direct DB fetch error:", err);
      setError("Database connection failed");
    }
  };

  // Pagination logic
  const pageCount = Math.ceil(imagesList.length / IMAGES_PER_PAGE);
  const paginatedImages = imagesList.slice(
    (page - 1) * IMAGES_PER_PAGE,
    page * IMAGES_PER_PAGE
  );

  return (
    <>
      <AppBar
        sx={{
          background: "linear-gradient(to right, #4b6cb7, #182848)",
          height: "fit-content",
        }}
        position="static"
      >
        <Toolbar sx={{ minHeight: "fit-content !important", padding: "4px 16px" }}>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              ml: 2,
              flex: 1,
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            {machineInfo.variantName}'s Image Gallery
          </Typography>
          {!loading && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {imagesList.length} images
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          p: 4,
          background: "#f4f6f8",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loading && <CircularProgress sx={{ mt: 5 }} />}
        {error && (
          <Alert severity="error" sx={{ mt: 5, maxWidth: 500 }}>
            {error}
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                Make sure your database API endpoint is running.
              </Typography>
            </Box>
          </Alert>
        )}
        {!loading && !error && imagesList.length === 0 && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 5 }}>
            No images found for this variant in the database.
          </Typography>
        )}

        <Grid
          container
          spacing={4}
          maxWidth="xl"
          sx={{ width: "100%", justifyContent: "start" }}
        >
          {!loading &&
            !error &&
            paginatedImages.map((img) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={img.id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: theme.shadows[2],
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: theme.shadows[8],
                    },
                    border: img.is_rejected ? '2px solid #ff4444' : 'none'
                  }}
                  onClick={() => handleOpen(img)}
                >
                  <CardMedia
                    component="img"
                    height={isSmallScreen ? "150" : "220"}
                    image={img.url}
                    alt={img.label}
                    sx={{ 
                      borderTopLeftRadius: 4, 
                      borderTopRightRadius: 4,
                      filter: img.is_rejected ? 'grayscale(0.3)' : 'none'
                    }}
                  />
                  <CardContent
                    sx={{ padding: theme.spacing(2), textAlign: "center" }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="textSecondary"
                      gutterBottom
                    >
                      {img.label}
                    </Typography>
                    {img.timestamp && (
                      <Typography variant="caption" color="textSecondary">
                        {new Date(img.timestamp).toLocaleString()}
                      </Typography>
                    )}
                    {img.is_rejected && (
                      <Typography 
                        variant="caption" 
                        color="error" 
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        REJECTED
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Pagination controls */}
        {!loading && !error && imagesList.length > IMAGES_PER_PAGE && (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Page {page} of {pageCount} • {imagesList.length} total images
            </Typography>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogContent
          sx={{
            p: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh"
          }}
        >
          {currentImage && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={currentImage.url}
                alt={currentImage.label}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
              {currentImage.is_rejected && (
                <Typography 
                  variant="h6" 
                  color="error" 
                  sx={{ mt: 2, color: 'white' }}
                >
                  ⚠️ REJECTED IMAGE
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VariantGallaryView;