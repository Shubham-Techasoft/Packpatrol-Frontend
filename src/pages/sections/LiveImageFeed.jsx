import { useEffect, useRef, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { useMachineSelection } from "../../MachineSelectionContext";

// Constants
const MAX_QUEUE_SIZE = 3; // Reduced for better memory
const MAX_CONCURRENT_LOADS = 1; // Reduced to prevent overload
const CLEANUP_INTERVAL = 15000; // More frequent cleanup
const FRAME_DISPLAY_INTERVAL = 150; // Smother display
const LOAD_TIMEOUT = 2000; // Faster timeout

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
  const [currentImage, setCurrentImage] = useState(null);
  const { selectedMachineId, setSelectedMachineId } = useMachineSelection();
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
    };
  }, [cleanup]);

  // Stream stop handler
  useEffect(() => {
    if (imagePath === null) {
      cleanup();
    }
  }, [imagePath, cleanup]);

  // In your live stream component
  useEffect(() => {
    const checkProcessHealth = async () => {
      try {
        const response = await fetch(`/api/machines/${selectedMachineId}/process_status/`);
        const status = await response.json();
        
        if (status.needs_restart) {
          console.log('🔄 Process died, auto-restarting...');
          // Auto-restart logic
          await restartMachine();
        }
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    // Check health every 30 seconds
    const healthInterval = setInterval(checkProcessHealth, 30000);
    
    return () => clearInterval(healthInterval);
  }, [selectedMachineId]);

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
        // backgroundColor: "background.paper",
        // minHeight: 450
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
          No live feed available
        </Box>
      )}
    </Box>
  );
}

export default LiveImageFeed;