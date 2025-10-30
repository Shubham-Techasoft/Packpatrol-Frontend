import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import {base_URL} from '../../utils/api';

// Helper to convert backend absolute path → frontend static path
const convertToWebPath = (absolutePath) => {
  if (!absolutePath) return null;

  absolutePath = absolutePath.trim();

  if (absolutePath.includes("ImageLogs")) {
    const relativePath = absolutePath.split("ImageLogs").pop();
    return `${base_URL}/media/ImageLogs${relativePath}`;
  }

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

export default function LiveImageFeed({ status, imagePath, connectionStatus, statusDescription }) {
  const startTimeRef = useRef(null);

  // Start timer when a new imagePath is received
  useEffect(() => {
    if (imagePath) {
      startTimeRef.current = performance.now();
      // console.log(`[Perf] 🖼️ Image path received: ${imagePath.substring(imagePath.lastIndexOf('/') + 1)}`);
    } else if (startTimeRef.current !== null) {
      // console.log("[Perf] 🖼️ Image path cleared.");
    } else {
      startTimeRef.current = null;
    }
  }, [imagePath]);

  const pathProcessStart = performance.now();
  const currentImage = convertToWebPath(imagePath);
  const pathProcessEnd = performance.now();

  const getStatusMessage = () => {
    // Prioritize specific status description from SSE if available and relevant
    if (status === "running" && !currentImage && statusDescription) {
      return statusDescription;
    }
    if (status !== "running") {
      return "Machine stopped — no live feed.";
    }
    if (currentImage) {
      return "Receiving live feed...";
    }
    return "Connected, waiting for frames..."; // Fallback
  };

  const handleImageLoad = () => {
    const endTime = performance.now();
    const totalTime = endTime - (startTimeRef.current || endTime);
    console.log(`[Perf] ✅ Image Loaded & Shown: Total time was ${totalTime.toFixed(2)}ms.`);
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
            onLoad={handleImageLoad}
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