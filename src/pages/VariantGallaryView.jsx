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
  Pagination, // <-- Add Pagination
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";

const IMAGES_PER_PAGE = 20;

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

  // Progressive manifest parsing with batch loading and no global error on image fail
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setError(null);
        setImagesList([]); // Clear previous images only on new manifest load
        setPage(1);
        if (!machineInfo.machineName || !machineInfo.variantName) return;

        showSnackbar("Fetching images, please wait…", "info");

        const manifestUrl = `/${encodeURIComponent(
          machineInfo.machineName
        )}/${encodeURIComponent(machineInfo.variantName)}/manifest.json`;

        const response = await fetch(manifestUrl);
        if (!response.body) throw new Error("No stream in response");

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let parsedCount = 0;
        let batch = [];

        // Read manifest stream progressively
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Try to parse chunks (rudimentary JSON array parsing)
          const parts = buffer.split("\n");
          for (let line of parts.slice(0, -1)) {
            try {
              const clean = line.trim().replace(/,$/, "");
              if (!clean || clean === "[" || clean === "]") continue;
              const url = JSON.parse(clean); // each line should be a string path

              let cleanPath = url;
              const idx = url.indexOf("/public/");
              if (idx !== -1) cleanPath = url.substring(idx);

              // Batch images for pagination
              batch.push({
                id: cleanPath,
                url: cleanPath,
                label: cleanPath.split("/").pop(),
              });

              parsedCount++;
              if (parsedCount % 500 === 0) {
                showSnackbar(`${parsedCount} image paths processed…`, "info");
              }

              // When batch reaches IMAGES_PER_PAGE, check existence and add valid ones
              if (batch.length === IMAGES_PER_PAGE) {
                await Promise.all(
                  batch.map(
                    (img) =>
                      new Promise((resolve) => {
                        const testImg = new window.Image();
                        testImg.src = img.url;
                        testImg.onload = () => resolve(img);
                        testImg.onerror = () => resolve(null);
                      })
                  )
                ).then((results) => {
                  setImagesList((prev) => [
                    ...prev,
                    ...results.filter(Boolean),
                  ]);
                });
                batch = [];
              }
            } catch {
              // ignore parse errors until complete chunk
            }
          }
          buffer = parts[parts.length - 1];
        }

        // Process any remaining images in the last batch
        if (batch.length > 0) {
          await Promise.all(
            batch.map(
              (img) =>
                new Promise((resolve) => {
                  const testImg = new window.Image();
                  testImg.src = img.url;
                  testImg.onload = () => resolve(img);
                  testImg.onerror = () => resolve(null);
                })
            )
          ).then((results) => {
            setImagesList((prev) => [...prev, ...results.filter(Boolean)]);
          });
        }

        showSnackbar("Images loaded successfully!", "success");
      } catch (e) {
        console.error("Error fetching images:", e);
        setError(
          "Failed to load images. Please check the network or the folder path."
        );
        showSnackbar("Failed to load images.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
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
        {error && <Alert severity="error" sx={{ mt: 5 }}>{error}</Alert>}
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
          <Box sx={{ mt: 4 }}>
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
          }}
        >
          {currentImage && (
            <img
              src={currentImage.url}
              alt={currentImage.label}
              style={{
                width: "100%",
                maxHeight: "90vh",
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