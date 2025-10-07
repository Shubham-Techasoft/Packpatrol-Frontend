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

// Path conversion function
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

  const [page, setPage] = useState(1);
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

  // NEW: Fetch manifest from database API
  useEffect(() => {
    const fetchManifestFromDB = async () => {
      try {
        setLoading(true);
        setError(null);
        setImagesList([]);
        setPage(1);

        if (!machineInfo.machineName || !machineInfo.variantName) return;

        showSnackbar("Loading images from database...", "info");

        // Fetch the manifest (list of image paths) from database API
        const response = await fetch(
          `http://127.0.0.1:8000/api/manifest/${encodeURIComponent(
            machineInfo.machineName
          )}/${encodeURIComponent(machineInfo.variantName)}/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch image manifest from database");
        }

        const imagePaths = await response.json();
        
        // Convert to image objects (same as old manifest processing)
        const imageObjects = imagePaths.map((absolutePath, index) => {
          const webPath = convertToWebPath(absolutePath);
          return {
            id: `img-${index}-${Date.now()}`,
            url: webPath,
            label: absolutePath.split("/").pop() || "Image",
            originalPath: absolutePath
          };
        });

        setImagesList(imageObjects);
        showSnackbar(`Loaded ${imageObjects.length} images successfully!`, "success");

      } catch (err) {
        console.error("Error fetching manifest from database:", err);
        setError("Failed to load images from database. The API endpoint may not be configured.");
        showSnackbar("Failed to load images.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (machineInfo.machineName && machineInfo.variantName) {
      fetchManifestFromDB();
    }
  }, [machineInfo.machineName, machineInfo.variantName]);

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
                Make sure the manifest API endpoint is running.
              </Typography>
            </Box>
          </Alert>
        )}
        {!loading && !error && imagesList.length === 0 && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 5 }}>
            No images found for this variant.
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
                  }}
                  onClick={() => handleOpen(img)}
                >
                  <CardMedia
                    component="img"
                    height={isSmallScreen ? "150" : "220"}
                    image={img.url}
                    alt={img.label}
                    sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
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
            <img
              src={currentImage.url}
              alt={currentImage.label}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
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