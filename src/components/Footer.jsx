import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import RestoreIcon from "@mui/icons-material/Restore";
import ArchiveIcon from "@mui/icons-material/Archive";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export default function Footer({ onRecentOpen, onApplyLog }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const [value, setValue] = React.useState(0);
  // const [galleryImages, setGalleryImages] = React.useState([]);

  const [recentOpen, setRecentOpen] = React.useState(false);
  // const [favoritesOpen, setFavoritesOpen] = React.useState(false);
  // const [galleryOpen, setGalleryOpen] = React.useState(false);

  const handleRecentOpen = () => setRecentOpen(true);
  const handleRecentClose = () => setRecentOpen(false);

  // const handleFavoritesOpen = () => setFavoritesOpen(true);
  // const handleFavoritesClose = () => setFavoritesOpen(false);

  // const handleGalleryOpen = async () => {
  //   // i will replace this fake api call when api will ready for now this is it.
  //   // const response = await fetch("/random/gallery-req");
  //   // console.log("this is the response in footer: ", response);
  //   // const data = await response.json(); //an array of image URLs
  //   // setGalleryImages(data.images || []);
  //   setGalleryOpen(true);
  // };
  // const handleGalleryClose = () => setGalleryOpen(false);

  return (
    <Box sx={{ pb: { xs: "30px", sm: "20px" }, borderRadius:0}}>
      <CssBaseline />
      <Paper 
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
          px: { xs: 2, sm: 3 },
          background: "linear-gradient(90deg, #002049ff 0%, #182848 100%)",
          color: "white",
          zIndex: theme.zIndex.appBar,
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: { xs: 1, sm: 2 },
          borderRadius: 0,
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        elevation={3}
      >
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
          }}
        >
          &copy; {new Date().getFullYear()} Techasoft Pvt Ltd. All rights
          reserved.
        </Typography>

        <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
          <Button
            variant="text"
            size="small"
            startIcon={<RestoreIcon />}
            onClick={onRecentOpen}
            sx={{
              color: "white",
              textTransform: "none",
              bgcolor: "rgba(0, 148, 177, 0.7)", // A subtle teal
              py: 0.5,
              px: 1.5,
              "&:hover": {
                bgcolor: "rgba(0, 148, 177, 1)", // Brighter on hover
              },
            }}
          >
            Recents
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={<ArchiveIcon />}
            onClick={() => navigate("/gallery")}
            sx={{
              color: "white",
              textTransform: "none",
              bgcolor: "rgba(0, 148, 177, 0.7)",
              py: 0.5,
              px: 1.5,
              "&:hover": {
                bgcolor: "rgba(0, 148, 177, 1)",
              },
            }}
          >
            Gallery
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
