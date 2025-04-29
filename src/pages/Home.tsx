// pages/Home.jsx
import * as React from "react";
import { Box, Paper, Typography, styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/Star";
import LiveImageFeed from "./sections/LiveImageFeed";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.shadows[3],
}));

const MessageItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.5), // Adjust padding as needed
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1), // Adjust spacing between messages
  // border: `1px solid ${theme.palette.divider}`, // Optional border
}));

const logMessages = [
  "Batch #101 started: Stack size set to 45mm, targeting 200 stacks.",
  "Machine 2: 187 stacks successfully produced, 13 rejected due to uneven texture.",
  "Quality Control: 5 biscuits rejected from Stack #56 due to overbaking.",
  "Machine 1 completed batch: 95% pass rate achieved.",
  "Auto-inspection passed: Stack #89 — 20 biscuits, 0 defects.",
  "Stack size updated to 50mm for chocolate machine.",
  "Machine 3 paused — low dough pressure detected.",
  "Final check: 1,250 biscuits passed, 30 rejected in current batch.",
  "Packaging unit: 190 stacks sealed, 2 flagged for inspection.",
  "Stack Count: 205 stacks built in last cycle (97.5% efficiency).",
  "Warning: Stack #32 contained irregular biscuit height — rejected.",
  "Line 2 resumed — lubricant level optimized.",
  "Stack #77 manually inspected — 100% conformity confirmed.",
  "Min Stack Size set to 40mm, Max Stack Size adjusted to 55mm.",
  "machine change to 'Oats Delight' — expected yield: 1,500 biscuits.",
];

export default function Home() {
  // const [imageUrl, setImageUrl] = React.useState(
  //   "https://via.placeholder.com/600x300"
  // );

  const [imageUrls, setImageUrls] = React.useState([]);

  const [messages, setMessages] = React.useState(logMessages);
  const [selectedMachine, setSelectedMachine] = React.useState("");
  const [stackSize, setStackSize] = React.useState("");
  const [status, setStatus] = React.useState("stopped");

  const [favorites, setFavorites] = React.useState([]);
  const [minStackSize, setMinStackSize] = React.useState("");
  const [maxStackSize, setMaxStackSize] = React.useState("");
  const [minStackLength, setMinStackLength] = React.useState("");
  const [maxStackLength, setMaxStackLength] = React.useState("");
  const [favoritesOpen, setFavoritesOpen] = React.useState(false);

  const handleFavorite = () => {
    if (
      selectedMachine &&
      minStackSize !== undefined &&
      minStackSize !== null &&
      maxStackSize !== undefined &&
      maxStackSize !== null &&
      minStackLength !== undefined &&
      minStackLength !== null &&
      maxStackLength !== undefined &&
      maxStackLength !== null
    ) {
      const favoriteSetting = {
        machine: selectedMachine,
        minStackSize: String(minStackSize), // Ensure consistent string type for comparison
        maxStackSize: String(maxStackSize),
        minStackLength: String(minStackLength),
        maxStackLength: String(maxStackLength),
      };

      // Check if this favorite setting already exists in the favorites array
      const isDuplicate = favorites.some(
        (fav) =>
          fav.machine === favoriteSetting.machine &&
          fav.minStackSize === favoriteSetting.minStackSize &&
          fav.maxStackSize === favoriteSetting.maxStackSize &&
          fav.minStackLength === favoriteSetting.minStackLength &&
          fav.maxStackLength === favoriteSetting.maxStackLength
      );

      if (!isDuplicate) {
        setFavorites((prev) => [...prev, favoriteSetting]);
        // setFavoritesOpen(true);
      } else {
        alert("This setting is already in your favorites.");
        // Optionally, you could provide other feedback to the user
      }
    } else {
      alert(
        "Please ensure all input fields are filled before adding to favorites."
      );
    }
  };

  React.useEffect(() => {
    console.log("after clicking on add favorites: ", favorites);
    console.log("the live image data: ", imageUrls);

    // const imageSocket = new WebSocket("ws://localhost:8000/home/ws/images");
    // imageSocket.onmessage = (event) => setImageUrl(event.data);
    // imageSocket.onerror = (error) =>
    //   console.error("Image WebSocket Error: ", error);
    // imageSocket.onclose = () => console.log("Image WebSocket closed.");

    // const messageSocket = new WebSocket("ws://localhost:8000/home/ws/messages");
    // messageSocket.onmessage = (event) =>
    //   setMessages((prev) => [...prev, event.data]);
    // messageSocket.onerror = (error) =>
    //   console.error("Message WebSocket Error: ", error);
    // messageSocket.onclose = () => console.log("Message WebSocket closed.");

    const eventSource = new EventSource(
      "http://localhost:8000/home/image-stream"
    );

    eventSource.onopen = () => {
      console.log("EventSource connection established.");
    };

    eventSource.onmessage = (event) => {
      console.log("Received event:", event); // Log the entire event object
      const imageUrl = event.data;
      console.log("Received image URL:", imageUrl);
      setImageUrls((prevUrls) => [...prevUrls, imageUrl]);
      // setImageUrls((prevUrls) => [...prevUrls.slice(-9), imageUrl]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };

    console.log("this is eventsource var: ", eventSource);

    return () => {
      // imageSocket.close();
      // messageSocket.close();
      eventSource.close();
      console.log("EnentSource connection is closed!");
    };
  }, [favorites, imageUrls]);

  const handleSubmit = (actionType) => {
    // if (actionType === "start" && (!selectedMachine || !stackSize)) {
    //   alert("Please select a machine and enter stack size.");
    //   return;
    // }

    fetch("/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: actionType,
        machine: selectedMachine,
        stackSize: stackSize,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data);
        setStatus(actionType === "start" ? "running" : "stopped");
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "80vh",
        padding: 2,
        // background: "linear-gradient(to right, #B0E0E6, #ADD8E6)",
        bgcolor: "rgb(209, 233, 237)",
      }}
    >
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Left side - Image + Header */}
        <Grid item xs={12} md={8} sx={{ height: "100%" }}>
          <StyledPaper
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: 0.5,
              height: "100%",
              // backgroundColor: "#f9f9f9",
              backgroundColor: "#f5f5f5",
              boxShadow: "0 4px 20px rgba(196, 201, 255, 0.08)",
              borderRadius: 3,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  flex: 0.7,
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  color: "#fff",
                  padding: 1,
                  marginX: 0.5,
                  borderRadius: 2,
                  fontSize: "0.9rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                Stack Count: 10
              </Box>
              <Box
                sx={{
                  flex: 1,
                  background: "linear-gradient(135deg, #8E2DE2, #4A00E0)",
                  color: "#fff",
                  padding: 1,
                  marginX: 0.5,
                  borderRadius: 2,
                  fontSize: "0.9rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                Stack Length: 50mm
              </Box>
              <Box
                sx={{
                  flex: 2,
                  background: "linear-gradient(135deg, #FF416C, #FF4B2B)",
                  color: "#fff",
                  padding: 1,
                  marginX: 0.5,
                  borderRadius: 2,
                  fontSize: "0.9rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                Rejected: 20045
              </Box>
              <Box
                sx={{
                  flex: 2,
                  background: "linear-gradient(135deg, #00b09b, #96c93d)",
                  color: "#fff",
                  padding: 1,
                  marginX: 0.5,
                  borderRadius: 2,
                  fontSize: "0.9rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                Passed: 200000237
              </Box>
              <Box
                sx={{
                  flex: 1.5,
                  marginX: 0.5,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <label
                  htmlFor="machine-select"
                  style={{
                    fontSize: "0.9rem",
                    marginBottom: 4,
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Choose Machine
                </label>
                <select
                  id="machine-select"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #bbb",
                    background: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select</option>
                  <option value="machine1">Machine 1</option>
                  <option value="machine2">Machine 2</option>
                  <option value="machine3">Machine 3</option>
                  <option value="machine4">Machine 4</option>
                </select>
              </Box>
            </Box>

            {/* Image section */}

            <LiveImageFeed imageArray={imageUrls} />
          </StyledPaper>
        </Grid>

        {/* Right Side - Logs and Controls */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* Live Updates */}
          <StyledPaper sx={{ flex: 7, overflowY: "auto", bgcolor: "#f5f5f5" }}>
            <Box sx={{ marginY: -3 }}>
              <h4>Live Updates</h4>
            </Box>
            <Box>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <MessageItem key={index}>
                    <Typography
                      sx={{
                        fontSize: "1.2em",
                        color: "text.primary",
                        marginRight: 1,
                        lineHeight: 1,
                      }}
                    >
                      •
                    </Typography>
                    <Typography sx={{ flexGrow: 1, wordBreak: "break-word" }}>
                      {msg}
                    </Typography>
                  </MessageItem>
                ))
              ) : (
                <Typography>No updates yet...</Typography>
              )}
            </Box>
          </StyledPaper>

          {/* Machine Control */}
          <StyledPaper sx={{ flex: 3, p: 2, mt: 2, bgcolor: "#f5f5f5" }}>
            {/* <Box sx={{ textAlign: "center", margin: -2 }}>
              <h3>Machine Control</h3>
            </Box> */}
            <Box
              sx={{
                display: "flex",
                margin: -2,
                marginLeft: 0.3,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3>Machine Control</h3>
              {/* <span
                title="add to favorites"
                style={{ marginRight: "2rem", cursor: "pointer" }}
              >
                <StarIcon />
              </span> */}

              <span
                title="add to favorites"
                style={{
                  marginRight: "2rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  padding: "0.5rem",
                  transition:
                    "background-color 0.3s ease-in-out, transform 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(38, 74, 193, 0.1)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={handleFavorite}
              >
                <StarIcon />
              </span>
            </Box>
            <form onSubmit={(e) => e.preventDefault()}>
              <Box sx={{ mb: 2 }}>
                <label htmlFor="machine">Choose Machine</label>
                <select
                  id="machine"
                  value={selectedMachine}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                  style={{ width: "100%", padding: 8 }}
                >
                  <option value="">Select Machine</option>
                  <option value="Machine1">Machine 1</option>
                  <option value="Machine2">Machine 2</option>
                  <option value="Machine3">Machine 3</option>
                  <option value="Machine4">Machine 4</option>
                </select>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <label htmlFor="minStackSize">Min Stack Size</label>

                  <input
                    type="number"
                    id="minStackSize"
                    value={minStackSize}
                    onChange={(e) => setMinStackSize(e.target.value)}
                    placeholder="e.g. 10"
                    style={{ width: "100%", padding: 8 }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <label htmlFor="maxStackSize">Max Stack Size</label>

                  <input
                    type="number"
                    id="maxStackSize"
                    value={maxStackSize}
                    onChange={(e) => setMaxStackSize(e.target.value)}
                    placeholder="e.g. 50"
                    style={{ width: "100%", padding: 8 }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <label htmlFor="minStackLength">Min Stack Length</label>
                  <input
                    type="number"
                    id="minStackLength"
                    value={minStackLength}
                    onChange={(e) => setMinStackLength(e.target.value)}
                    placeholder="e.g. 10mm"
                    style={{ width: "100%", padding: 8 }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <label htmlFor="maxStackLength">Max Stack Length</label>
                  <input
                    type="number"
                    id="maxStackLength"
                    value={maxStackLength}
                    onChange={(e) => setMaxStackLength(e.target.value)}
                    placeholder="e.g. 100mm"
                    style={{ width: "100%", padding: 8 }}
                  />
                </Box>
              </Box>

              <Box>
                {status === "stopped" ? (
                  <button
                    type="button"
                    onClick={() => handleSubmit("start")}
                    style={{
                      width: "100%",
                      padding: 12,
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 8,
                    }}
                  >
                    Start
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubmit("stop")}
                    style={{
                      width: "100%",
                      padding: 12,
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 8,
                    }}
                  >
                    Stop
                  </button>
                )}
              </Box>
            </form>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}
