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
      <AppBar sx={{ background: "linear-gradient(to right, #4b6cb7, #182848)" }}>
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

// import React from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   IconButton,
//   CardActionArea,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate } from "react-router-dom";

// const GalleryPage = () => {
//   const navigate = useNavigate();
//   const machineNames = ["Machine 1", "Machine 2", "Machine 3", "Machine 4"];

//   const gradients = [
//     "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
//     "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
//     "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
//     "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
//   ];

//   return (
//     <>
//       {/* ✅ AppBar remains unchanged */}
//       <AppBar
//         sx={{ background: "linear-gradient(to right, #4b6cb7, #182848)" }}
//       >
//         <Toolbar>
//           <IconButton color="inherit" onClick={() => navigate(-1)}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
//             Select a Machine
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Box
//         sx={{
//           background: "#f5f7fa",
//           minHeight: "100vh",
//           pt: 10,
//           px: 4,
//         }}
//       >
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//             gap: 4,
//           }}
//         >
//           {machineNames.map((name, idx) => (
//             <Card
//               key={idx}
//               sx={{
//                 position: "relative",
//                 height: 300,
//                 borderRadius: 4,
//                 background: gradients[idx % gradients.length],
//                 color: "#fff",
//                 boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
//                 overflow: "hidden",
//                 transition: "transform 0.3s ease, box-shadow 0.3s ease",
//                 backdropFilter: "blur(10px)",
//                 "&:hover": {
//                   transform: "translateY(-8px)",
//                   boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
//                 },
//               }}
//             >
//               <CardActionArea
//                 onClick={() => navigate(`/machine/${encodeURIComponent(name)}`)}
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   textAlign: "center",
//                   position: "relative",
//                 }}
//               >
//                 {/* Card main content */}
//                 <CardContent>
//                   <Typography variant="h5" fontWeight="bold">
//                     {name.split(" ")[0]}
//                   </Typography>
//                   <Typography variant="body2">
//                     Explore {name.toLowerCase()}
//                   </Typography>
//                 </CardContent>

//                 {/* ✅ Hover-growing white panel from bottom */}
//                 <Box
//                   className="hover-reveal"
//                   sx={{
//                     position: "absolute",
//                     bottom: 0,
//                     left: 0,
//                     width: "100%",
//                     height: 0,
//                     backgroundColor: "#fff",
//                     color: "#000",
//                     textAlign: "center",
//                     fontWeight: "bold",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     borderTopLeftRadius: 12,
//                     borderTopRightRadius: 12,
//                     transition: "height 0.4s ease",
//                     overflow: "hidden",
//                     zIndex: 5,
//                   }}
//                 >
//                   {name}
//                 </Box>

//                 {/* Hover effect using parent hover */}
//                 <style>
//                   {`
//                     .MuiCard-root:hover .hover-reveal {
//                       height: 50px;
//                     }
//                   `}
//                 </style>
//               </CardActionArea>
//             </Card>
//           ))}
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default GalleryPage;

