import { useEffect, useRef, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { useMachineSelection } from "../../MachineSelectionContext";

// Constants
const MAX_QUEUE_SIZE = 5;
const MAX_CONCURRENT_LOADS = 3;
const CLEANUP_INTERVAL = 15000;
const FRAME_DISPLAY_INTERVAL = 150;
const LOAD_TIMEOUT = 2000;
const HEALTH_CHECK_INTERVAL = 10000;

// Memoized path conversion
const convertToWebPath = (() => {
  const cache = new Map();

  return (absolutePath) => {
    if (!absolutePath) return null;

    if (cache.has(absolutePath)) {
      return cache.get(absolutePath);
    }

    const webPath = absolutePath.replace('/home/techasoft-testing-pc/PackImages', '/public/packimages');
    cache.set(absolutePath, webPath);

    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return webPath;
  };
})();

function LiveImageFeed({ status, imagePath }) {
  console.log("image received: ",imagePath);
  const [currentImage, setCurrentImage] = useState(null);
  const { selectedMachineId } = useMachineSelection();

  // Add state for machine restart functionality
  const [activeVariantId, setActiveVariantId] = useState("");
  const [stackConfig, setStackConfig] = useState({
    min_stack_size: 1,
    max_stack_size: 10,
    min_stack_length: 10.0,
    max_stack_length: 50.0
  });

  // Refs for better performance
  const stateRef = useRef({
    queue: [],
    inFlightCount: 0,
    skipCounter: 0,
    lastDisplayTime: 0,
    abortController: null,
    isMounted: true
  });

  const intervalRef = useRef(null);
  const cleanupIntervalRef = useRef(null);
  const healthCheckIntervalRef = useRef(null);

  // Fetch machine details to get active variant and stack config
  useEffect(() => {
    if (!selectedMachineId) return;

    const fetchMachineDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/machines/${selectedMachineId}/`);
        const data = await response.json();

        if (data) {
          setActiveVariantId(data.active_variant?.id || "");
          // Update stack config from machine data if available
          if (data.min_stack_size && data.max_stack_size &&
              data.min_stack_length && data.max_stack_length) {
            setStackConfig({
              min_stack_size: data.min_stack_size,
              max_stack_size: data.max_stack_size,
              min_stack_length: data.min_stack_length,
              max_stack_length: data.max_stack_length
            });
          }
        }
      } catch (error) {
        console.error("❌ Failed to fetch machine details:", error);
      }
    };

    fetchMachineDetails();
  }, [selectedMachineId]);

  // Health check and auto-restart function
  const checkAndRestartProcess = useCallback(async () => {
    if (!selectedMachineId || !activeVariantId) {
      console.log('⏸️ Skipping health check - no machine or variant selected');
      return;
    }

    try {
      console.log('🔍 Checking process health...');

      // Check if process is running - FIXED: Use full URL and parse JSON
      const processResponse = await fetch(`http://127.0.0.1:8000/api/machines/${selectedMachineId}/process_status/`);

      if (!processResponse.ok) {
        throw new Error(`HTTP ${processResponse.status}`);
      }

      const statusData = await processResponse.json(); // FIXED: Parse as JSON, not text
      console.log('🔍 Process status:', statusData);

      // Check if process needs restart
      if (statusData.needs_restart || statusData.status === 'Dead') {
        console.log('🔄 Process died, auto-restarting...');

        // Stop first to clean up
        try {
          await fetch(`http://127.0.0.1:8000/api/machines/${selectedMachineId}/stop_run/`, {
            method: 'POST'
          });
          console.log('✅ Stop command sent');
        } catch (stopError) {
          console.log('⚠️ Stop command failed (might already be stopped):', stopError);
        }

        // Wait a moment for cleanup
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Restart with current configuration - FIXED: Use full URL
        const restartResponse = await fetch(`http://127.0.0.1:8000/api/machines/${selectedMachineId}/start_run/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            machine: selectedMachineId,
            variant: activeVariantId,
            min_stack_size: stackConfig.min_stack_size,
            max_stack_size: stackConfig.max_stack_size,
            min_stack_length: stackConfig.min_stack_length,
            max_stack_length: stackConfig.max_stack_length
          })
        });

        if (restartResponse.ok) {
          console.log('✅ Machine auto-restarted successfully');
        } else {
          const errorText = await restartResponse.text();
          console.error('❌ Failed to auto-restart machine:', errorText);
        }
      } else {
        console.log('✅ Process is healthy');
      }
    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
  }, [selectedMachineId, activeVariantId, stackConfig]);

  // Health check interval - FIXED: Only run when machine is running
  useEffect(() => {
    if (status === "running") {
      // Initial check
      checkAndRestartProcess();

      // Set up interval for regular health checks
      healthCheckIntervalRef.current = setInterval(checkAndRestartProcess, HEALTH_CHECK_INTERVAL);

      console.log('🔧 Health monitoring started');
    } else {
      // Clear interval when machine is stopped
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
        healthCheckIntervalRef.current = null;
        console.log('🔧 Health monitoring stopped');
      }
    }

    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
    };
  }, [status, checkAndRestartProcess]);

  // Stable callbacks
  const logFrameSkip = useCallback((url, reason) => {
    const state = stateRef.current;
    state.skipCounter++;

    if (state.skipCounter >= 3) {
      console.warn(`🚨 Multiple frames skipped - ${reason}`);
    }
  }, []);

  const cleanup = useCallback(() => {
    const state = stateRef.current;
    state.queue = [];
    state.inFlightCount = 0;
    state.skipCounter = 0;

    if (state.abortController) {
      state.abortController.abort();
      state.abortController = null;
    }

    setCurrentImage(null);
  }, []);

  // Optimized image preloader
  const preloadImage = useCallback((url) => {
    return new Promise((resolve, reject) => {
      const state = stateRef.current;

      if (!state.isMounted || state.abortController?.signal.aborted) {
        reject(new Error("Cancelled"));
        return;
      }

      const img = new Image();
      const timeoutId = setTimeout(() => {
        img.onload = img.onerror = null;
        img.src = '';
        reject(new Error("Timeout"));
      }, LOAD_TIMEOUT);

      img.onload = () => {
        console.log("image loaded: ",url);
        clearTimeout(timeoutId);
        resolve(url);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("Load failed"));
      };

      img.src = url;
    });
  }, []);

  // Debounced image processor
  const processImagePath = useCallback((path) => {
    const state = stateRef.current;

    if (!path || state.inFlightCount >= MAX_CONCURRENT_LOADS) {
      return;
    }

    const webPath = convertToWebPath(path);
    if (!webPath) return;

    // Skip if already in queue
    if (state.queue.includes(webPath)) {
      return;
    }

    // Manage queue size
    if (state.queue.length >= MAX_QUEUE_SIZE) {
      state.queue.shift();
    }

    state.inFlightCount++;

    if (!state.abortController) {
      state.abortController = new AbortController();
    }

    preloadImage(webPath)
      .then((loadedUrl) => {
        if (state.isMounted && !state.queue.includes(loadedUrl)) {
          state.queue.push(loadedUrl);
          state.skipCounter = 0;
        }
      })
      .catch(() => {
        // Silent fail - no need to log every failed frame
      })
      .finally(() => {
        if (state.isMounted) {
          state.inFlightCount = Math.max(0, state.inFlightCount - 1);
        }
      });
  }, [preloadImage]);

  // Throttled image display
  const displayNextImage = useCallback(() => {
    const state = stateRef.current;
    const now = Date.now();

    // Throttle display to prevent rapid updates
    if (now - state.lastDisplayTime < FRAME_DISPLAY_INTERVAL) {
      return;
    }

    if (state.queue.length > 0) {
      const nextImage = state.queue.shift();
      setCurrentImage(nextImage);
      state.lastDisplayTime = now;

      // Keep only the latest frame for memory efficiency
      if (state.queue.length > 1) {
        state.queue = [state.queue[state.queue.length - 1]];
      }
    }
  }, []);

  // Main effects
  useEffect(() => {
    processImagePath(imagePath);
  }, [imagePath, processImagePath]);

  useEffect(() => {
    // Smoother display interval
    intervalRef.current = setInterval(displayNextImage, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [displayNextImage]);

  useEffect(() => {
    // Memory cleanup
    cleanupIntervalRef.current = setInterval(() => {
      const state = stateRef.current;

      if (state.queue.length > MAX_QUEUE_SIZE) {
        state.queue = state.queue.slice(-1); // Keep only latest
      }

      if (window.gc) {
        window.gc();
      }
    }, CLEANUP_INTERVAL);

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, []);

  // Mount/unmount handling
  useEffect(() => {
    const state = stateRef.current;
    state.isMounted = true;

    return () => {
      state.isMounted = false;
      cleanup();

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
    };
  }, [cleanup]);

  // Stream stop handler
  useEffect(() => {
    if (imagePath === null) {
      cleanup();
    }
  }, [imagePath, cleanup]);

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
      }}
    >
      {currentImage && status === "running" ? (
        <Box
          component="img"
          src={currentImage}
          alt="Live feed"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block"
          }}
          onError={() => {
            setCurrentImage(null);
          }}
        />
      ) : (
        <Box
          sx={{
            textAlign: "center",
            color: "text.secondary",
            p: 3
          }}
        >
          {status === "running" ? "Waiting for live feed..." : "No live feed available"}
        </Box>
      )}
    </Box>
  );
}

export default LiveImageFeed;


// import { useEffect, useRef, useState, useCallback } from "react";
// import { Box } from "@mui/material";
// import { useMachineSelection } from "../../MachineSelectionContext";

// // Constants
// const MAX_QUEUE_SIZE = 5;
// const MAX_CONCURRENT_LOADS = 3;
// const CLEANUP_INTERVAL = 15000;
// const FRAME_DISPLAY_INTERVAL = 150;
// const LOAD_TIMEOUT = 2000;

// // Memoized path conversion
// const convertToWebPath = (() => {
//   const cache = new Map();

//   return (absolutePath) => {
//     if (!absolutePath) return null;

//     if (cache.has(absolutePath)) {
//       return cache.get(absolutePath);
//     }

//     const webPath = absolutePath.replace(
//       "/home/techasoft-testing-pc/PackImages",
//       "/public/packimages"
//     );
//     cache.set(absolutePath, webPath);

//     // Limit cache size
//     if (cache.size > 100) {
//       const firstKey = cache.keys().next().value;
//       cache.delete(firstKey);
//     }

//     return webPath;
//   };
// })();

// function LiveImageFeed({ status, imagePath }) {
//   console.log("image received:", imagePath);
//   const [currentImage, setCurrentImage] = useState(null);
//   const { selectedMachineId } = useMachineSelection();

//   // Refs for image handling and performance
//   const stateRef = useRef({
//     queue: [],
//     inFlightCount: 0,
//     skipCounter: 0,
//     lastDisplayTime: 0,
//     abortController: null,
//     isMounted: true,
//   });

//   const intervalRef = useRef(null);
//   const cleanupIntervalRef = useRef(null);

//   // Cleanup logic
//   const cleanup = useCallback(() => {
//     const state = stateRef.current;
//     state.queue = [];
//     state.inFlightCount = 0;
//     state.skipCounter = 0;

//     if (state.abortController) {
//       state.abortController.abort();
//       state.abortController = null;
//     }

//     setCurrentImage(null);
//   }, []);

//   // Optimized image preloader
//   const preloadImage = useCallback((url) => {
//     return new Promise((resolve, reject) => {
//       const state = stateRef.current;

//       if (!state.isMounted || state.abortController?.signal.aborted) {
//         reject(new Error("Cancelled"));
//         return;
//       }

//       const img = new Image();
//       const timeoutId = setTimeout(() => {
//         img.onload = img.onerror = null;
//         img.src = "";
//         reject(new Error("Timeout"));
//       }, LOAD_TIMEOUT);

//       img.onload = () => {
//         console.log("✅ image loaded:", url);
//         clearTimeout(timeoutId);
//         resolve(url);
//       };

//       img.onerror = () => {
//         clearTimeout(timeoutId);
//         reject(new Error("Load failed"));
//       };

//       img.src = url;
//     });
//   }, []);

//   // Debounced image processor
//   const processImagePath = useCallback(
//     (path) => {
//       const state = stateRef.current;

//       if (!path || state.inFlightCount >= MAX_CONCURRENT_LOADS) {
//         return;
//       }

//       const webPath = convertToWebPath(path);
//       if (!webPath) return;

//       // Skip if already in queue
//       if (state.queue.includes(webPath)) {
//         return;
//       }

//       // Manage queue size
//       if (state.queue.length >= MAX_QUEUE_SIZE) {
//         state.queue.shift();
//       }

//       state.inFlightCount++;

//       if (!state.abortController) {
//         state.abortController = new AbortController();
//       }

//       preloadImage(webPath)
//         .then((loadedUrl) => {
//           if (state.isMounted && !state.queue.includes(loadedUrl)) {
//             state.queue.push(loadedUrl);
//             state.skipCounter = 0;
//           }
//         })
//         .catch(() => {
//           // Silent fail - no need to log every failed frame
//         })
//         .finally(() => {
//           if (state.isMounted) {
//             state.inFlightCount = Math.max(0, state.inFlightCount - 1);
//           }
//         });
//     },
//     [preloadImage]
//   );

//   // Throttled image display
//   const displayNextImage = useCallback(() => {
//     const state = stateRef.current;
//     const now = Date.now();

//     // Throttle display to prevent rapid updates
//     if (now - state.lastDisplayTime < FRAME_DISPLAY_INTERVAL) {
//       return;
//     }

//     if (state.queue.length > 0) {
//       const nextImage = state.queue.shift();
//       setCurrentImage(nextImage);
//       state.lastDisplayTime = now;

//       // Keep only the latest frame for memory efficiency
//       if (state.queue.length > 1) {
//         state.queue = [state.queue[state.queue.length - 1]];
//       }
//     }
//   }, []);

//   // Handle new incoming image paths
//   useEffect(() => {
//     processImagePath(imagePath);
//   }, [imagePath, processImagePath]);

//   // Interval for smooth frame updates
//   useEffect(() => {
//     intervalRef.current = setInterval(displayNextImage, 50);

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [displayNextImage]);

//   // Periodic cleanup
//   useEffect(() => {
//     cleanupIntervalRef.current = setInterval(() => {
//       const state = stateRef.current;

//       if (state.queue.length > MAX_QUEUE_SIZE) {
//         state.queue = state.queue.slice(-1);
//       }

//       if (window.gc) {
//         window.gc();
//       }
//     }, CLEANUP_INTERVAL);

//     return () => {
//       if (cleanupIntervalRef.current) {
//         clearInterval(cleanupIntervalRef.current);
//       }
//     };
//   }, []);

//   // Mount/unmount
//   useEffect(() => {
//     const state = stateRef.current;
//     state.isMounted = true;

//     return () => {
//       state.isMounted = false;
//       cleanup();

//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//       if (cleanupIntervalRef.current) {
//         clearInterval(cleanupIntervalRef.current);
//       }
//     };
//   }, [cleanup]);

//   // Stream stop handler
//   useEffect(() => {
//     if (imagePath === null) {
//       cleanup();
//     }
//   }, [imagePath, cleanup]);

//   // Render
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         margin: "auto",
//         borderRadius: 2,
//         overflow: "hidden",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "58vh",
//       }}
//     >
//       {currentImage && status === "running" ? (
//         <Box
//           component="img"
//           src={currentImage}
//           alt="Live feed"
//           sx={{
//             width: "100%",
//             height: "100%",
//             objectFit: "contain",
//             display: "block",
//           }}
//           onError={() => setCurrentImage(null)}
//         />
//       ) : (
//         <Box
//           sx={{
//             textAlign: "center",
//             color: "text.secondary",
//             p: 3,
//           }}
//         >
//           {status === "running"
//             ? "Waiting for live feed..."
//             : "No live feed available"}
//         </Box>
//       )}
//     </Box>
//   );
// }

// export default LiveImageFeed;
