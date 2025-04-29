import { useEffect, useState } from "react";
import { Box } from "@mui/material";

function LiveImageFeed({ imageArray }) {
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    if (imageArray.length > 0) {
      setCurrentImage(imageArray[imageArray.length - 1]);
    }
  }, [imageArray]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "auto",
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
        padding: 1,
      }}
    >
      {currentImage ? (
        <img
          src={currentImage}
          alt="Live Feed"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <p>There is no live updates yet.......</p>
      )}
    </Box>
  );
}

export default LiveImageFeed;
