import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.shadows[3],
}));

const logMessages = [
  "Batch #101 started: Stack size set to 45mm, targeting 200 stacks.",
  "Machine 2: 187 stacks successfully produced, 13 rejected due to uneven texture.",
  "Quality Control: 5 biscuits rejected from Stack #56 due to overbaking.",
  "Machine 1 completed batch: 95% pass rate achieved.",
  "Auto-inspection passed: Stack #89 — 20 biscuits, 0 defects.",
  "Stack size updated to 50mm for chocolate variant.",
  "Machine 3 paused — low dough pressure detected.",
  "Final check: 1,250 biscuits passed, 30 rejected in current batch.",
  "Packaging unit: 190 stacks sealed, 2 flagged for inspection.",
  "Stack Count: 205 stacks built in last cycle (97.5% efficiency).",
  "Warning: Stack #32 contained irregular biscuit height — rejected.",
  "Line 2 resumed — lubricant level optimized.",
  "Stack #77 manually inspected — 100% conformity confirmed.",
  "Min Stack Size set to 40mm, Max Stack Size adjusted to 55mm.",
  "Variant change to 'Oats Delight' — expected yield: 1,500 biscuits.",
];

export default function BasicGrid() {
  const [imageUrl, setImageUrl] = React.useState(
    "https://via.placeholder.com/600x300"
  );
  // const [messages, setMessages] = React.useState<string[]>([]);
  const [messages, setMessages] = React.useState<string[]>(logMessages);
  const [selectedVariant, setSelectedVariant] = React.useState("");
  const [stackSize, setStackSize] = React.useState("");
  const [status, setStatus] = React.useState("stopped"); // 'stopped' or 'running'

  React.useEffect(() => {
    const imageSocket = new WebSocket("ws://localhost:8000/home/ws/images");
    imageSocket.onmessage = (event) => setImageUrl(event.data);
    imageSocket.onerror = (error) =>
      console.error("Image WebSocket Error: ", error);
    imageSocket.onclose = () => console.log("Image WebSocket closed.");

    const messageSocket = new WebSocket("ws://localhost:8000/home/ws/messages");
    messageSocket.onmessage = (event) =>
      setMessages((prev) => [...prev, event.data]);
    messageSocket.onerror = (error) =>
      console.error("Message WebSocket Error: ", error);
    messageSocket.onclose = () => console.log("Message WebSocket closed.");

    return () => {
      imageSocket.close();
      messageSocket.close();
    };
  }, []);

  const handleSubmit = (actionType) => {
    if (actionType === "start" && (!selectedVariant || !stackSize)) {
      alert("Please select a variant and enter stack size.");
      return;
    }

    fetch("/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: actionType,
        variant: selectedVariant,
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
    <Box sx={{ flexGrow: 1, height: "80vh", padding: 2 }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* First Grid: Image */}

        <Grid item xs={12} md={8} sx={{ height: "100%" }}>
          <StyledPaper
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: 0.5,
              height: "100%",
            }}
          >
            {/* Header with 5 blocks */}
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
                  flex: 0.5,
                  backgroundColor: "#f0f0f0",
                  // textAlign: "center",
                  padding: 1,
                  marginX: 0.5,
                  borderRadius: 2,
                  fontSize: "0.9rem",

                  // letterSpacing: "1px",
                }}
              >
                Stack Coutn:10
              </Box>

              <Box
                sx={{
                  flex: 1,
                  backgroundColor: "#f0f0f0",
                  // textAlign: "center",
                  padding: 1,
                  marginX: 0.5,
                  borderRadius: 2,
                  fontSize: "0.9rem",

                  // letterSpacing: "1px",
                }}
              >
                Stack Length: 50mm
              </Box>

              <Box
                sx={{
                  flex: 2,
                  backgroundColor: "#f0f0f0",
                  // textAlign: "center",
                  padding: 1,
                  marginX: 0.5,
                  borderRadius: 2,
                  fontSize: "0.9rem",
                  // letterSpacing: "1px",
                }}
              >
                Rejected: 20045
              </Box>

              <Box
                sx={{
                  flex: 2,
                  backgroundColor: "#f0f0f0",
                  // textAlign: "center",
                  padding: 1,
                  marginX: 0.5,
                  borderRadius: 2,
                  fontSize: "0.9rem",
                  // letterSpacing: "1px",
                }}
              >
                Passed: 200000237
              </Box>

              {/* Dropdown Block (Block 5) */}
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
                  }}
                >
                  Choose Machine
                </label>
                <select
                  id="machine-select"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
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

            {/* Image/Video Section */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                border: "2px solid #f0f0f0",
              }}
            >
              <img
                src={imageUrl}
                alt="Live Stream"
                style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8 }}
              />
            </Box>
          </StyledPaper>
        </Grid>

        {/* Updates & Form Section */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* Live Updates */}
          <StyledPaper sx={{ flex: 7, overflowY: "auto" }}>
            <Box sx={{ marginY: -3 }}>
              <h4>Live Updates</h4>
            </Box>

            <Box>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <p
                    style={{
                      border:
                        messages.length > 0 ? "2px solid #f0f0f0" : "none",
                      borderRadius: "5px",
                      padding: "5px",
                    }}
                    key={index}
                  >
                    {msg}
                  </p>
                ))
              ) : (
                <p>No updates yet...</p>
              )}
            </Box>
          </StyledPaper>

          {/* Machine Control */}
          <StyledPaper sx={{ flex: 3, p: 2, mt: 2 }}>
            {/* <h3>Machine Control</h3> */}
            <Box sx={{ textAlign: "center", margin: -2 }}>
              <h3>Machine Control</h3>
            </Box>

            <form onSubmit={(e) => e.preventDefault()}>
              {/* Dropdown Section */}
              <Box sx={{ mb: 2 }}>
                <label htmlFor="variant">Choose Machine</label>
                <select
                  id="variant"
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  style={{ width: "100%", padding: 8 }}
                >
                  <option value="">Select Machine</option>
                  <option value="Machine1">Machine 1</option>
                  <option value="Machine2">Machine 2</option>
                  <option value="Machine3">Machine 3</option>
                  <option value="Machine4">Machine 4</option>
                </select>
              </Box>

              {/* Input Fields Section */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <label htmlFor="minStackSize">Min Stack Size</label>
                  <input
                    type="number"
                    id="minStackSize"
                    placeholder="e.g. 10"
                    style={{ width: "100%", padding: 8 }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <label htmlFor="maxStackSize">Max Stack Size</label>
                  <input
                    type="number"
                    id="maxStackSize"
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
                    placeholder="e.g. 5"
                    style={{ width: "100%", padding: 8 }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <label htmlFor="maxStackLength">Max Stack Length</label>
                  <input
                    type="number"
                    id="maxStackLength"
                    placeholder="e.g. 100"
                    style={{ width: "100%", padding: 8 }}
                  />
                </Box>
              </Box>

              {/* Start/Stop Button */}
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
