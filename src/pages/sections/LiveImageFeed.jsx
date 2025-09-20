
// import { Box } from "@mui/material";

// function LiveImageFeed({ imagePath }) {
//   console.log(imagePath)
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
//         display: "flex",
//         justifyContent: "center",
//         alignItems:"center"
//       }}
//     >
//       {imagePath ? (
//         <Box
//           component="img"
//           src={imagePath}
//           alt="Live frame"
//           sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", height:"50vh" }}
//         />
//       ) : (
//          <p
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
//    );
// }

// export default LiveImageFeed;

import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

function LiveImageFeed({ imagePath }) {
  const [currentImage, setCurrentImage] = useState(null);
  const queueRef = useRef([]);
  const inFlightCountRef = useRef(0);
  const MAX_CONCURRENT_LOADS = 3;

  // Parallel image preloader (like enqueuePreload)
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      let timeoutId = null;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        img.onload = null;
        img.onerror = null;
      };

      img.onload = () => {
        cleanup();
        resolve(url);
      };
      img.onerror = () => {
        cleanup();
        reject(new Error("Image failed to load"));
      };

      img.src = `${url}?t=${Date.now()}`; // cache-bust
      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error("Image load timeout (5s)"));
      }, 5000);
    });
  };

  // Whenever new path arrives, enqueue it
  useEffect(() => {
    if (!imagePath) return;

    if (inFlightCountRef.current >= MAX_CONCURRENT_LOADS) {
      console.warn("⚠️ Too many parallel loads, skipping frame:", imagePath);
      return;
    }

    inFlightCountRef.current++;

    preloadImage(imagePath)
      .then((loadedUrl) => {
        queueRef.current.push(loadedUrl);
      })
      .catch((err) => {
        console.warn("⚠️ Dropping frame:", imagePath, err.message);
      })
      .finally(() => {
        inFlightCountRef.current--;
      });
  }, [imagePath]);

  // Playback loop
  useEffect(() => {
    const id = setInterval(() => {
      const q = queueRef.current;

      // Only keep the latest frame if multiple are waiting
      if (q.length > 1) {
        queueRef.current = [q[q.length - 1]];
      }

      const next = queueRef.current.shift();
      if (next) setCurrentImage(next);
    }, 100);

    return () => clearInterval(id);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
        borderRadius: 7,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      {currentImage ? (
        <Box
          component="img"
          src={currentImage}
          alt="Live frame"
          sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      ) : (
        <p
          style={{
            textAlign: "center",
            fontSize: "1.2rem",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "0.1em",
            wordSpacing: "0.2em",
          }}
        >
          There is no live updates yet...
        </p>
      )}
    </Box>
  );
}

export default LiveImageFeed;
