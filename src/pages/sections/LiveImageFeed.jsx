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
const MAX_CONCURRENT_LOADS = 2;
const CLEANUP_INTERVAL = 30000;
const MAX_CONSECUTIVE_SKIPS = 4;

function LiveImageFeed({status, imagePath}) {
  console.log("🔴 LiveImageFeed render, status:", status, "imagePath:", imagePath);
  const [currentImage, setCurrentImage] = useState(null);

  const queueRef = useRef([]);
  const inFlightCountRef = useRef(0);
  const abortControllerRef = useRef(null);
  const intervalRef = useRef(null);
  const skipCounterRef = useRef(0);

  // Helper to log skipped frames
  const logFrameSkip = useCallback((url, reason) => {
    skipCounterRef.current++;
    console.warn(`⚠️ Frame skipped: ${url} — Reason: ${reason}`);
    if (skipCounterRef.current >= MAX_CONSECUTIVE_SKIPS) {
      console.error("⚠️ Internet speed is too low, multiple frames skipped!");
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    queueRef.current = [];
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    inFlightCountRef.current = 0;
    skipCounterRef.current = 0;
    setCurrentImage(null);
    console.log("🧹 Memory cleanup completed");
  }, []);

  // Monitor memory / queue
  const monitorMemory = useCallback(() => {
    if (queueRef.current.length > MAX_QUEUE_SIZE) {
      console.warn(`⚠️ Queue size (${queueRef.current.length}) exceeds limit (${MAX_QUEUE_SIZE}), clearing queue`);
      cleanup();
    }
    if (window.gc) {
      window.gc();
    }
  }, [cleanup]);

  // Preload image with timeout and abort
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
      img.src = `${url}`;

      timeoutId = setTimeout(() => {
        rejectOnce(new Error("Image load timeout (3s)"));
      }, 3000);

      abortControllerRef.current?.signal.addEventListener('abort', () => {
        rejectOnce(new Error("Request cancelled"));
      });
    });
  }, []);

  // Handle incoming imagePath
  useEffect(() => {
    if (!imagePath) return;

    if (inFlightCountRef.current >= MAX_CONCURRENT_LOADS) {
      logFrameSkip(imagePath, "Too many concurrent loads");
      return;
    }

    if (queueRef.current.length >= MAX_QUEUE_SIZE) {
      queueRef.current.shift(); // drop oldest
      logFrameSkip(imagePath, "Queue full");
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
          skipCounterRef.current = 0; // reset on successful load
        } else {
          logFrameSkip(loadedUrl, "Queue full after load");
        }
      })
      .catch((err) => {
        if (err.message !== "Request cancelled") {
          logFrameSkip(imagePath, `Load failed: ${err.message}`);
        }
      })
      .finally(() => {
        inFlightCountRef.current--;
      });
  }, [imagePath, preloadImage, logFrameSkip]);

  // Interval to display images
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      monitorMemory();
      const q = queueRef.current;

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

  // Cleanup interval memory check
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      monitorMemory();
    }, CLEANUP_INTERVAL);
    return () => clearInterval(cleanupInterval);
  }, [monitorMemory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🛑 Component unmounting, cleaning up...");
      cleanup();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cleanup]);

  // Flush queue and clear image when stream stops
  useEffect(() => {
    if (imagePath === null && (currentImage !== null || queueRef.current.length > 0)) {
      cleanup();
    }
    // eslint-disable-next-line
  }, [imagePath]); // do NOT include cleanup in deps, it is stable from useCallback

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
        // height: "50vh",
        aspectRatio: "15 / 9",
      }}
    >
      {currentImage && status === "running" ? (
        <Box
          // key={currentImage}
          component="img"
          src={currentImage}
          alt="Live frame"
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            height: "100%",
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
