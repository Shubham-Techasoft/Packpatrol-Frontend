// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   IconButton,
//   Zoom,
//   useMediaQuery,
//   useTheme,
//   Dialog,
//   DialogContent,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate, useParams } from "react-router-dom";

// const imagesList = [
//   { id: 1, url: "https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg", label: "Image 1" },
//   { id: 2, url: "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_640.jpg", label: "Image 2" },
//   { id: 3, url: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg", label: "Image 3" },
//   { id: 4, url: "https://c8.alamy.com/comp/MR0G79/random-pictures-MR0G79.jpg", label: "Image 4" },
//   { id: 5, url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRq1ZxF9BO4pzpRRhRBOmLIN_kj5yFlU6ZHA&s", label: "Image 5" },
// ];

// const VariantGallary = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const { variantName } = useParams();

//   const [open, setOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState(null);
  

//   const handleOpen = (img) => {
//     setCurrentImage(img);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setCurrentImage(null);
//   };

//   return (
//     <>
//       <AppBar
//         position="static"
//         sx={{
//           background: "linear-gradient(to right, #4b6cb7, #182848)",
//           boxShadow: theme.shadows[4],
//         }}
//       >
//         <Toolbar sx={{ minHeight: "fit-content", padding: "4px 16px" }}>
//           <IconButton color="inherit" onClick={() => navigate(-1)}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h6" sx={{ ml: 2, flex: 1, fontWeight: 600, letterSpacing: "0.5px" }}>
//             {variantName}'s Image Gallery
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Box
//         sx={{
//           p: 4,
//           background: "#f4f6f8",
//           minHeight: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Grid container spacing={4} maxWidth="xl" sx={{ width: "100%", justifyContent: "start" }}>
//           {imagesList.map((img) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={img.id}>
//               <Zoom in style={{ transitionDelay: `${img.id * 100}ms` }}>
//                 <Card
//                   sx={{
//                     borderRadius: 4,
//                     boxShadow: theme.shadows[2],
//                     transition: "transform 0.2s, box-shadow 0.2s",
//                     cursor: "pointer",
//                     "&:hover": {
//                       transform: "scale(1.05)",
//                       boxShadow: theme.shadows[8],
//                     },
//                   }}
//                   onClick={() => handleOpen(img)}
//                 >
//                   <CardMedia
//                     component="img"
//                     height={isSmallScreen ? "150" : "220"}
//                     image={img.url}
//                     alt={img.label}
//                     sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
//                   />
//                   <CardContent sx={{ padding: theme.spacing(2), textAlign: "center" }}>
//                     <Typography variant="subtitle1" fontWeight="bold" color="textSecondary" gutterBottom>
//                       {img.label}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Zoom>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       {/* Dialog for zoom */}
//       <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
//         <DialogContent
//           sx={{
//             p: 0,
//             backgroundColor: "rgba(0,0,0,0.9)",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           {currentImage && (
//             <img
//               src={currentImage.url}
//               alt={currentImage.label}
//               style={{
//                 width: "100%",
//                 maxHeight: "90vh",
//                 objectFit: "contain",
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default VariantGallary;
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
  Zoom,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";

const VariantGallary = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { machineName, variantName } = useParams();

  const [imagesList, setImagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const handleOpen = (img) => {
    setCurrentImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentImage(null);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Encode folder names safely
        console.log(machineName,variantName)
        const manifestUrl = `/${encodeURIComponent(machineName)}/${encodeURIComponent(variantName)}/manifest.json`;
        console.log("Fetching manifest from:", manifestUrl);

        const response = await fetch(manifestUrl);
        if (!response.ok) {
          throw new Error(`Failed to load manifest. Status: ${response.status}`);
        }

        const filenames = await response.json(); // ← should be an array
        console.log("Manifest fetch response:", filenames);

        if (!Array.isArray(filenames)) {
          throw new Error("Manifest is not an array");
        }

        // Build image objects with encoded URLs
        const loadedImages = filenames.map((filename) => ({
          id: filename,
          url: `/${encodeURIComponent(machineName)}/${encodeURIComponent(
            variantName
          )}/${encodeURIComponent(filename)}`,
          label: filename,
        }));

        setImagesList(loadedImages);
      } catch (e) {
        console.error("Error fetching images:", e);
        setError(
          "Failed to load images. Please check the network or the folder path."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
    const intervalId = setInterval(fetchImages, 10000);
    return () => clearInterval(intervalId);
  }, [machineName, variantName]);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #4b6cb7, #182848)",
          boxShadow: theme.shadows[4],
        }}
      >
        <Toolbar sx={{ minHeight: "fit-content", padding: "4px 16px" }}>
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

        <Grid container spacing={4} maxWidth="xl" sx={{ width: "100%", justifyContent: "start" }}>
          {!loading &&
            !error &&
            imagesList.map((img) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={img.id}>
                <Zoom in style={{ transitionDelay: `${imagesList.indexOf(img) * 100}ms` }}>
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
                    <CardContent sx={{ padding: theme.spacing(2), textAlign: "center" }}>
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
                </Zoom>
              </Grid>
            ))}
        </Grid>
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
    </>
  );
};

export default VariantGallary;
