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
import {base_URL} from '../utils/api';

const IMAGES_PER_PAGE = 20;

const VariantGallaryView = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { machineName, variantName, machineId, variantId } = useParams();

  const [imagesList, setImagesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
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

  // Fetch images from the new paginated API
  const fetchImages = async (currentPage) => {
    try {
      setLoading(true);
      setError(null);

      showSnackbar("Loading images from database...", "info");
      
      const response = await fetch(
        `${base_URL}/api/gallery/${machineId}/${variantId}?page=${currentPage}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images from database");
      }

      const data = await response.json(); // Expects { page, page_size, total_pages, total_images, results }
      console.log("Gallery API response status:", data);

      // Convert to image objects with enhanced metadata
      const imageObjects = data.results.map((img) => {
        return {
          id: img.id,
          url: img.image_url,
          label: img.image_url.split("/").pop() || "Image",
          timestamp: img.timestamp,
          is_rejected: img.is_rejected,
          stack_length: img.stack_length,
          stack_count: img.stack_count,
        };
      });

      setImagesList(imageObjects);
      setPage(data.page || 1);
      setPageCount(data.total_pages || Math.ceil(data.total_images / data.page_size) || 1);
      showSnackbar(`Loaded ${imageObjects.length} images successfully!`, "success");

    } catch (err) {
      console.error("Error fetching gallery images:", err);
      setError("Failed to load images from database.");
      setImagesList([]);
      setPageCount(0);
      showSnackbar("Failed to load images.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch images when component mounts or page changes
  useEffect(() => {
    fetchImages(page);
  }, [page, machineName, variantName]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
            {variantName}'s Image Gallery
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
                Make sure the gallery images API endpoint is running.
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
            imagesList.map((img) => (
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
                    border: img.is_rejected ? '2px solid #ff4444' : 'none',
                    opacity: img.is_rejected ? 0.7 : 1,
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
                    {img.timestamp && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        {new Date(img.timestamp).toLocaleDateString()}
                      </Typography>
                    )}
                    {img.stack_count > 1 && (
                      <Typography variant="caption" color="primary" display="block">
                        Stack: {img.stack_count}
                      </Typography>
                    )}
                    {img.is_rejected && (
                      <Typography variant="caption" color="error" display="block">
                        Rejected
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Pagination controls */}
        {!loading && !error && pageCount > 1 && (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Page {page} of {pageCount}
            </Typography>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
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