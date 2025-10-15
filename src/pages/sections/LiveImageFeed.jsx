import React from "react";
import { Box } from "@mui/material";

// Helper to convert backend absolute path → frontend static path
const convertToWebPath = (absolutePath) => {
  if (!absolutePath) return null;

  // If path contains "media", it's hosted on the server - add localhost:8000
  if (absolutePath.includes("media")) {
    return `http://127.0.0.1:8000/${absolutePath}`;
  }

  // Work for both "home/packpatrol-frontend/public/..." and "/home/techasoft-testing-pc/PackImages/..."
  const idx = absolutePath.indexOf("/public/");
  if (idx !== -1) {
    const cleanImagePath = absolutePath.substring(idx);
    return cleanImagePath;
  }

  return absolutePath.replace(
    "/home/techasoft-testing-pc/PackImages",
    "/public/packimages"
  );
};

export default function LiveImageFeed({ status, imagePath, connectionStatus }) {
  const currentImage = convertToWebPath(imagePath);

  const getStatusMessage = () => {
    if (status !== "running") {
      return "Machine stopped — no live feed.";
    }
    if (currentImage) {
      return "Receiving live feed...";
    }
    return "Connected, waiting for frames...";
  };

  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "58vh",
        backgroundColor: "#f7f7f7",
        position: "relative",
      }}
    >
      {status === "running" && connectionStatus && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: "4px 8px",
            borderRadius: 1,
            fontSize: "0.75rem",
            backgroundColor:
              connectionStatus === "connected" ||
              connectionStatus === "receiving_frames"
                ? "success.light"
                : connectionStatus.includes("error")
                ? "error.light"
                : "warning.light",
            color: "white",
            zIndex: 10,
          }}
        >
          {connectionStatus}
        </Box>
      )}
      {status === "running" ? (
        currentImage ? (
          <Box
            component="img"
            src={currentImage}
            alt="Live feed"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
            onError={() => {
              console.warn("⚠️ Image display error, clearing current image");
              // The parent component will handle clearing the image path
            }}
          />
        ) : (
          <Box sx={{ textAlign: "center", color: "text.secondary", p: 3 }}>
            {getStatusMessage()}
          </Box>
        )
      ) : (
        <Box sx={{ textAlign: "center", color: "text.secondary", p: 3 }}>
          {getStatusMessage()}
        </Box>
      )}
    </Box>
  );
}