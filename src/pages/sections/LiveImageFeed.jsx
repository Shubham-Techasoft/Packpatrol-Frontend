import { useEffect, useState } from "react";
import { Box } from "@mui/material";

function LiveImageFeed({ imageArray }) {
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    if (!imageArray) return;

    // Preload image
    const img = new Image();
    img.src = imageArray;

    img.onload = () => {
      setCurrentImage(imageArray); // Only set when loaded
    };
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
      {imageArray ? (
        <img
          key={imageArray}
          src={imageArray}
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


// import { useEffect, useMemo, useState } from "react";
// import { Box } from "@mui/material";

// function LiveImageFeed({ imageArray }) {
//   // Normalize to a single latest URL
//   const latestSrc = useMemo(() => {
//     if (!imageArray) return null;
//     return Array.isArray(imageArray) ? imageArray : imageArray;
//   }, [imageArray]);

//   const [srcWithCB, setSrcWithCB] = useState(null);

//   useEffect(() => {
//     if (!latestSrc) {
//       setSrcWithCB(null);
//       return;
//     }
//     // Prefer a server-provided timestamp/version; otherwise, add a short-lived token
//     const url = new URL(latestSrc, window.location.origin);
//     // Change token every 500ms (match feed cadence, avoid spam)
//     url.searchParams.set("cb", String(Math.round(performance.now() / 500)));
//     setSrcWithCB(url.toString());
//   }, [latestSrc]);

//   return (
//     <Box sx={{ width: "100%", margin: "auto", borderRadius: 7, overflow: "hidden", paddingY: 0.9, paddingX: 0.5 }}>
//       {srcWithCB ? (
//         <img
//           src={srcWithCB}
//           key={srcWithCB}
//           alt="Live Feed"
//           style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
//         />
//       ) : (
//         <p style={{ textAlign: "center", boxShadow: "none !important", fontSize: "1.2rem", fontFamily: "Arial, sans-serif", letterSpacing: "0.1em", wordSpacing: "0.2em" }}>
//           There is no live updates yet.......
//         </p>
//       )}
//     </Box>
//   );
// }
// export default LiveImageFeed;