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
        // maxWidth: 850,
        margin: "auto",
        borderRadius: 7,
        // boxShadow: currentImage ? 1 : "none",
        overflow: "hidden",
        // overflow: "scroll",
        paddingY: 0.9,
        paddingX: 0.5,
      }}
    >
      {currentImage ? (
        <img
          src={currentImage}
          alt="Live Feed"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <p
          style={{
            textAlign: "center",
            boxShadow: "none !important",
            fontSize: "1.2rem",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "0.1em",
            wordSpacing: "0.2em",
          }}
        >
          There is no live updates yet.......
        </p>
      )}
    </Box>
  );
}

export default LiveImageFeed;
