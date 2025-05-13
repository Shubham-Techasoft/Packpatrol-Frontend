// import React from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   IconButton,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate } from "react-router-dom";

// const groupedImages = {
//   "Machine 1": [
//     {
//       id: 1,
//       url: "https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg",
//       variant: "1",
//     },
//     {
//       id: 2,
//       url: "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_640.jpg",
//       variant: "2",
//     },
//   ],
//   "Machine 2": [
//     {
//       id: 3,
//       url: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
//       variant: "1",
//     },
//   ],
//   "Machine 3": [
//     {
//       id: 4,
//       url: "https://c8.alamy.com/comp/MR0G79/random-pictures-MR0G79.jpg",
//       variant: "1",
//     },
//     {
//       id: 5,
//       url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRq1ZxF9BO4pzpRRhRBOmLIN_kj5yFlU6ZHA&s",
//       variant: "2",
//     },
//   ],
//   "Machine 4": [
//     {
//       id: 6,
//       url: "https://www.shutterstock.com/image-photo/these-some-random-photos-260nw-2402066699.jpg",
//       variant: "1",
//     },
//   ],
// };

// const GalleryPage = () => {
//   const navigate = useNavigate();

//   return (
//     <>
//       <AppBar
//         sx={{
//           background: "linear-gradient(to right, #4b6cb7, #182848)",
//         }}
//       >
//         <Toolbar>
//           <IconButton color="inherit" onClick={() => navigate(-1)}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
//             Categorized Machine Gallery
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Box
//         sx={{
//           p: 3,
//           background: "linear-gradient(to right, #f8f9fa, #e0e0e0)",
//           minHeight: "100vh",
//         }}
//       >
//         {Object.keys(groupedImages).map((machine, idx) => (
//           <Accordion
//             key={idx}
//             sx={{
//               background: "linear-gradient(to right, #ffffff, #e3f2fd)",
//               mb: 2,
//               borderRadius: 2,
//             }}
//           >
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                 {machine}
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Grid container spacing={3}>
//                 {groupedImages[machine].map((img) => (
//                   <Grid item xs={12} sm={6} md={4} lg={3} key={img.id}>
//                     <Card
//                       sx={{
//                         borderRadius: 3,
//                         overflow: "hidden",
//                         transition: "0.4s",
//                         background:
//                           "linear-gradient(to right, #f5f7fa, #c3cfe2)",
//                         "&:hover": {
//                           transform: "scale(1.03)",
//                           boxShadow: 6,
//                         },
//                       }}
//                     >
//                       <CardMedia
//                         component="img"
//                         height="200"
//                         image={img.url}
//                         alt={`Variant ${img.variant}`}
//                       />
//                       <CardContent>
//                         <Typography variant="subtitle1">
//                           Variant {img.variant}
//                         </Typography>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             </AccordionDetails>
//           </Accordion>
//         ))}
//       </Box>
//     </>
//   );
// };

// export default GalleryPage;

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  CardActionArea,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const GalleryPage = () => {
  const navigate = useNavigate();
  const machineNames = ["Machine 1", "Machine 2", "Machine 3", "Machine 4"];

  return (
    <>
      <AppBar
        sx={{ background: "linear-gradient(to right, #4b6cb7, #182848)" }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            Select a Machine
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: "linear-gradient(to right, #f8f9fa, #e0e0e0)",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          {machineNames.map((name, idx) => (
            <Card
              key={idx}
              sx={{
                width: 250,
                borderRadius: 3,
                minHeight: "50vh",

                background: "linear-gradient(to right, #ffffff, #e3f2fd)",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/machine/${encodeURIComponent(name)}`)}
                sx={{ minHeight: "50vh" }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default GalleryPage;
