import { useEffect, useRef, useState } from "react";
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
  console.log("Current Process image path:", imageArray)
  const [currentImage, setCurrentImage] = useState(null);
  console.log("current Processed image path:")

  // Queue for loaded images
  const queueRef = useRef({});
  const nextFrameId = useRef(0);
  const frameCounter = useRef(0);

  // Preload whenever new path arrives
  useEffect(() => {
    if (!imageArray) return;

    const id = frameCounter.current++;
    const img = new Image();
    img.src = `${imageArray}?ts=${Date.now()}`; // cache-bust

    img.onload = () => {
      queueRef.current[id] = img.src; // store by frame id
    };
  }, [imageArray]);

  // Playback loop: shows frames in order
  useEffect(() => {
    const player = setInterval(() => {
      const id = nextFrameId.current;
      if (queueRef.current[id]) {
        setCurrentImage(queueRef.current[id]);
        delete queueRef.current[id];
        nextFrameId.current++;
      }
    }, 100); // ~10fps

    return () => clearInterval(player);
  }, []);

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