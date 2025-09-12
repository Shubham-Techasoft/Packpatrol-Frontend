import { useEffect, useState } from "react";
import { Box } from "@mui/material";

function LiveImageFeed({ imageArray }) {

  // //Working but slow refresh
  // const [currentImage, setCurrentImage] = useState(null);

  // useEffect(() => {
  //   if (!imageArray) return;

  //   // Preload image
  //   const img = new Image();
  //   img.src = imageArray;

  //   img.onload = () => {
  //     setCurrentImage(imageArray); // Only set when loaded
  //   };
  // }, [imageArray]);

  // ----------- new experimental code---------------------
  const [currentImage, setCurrentImage] = useState(null);
  const [nextImage, setNextImage] = useState(null);

  useEffect(() => {
    if (!imageArray) return;

    const img = new Image();
    img.src = imageArray;

    img.onload = () => {
      setNextImage(imageArray);
    };
  }, [imageArray]);

  useEffect(() => {
    if (nextImage) {
      setCurrentImage(nextImage); // swap only when ready
      setNextImage(null);
    }
  }, [nextImage]);

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
          key={currentImage}
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