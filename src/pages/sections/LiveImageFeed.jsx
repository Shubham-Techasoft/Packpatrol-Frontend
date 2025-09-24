
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

import { useEffect, useRef, useState, useCallback } from "react";
import { Box } from "@mui/material";

const MAX_QUEUE_SIZE = 5;
const MAX_CONCURRENT_LOADS = 3;
const CLEANUP_INTERVAL = 30000;

function LiveImageFeed({ imagePath }) {
  const [currentImage, setCurrentImage] = useState(null);
  const queueRef = useRef([]);
  const inFlightCountRef = useRef(0);
  const abortControllerRef = useRef(null);
  const intervalRef = useRef(null);

  // All hooks and callbacks must be inside the component!
  const cleanup = useCallback(() => {
    queueRef.current = [];
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    inFlightCountRef.current = 0;
    setCurrentImage(null);
    console.log("🧹 Memory cleanup completed");
  }, []);

  const monitorMemory = useCallback(() => {
    if (queueRef.current.length > MAX_QUEUE_SIZE) {
      console.warn(`⚠️ Queue size (${queueRef.current.length}) exceeds limit (${MAX_QUEUE_SIZE}), clearing queue`);
      cleanup();
    }
    if (window.gc) {
      window.gc();
    }
  }, [cleanup]);

  const preloadImage = useCallback((url) => {
    return new Promise((resolve, reject) => {
      if (abortControllerRef.current?.signal.aborted) {
        reject(new Error("Request cancelled"));
        return;
      }
      const img = new Image();
      let timeoutId = null;
      let hasResolved = false;
      const cleanupImg = () => {
        if (timeoutId) clearTimeout(timeoutId);
        img.onload = null;
        img.onerror = null;
        img.src = '';
      };
      const resolveOnce = (value) => {
        if (!hasResolved) {
          hasResolved = true;
          cleanupImg();
          resolve(value);
        }
      };
      const rejectOnce = (error) => {
        if (!hasResolved) {
          hasResolved = true;
          cleanupImg();
          reject(error);
        }
      };
      img.onload = () => resolveOnce(url);
      img.onerror = () => rejectOnce(new Error("Image failed to load"));
      img.src = `${url}?t=${Date.now()}`;
      timeoutId = setTimeout(() => {
        rejectOnce(new Error("Image load timeout (3s)"));
      }, 3000);
      abortControllerRef.current?.signal.addEventListener('abort', () => {
        rejectOnce(new Error("Request cancelled"));
      });
    });
  }, []);

  useEffect(() => {
    if (!imagePath) return;
    if (inFlightCountRef.current >= MAX_CONCURRENT_LOADS) {
      console.warn("⚠️ Too many parallel loads, skipping frame:", imagePath);
      return;
    }
    if (queueRef.current.length >= MAX_QUEUE_SIZE) {
      console.warn("⚠️ Queue full, dropping oldest frame");
      queueRef.current.shift();
    }
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }
    inFlightCountRef.current++;
    preloadImage(imagePath)
      .then((loadedUrl) => {
        if (queueRef.current.length < MAX_QUEUE_SIZE) {
          queueRef.current.push(loadedUrl);
          console.log(`✅ Image loaded and queued: ${loadedUrl}`);
        } else {
          console.warn("⚠️ Queue full after load, discarding:", loadedUrl);
        }
      })
      .catch((err) => {
        if (err.message !== "Request cancelled") {
          console.warn("⚠️ Failed to load frame:", imagePath, err.message);
        }
      })
      .finally(() => {
        inFlightCountRef.current--;
      });
  }, [imagePath, preloadImage]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const q = queueRef.current;
      monitorMemory();
      if (q.length > 1) {
        const latest = q[q.length - 1];
        queueRef.current = [latest];
        console.log("🗑️ Cleared old frames, keeping latest");
      }
      const next = queueRef.current.shift();
      if (next) {
        setCurrentImage(next);
      }
    }, 200);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [monitorMemory]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      monitorMemory();
    }, CLEANUP_INTERVAL);
    return () => clearInterval(cleanupInterval);
  }, [monitorMemory]);

  useEffect(() => {
    return () => {
      console.log("🛑 Component unmounting, cleaning up...");
      cleanup();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cleanup]);

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
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            height: "100%"
          }}
          onError={(e) => {
            console.warn("❌ Image display error:", e);
            setCurrentImage(null);
          }}
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