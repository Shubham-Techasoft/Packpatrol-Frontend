// import { useEffect, useRef, useState } from "react";
// import { Box } from "@mui/material";

// function LiveImageFeed({ imageArray }) {
//   console.log("imagePathRecieved:", imageArray)

//   // //Working but slow refresh
//   // const [currentImage, setCurrentImage] = useState(null);

//   // useEffect(() => {
//   //   if (!imageArray) return;

//   //   // Preload image
//   //   const img = new Image();
//   //   img.src = imageArray;

//   //   img.onload = () => {
//   //     setCurrentImage(imageArray); // Only set when loaded
//   //   };
//   // }, [imageArray]);



//   // ----------- new experimental code--------------------- with queue [delay to live video issue]
//   // const [currentImage, setCurrentImage] = useState(null);

//   // console.log("Current Processing image path:", imageArray)
//   // console.log("current Processed image path:", currentImage)

//   // // Queue for loaded images
//   // const queueRef = useRef({});
//   // const nextFrameId = useRef(0);
//   // const frameCounter = useRef(0);

//   // // Preload whenever new path arrives
//   // useEffect(() => {
//   //   if (!imageArray) return;

//   //   const id = frameCounter.current++;
//   //   const img = new Image();
//   //   img.src = `${imageArray}?ts=${Date.now()}`; // cache-bust

//   //   img.onload = () => {
//   //     queueRef.current[id] = img.src; // store by frame id
//   //   };
//   // }, [imageArray]);
  
//   // // Playback loop: shows frames in order
//   // useEffect(() => {
//   //   const player = setInterval(() => {
//   //     const id = nextFrameId.current;
//   //     if (queueRef.current[id]) {
//   //       setCurrentImage(queueRef.current[id]);
//   //       delete queueRef.current[id];
//   //       nextFrameId.current++;
//   //     }
//   //   }, 500); // ~10fps

//   //   return () => clearInterval(player);
//   // }, []);
  
  
//   // ----------- new experimental code--------------------- without queue
//   // const [currentImage, setCurrentImage] = useState(null);

//   // useEffect(() => {
//   //   if (!imageArray) return;

//   //   // Preload image to avoid flicker
//   //   const img = new Image();
//   //   img.src = `${imageArray}?ts=${Date.now()}`; // cache-bust each frame

//   //   img.onload = () => {
//   //     setCurrentImage(img.src); // set immediately when loaded
//   //   };

//   //   return () => {
//   //     img.onload = null; // cleanup
//   //   };
//   // }, [imageArray]);



//   // latest updated with queue with no delay
//   const [currentImage, setCurrentImage] = useState(null);
//   console.log("currentImage Path:", currentImage)

//   const queueRef = useRef({});
//   const nextFrameId = useRef(0);
//   const frameCounter = useRef(0);

//   // Preload whenever new path arrives
//   useEffect(() => {
//     if (!imageArray) return;

//     const id = frameCounter.current++;
//     const img = new Image();
//     img.src = `${imageArray}?ts=${Date.now()}`; // cache-bust

//     img.onload = () => {
//       queueRef.current[id] = img.src;
//       setCurrentImage(img.src);
//     };
//   }, [imageArray]);

//   // Playback loop
//   useEffect(() => {
//     const player = setInterval(() => {
//       const id = nextFrameId.current;
//       if (queueRef.current[id]) {
//         console.log("adding image to current:", queueRef.current[id])
//         setCurrentImage(queueRef.current[id]);
//         delete queueRef.current[id];
//         nextFrameId.current++;
//       }
//     }, 100);

//     return () => clearInterval(player);
//   }, []);

//   // Handle tab visibility / focus
//   useEffect(() => {
//     const handleVisibility = () => {
//       if (!document.hidden) {
//         // Tab became active again
//         const allIds = Object.keys(queueRef.current).map(Number);
//         if (allIds.length > 2) {
//           const latestId = Math.max(...allIds);
//           // Keep only latest frame
//           const latestFrame = queueRef.current[latestId];
//           queueRef.current = { [latestId]: latestFrame };
//           nextFrameId.current = latestId;
//         }
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibility);
//     window.addEventListener("focus", handleVisibility);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibility);
//       window.removeEventListener("focus", handleVisibility);
//     };
//   }, []);


//   return (
//     <Box
//       sx={{
//         width: "100%",
//         // maxWidth: 850,
//         margin: "auto",
//         borderRadius: 7,
//         // boxShadow: currentImage ? 1 : "none",
//         overflow: "hidden",
//         // overflow: "scroll",
//         paddingY: 0.9,
//         paddingX: 0.5,
//       }}
//     >
//       {currentImage !== null ? (
//         <img
//           key={currentImage}
//           src={currentImage}
//           alt="Live Feed"
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             display: "block",
//           }}
//         />
//       ) : (
//         <p
//           style={{
//             textAlign: "center",
//             boxShadow: "none !important",
//             fontSize: "1.2rem",
//             fontFamily: "Arial, sans-serif",
//             letterSpacing: "0.1em",
//             wordSpacing: "0.2em",
//           }}
//         >
//           There is no live updates yet.......
//         </p>
//       )}
//     </Box>
//   );
// }

// export default LiveImageFeed;

import { Box } from "@mui/material";

function LiveImageFeed({ imageArray }) {
  console.log(imageArray)
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
        display: "flex",
        justifyContent: "center",
        alignItems:"center"
      }}
    >
      {imageArray ? (
        <Box
          component="img"
          src={imageArray}
          alt="Live frame"
          sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", height:"50vh" }}
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