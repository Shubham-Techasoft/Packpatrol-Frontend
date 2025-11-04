import React from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";

const groupedImages = {
  "Machine 1": [
    {
      id: 1,
      url: "https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg",
      variant: "1",
    },
    {
      id: 2,
      url: "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_640.jpg",
      variant: "2",
    },
  ],
  "Machine 2": [
    {
      id: 3,
      url: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
      variant: "1",
    },
  ],
  "Machine 3": [
    {
      id: 4,
      url: "https://c8.alamy.com/comp/MR0G79/random-pictures-MR0G79.jpg",
      variant: "1",
    },
    {
      id: 5,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRq1ZxF9BO4pzpRRhRBOmLIN_kj5yFlU6ZHA&s",
      variant: "2",
    },
  ],
  "Machine 4": [
    {
      id: 6,
      url: "https://www.shutterstock.com/image-photo/these-some-random-photos-260nw-2402066699.jpg",
      variant: "1",
    },
  ],
};

const MachineGallery = () => {
  const { machineName } = useParams();
  const navigate = useNavigate();
  console.log("Machine Name from URL:", machineName);
  console.log("Keys in groupedImages:", Object.keys(groupedImages));
  const images = groupedImages[decodeURIComponent(machineName)];
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    // <>
    //   <AppBar
    //     sx={{ background: "linear-gradient(to right, #4b6cb7, #182848)" }}
    //   >
    //     <Toolbar>
    //       <IconButton color="inherit" onClick={() => navigate(-1)}>
    //         <ArrowBackIcon />
    //       </IconButton>
    //       <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
    //         {machineName} Gallery
    //       </Typography>
    //     </Toolbar>
    //   </AppBar>

    //   <Box sx={{ p: 3, background: "#f4f6f8", minHeight: "100vh" }}>
    //     <Grid container spacing={3}>
    //       {images?.map((img) => (
    //         <Grid item xs={12} sm={6} md={4} lg={3} key={img.id}>
    //           <Card
    //             sx={{
    //               borderRadius: 3,
    //               background: "linear-gradient(to right, #f5f7fa, #c3cfe2)",
    //               transition: "0.3s",
    //               "&:hover": {
    //                 transform: "scale(1.03)",
    //                 boxShadow: 6,
    //               },
    //             }}
    //           >
    //             <CardMedia
    //               component="img"
    //               height="200"
    //               image={img.url}
    //               alt={`Variant ${img.variant}`}
    //             />
    //             <CardContent>
    //               <Typography variant="subtitle1">
    //                 Variant {img.variant}
    //               </Typography>
    //             </CardContent>
    //           </Card>
    //         </Grid>
    //       ))}
    //     </Grid>
    //   </Box>
    // </>
    <>
      <AppBar sx={{ background: "#062249", height:'fit-content', position:'static' }}>
        <Toolbar sx={{ minHeight: "fit-content !important", padding: "0px 16px"}}>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{fontSize:'smaller'}} />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h8">
            {machineName} Gallery
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
        {/* <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          color="primary"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          Explore {machineName} Variants
        </Typography> */}
        <Grid
          container
          spacing={4}
          maxWidth="xl"
          sx={{
            width: "100%",
            justifyContent: "center",
          }}
        >
          {images?.map((img) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={img.id}>
              <Zoom in style={{ transitionDelay: `${img.id * 100}ms` }}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: theme.shadows[2],
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={isSmallScreen ? "150" : "220"}
                    image={img.url}
                    alt={`Variant ${img.variant}`}
                    sx={{
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                    }}
                  />
                  <CardContent
                    sx={{
                      padding: theme.spacing(2),
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="textSecondary"
                      gutterBottom
                    >
                      Variant {img.variant}
                    </Typography>
                    {/* You could add more details here if available */}
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default MachineGallery;
