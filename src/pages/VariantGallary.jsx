import React, { useState, useEffect, useCallback } from "react";
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
  Chip,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [total_images, setTotalImages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [goToPage, setGoToPage] = useState("");
  const [showGoToPage, setShowGoToPage] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);
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

  const handleOpen = (index) => {
    setCurrentImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentImageIndex(null);
  };

  const handleNextImage = useCallback(() => {
    if (currentImageIndex === null) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imagesList.length - 1 ? 0 : prevIndex + 1
    );
  }, [currentImageIndex, imagesList.length]);

  const handlePrevImage = useCallback(() => {
    if (currentImageIndex === null) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imagesList.length - 1 : prevIndex - 1
    );
  }, [currentImageIndex, imagesList.length]);

  const currentImage = currentImageIndex !== null ? imagesList[currentImageIndex] : null;

  // Fetch images from the new paginated API
  const fetchImages = useCallback(async (currentPage, pageSize = itemsPerPage) => {
    try {
      setLoading(true);
      setError(null);

      showSnackbar("Loading images from database...", "info");
      
      const response = await fetch(
        `${base_URL}/api/gallery/${machineId}/${variantId}?page=${currentPage}&page_size=${pageSize}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images from database");
      }

      const data = await response.json();
      console.log("Gallery API response status:", data);

      const imageObjects = data.results.map((img) => ({
        id: img.id,
        url: img.image_url,
        label: img.image_url.split("/").pop() || "Image",
        timestamp: img.timestamp,
        is_rejected: img.is_rejected,
        stack_length: img.stack_length,
        stack_count: img.stack_count,
      }));

      setImagesList(imageObjects);
      setPage(data.page || 1);
      setTotalImages(data.total_images || 0);
      setPageCount(data.total_pages || Math.ceil(data.total_images / data.page_size) || 1);
      showSnackbar(`Loaded ${imageObjects.length} images successfully!`, "success");

    } catch (err) {
      console.error("Error fetching gallery images:", err);
      setError("Failed to load images from database.");
      setImagesList([]);
      setPageCount(0);
      setTotalImages(0);
      showSnackbar("Failed to load images.", "error");
    } finally {
      setLoading(false);
    }
  }, [machineId, variantId, itemsPerPage]);

  // Fetch images when component mounts or page changes
  useEffect(() => {
    fetchImages(page, itemsPerPage);
  }, [page, itemsPerPage, fetchImages]);

  // Add keyboard navigation for the dialog
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!open) return;
      if (event.key === 'ArrowRight') {
        handleNextImage();
      } else if (event.key === 'ArrowLeft') {
        handlePrevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handlePageChange = (event, value) => {
    setPage(value);
    setGoToPage("");
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(goToPage);
    if (pageNum >= 1 && pageNum <= pageCount) {
      setPage(pageNum);
      setGoToPage("");
      setShowGoToPage(false);
    } else {
      showSnackbar(`Please enter a page number between 1 and ${pageCount}`, "error");
    }
  };

  const handleGoToPageKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleGoToPage();
    }
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = event.target.value;
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Reset to first page when changing items per page
  };

  return (
    <>
      <AppBar sx={{ background: "#062249", height:'fit-content', position:'static' }}>
        <Toolbar sx={{ minHeight: "fit-content !important", padding: "0px 16px"}}>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{fontSize:'smaller'}} />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h8">
            {variantName}'s Image Gallery
          </Typography>
          {!loading && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {total_images} images
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
          paddingBottom: "10vh",
        }}
      >
        {/* Pagination Controls Header */}
        {!loading && !error && pageCount > 1 && (
          <Box sx={{ 
            width: "100%", 
            maxWidth: "xl", 
            mb: 3, 
            display: "flex", 
            flexDirection: isSmallScreen ? "column" : "row",
            justifyContent: "space-between", 
            alignItems: isSmallScreen ? "stretch" : "center",
            gap: 2,
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 1
          }}>
            {/* Left side - Items per page selector */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Show:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  displayEmpty
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2" color="textSecondary">
                per page
              </Typography>
            </Box>

            {/* Center - Page info and Go to page */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Page {page} of {pageCount} • {total_images} total images
              </Typography>
              
              {showGoToPage ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    size="small"
                    value={goToPage}
                    onChange={(e) => setGoToPage(e.target.value.replace(/[^0-9]/g, ''))}
                    onKeyPress={handleGoToPageKeyPress}
                    placeholder={`1-${pageCount}`}
                    sx={{ width: 'fit-content' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            size="small" 
                            onClick={handleGoToPage}
                            disabled={!goToPage}
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button 
                    size="small" 
                    onClick={() => setShowGoToPage(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => setShowGoToPage(true)}
                >
                  Go to Page
                </Button>
              )}
            </Box>

            {/* Right side - Main pagination */}
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              size={isSmallScreen ? "small" : "medium"}
            />
          </Box>
        )}

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
          sx={{ width: "100%", justifyContent: "flex-start" }}
        >
          {!loading &&
            !error &&
            imagesList.map((img, index) => (
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
                    border: img.is_rejected ? '2px solid #d32f2f' : 'none',
                    bgcolor: img.is_rejected ? '#ffdfe4ff' : 'background.paper',
                  }}
                  onClick={() => handleOpen(index)}
                >
                  <CardMedia
                    component="img"
                    height={isSmallScreen ? "150" : "220"}
                    image={img.url}
                    alt={img.label}
                    sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
                  />
                  <CardContent
                    sx={{ p: 2, textAlign: 'left' }}
                  >
                    {img.is_rejected ? (
                      <Chip label="Rejected" color="error" size="small" sx={{ mb: 1, fontWeight: 'bold' }} />
                    ): (
                      <Chip label="Accepted" color="success" size="small" sx={{ mb: 1, fontWeight: 'bold' }} />
                    )}
                    {img.timestamp && (
                        <Typography variant="caption" color="textSecondary" display="block">
                          {new Date(img.timestamp)} IST
                        </Typography>
                    )}
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          Stack Count
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {img.stack_count}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          Stack Length
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {img.stack_length?.toFixed(2)} mm
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Bottom Pagination for mobile */}
        {!loading && !error && pageCount > 1 && isSmallScreen && (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="small"
            />
          </Box>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}>
        {currentImage && (
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <DialogTitle sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>{currentImage.label}</Typography>
              <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                <ArrowBackIcon />
              </IconButton>
            </DialogTitle>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <IconButton onClick={handlePrevImage} sx={{ position: 'absolute', left: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                <ArrowBackIosIcon />
              </IconButton>
            <img
              src={currentImage.url}
              alt={currentImage.label}
              style={{
                maxWidth: "100%",
                maxHeight: "calc(100vh - 128px)", // Adjust for title and actions height
                objectFit: "contain",
              }}
            />
              <IconButton onClick={handleNextImage} sx={{ position: 'absolute', right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
            <DialogActions sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
              <Grid container spacing={2} sx={{ textAlign: 'center', color: 'white' }}>
                <Grid item xs={4}>
                  <Typography variant="caption">Timestamp</Typography>
                  <Typography>{new Date(currentImage.timestamp).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption">Stack Count</Typography>
                  <Typography>{currentImage.stack_count}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption">Stack Length</Typography>
                  <Typography>{currentImage.stack_length?.toFixed(2)} mm</Typography>
                </Grid>
              </Grid>
            </DialogActions>
          </Box>
        )}
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