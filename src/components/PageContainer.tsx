import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
}));

export default function BasicGrid() {
  const [imageUrl, setImageUrl] = React.useState("https://via.placeholder.com/600x300");
  const [messages, setMessages] = React.useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = React.useState("");
  const [stackSize, setStackSize] = React.useState("");
  const [status, setStatus] = React.useState("stopped"); // 'stopped' or 'running'

  React.useEffect(() => {
    const imageSocket = new WebSocket("ws://localhost:8000/home/ws/images");
    imageSocket.onmessage = (event) => setImageUrl(event.data);
    imageSocket.onerror = (error) => console.error("Image WebSocket Error: ", error);
    imageSocket.onclose = () => console.log("Image WebSocket closed.");

    const messageSocket = new WebSocket("ws://localhost:8000/home/ws/messages");
    messageSocket.onmessage = (event) => setMessages((prev) => [...prev, event.data]);
    messageSocket.onerror = (error) => console.error("Message WebSocket Error: ", error);
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

    fetch('/api/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionType, variant: selectedVariant, stackSize: stackSize })
    })
      .then(response => response.json())
      .then(data => {
        console.log("Response:", data);
        setStatus(actionType === "start" ? "running" : "stopped");
      })
      .catch(error => console.error("Error:", error));
  };

  return (
    <Box sx={{ flexGrow: 1, height: '80vh', padding: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>

        {/* First Grid: Image */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <StyledPaper sx={{ display: 'flex', objectFit: 'cover', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src={imageUrl}
              alt="Live Stream"
              style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }}
            />
          </StyledPaper>
        </Grid>

        {/* Updates & Form Section */}
        <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Live Updates */}
          <StyledPaper sx={{ flex: 7, overflowY: 'auto' }}>
            <h2>Live Updates</h2>
            <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {messages.length > 0 ? messages.map((msg, index) => (<p key={index}>{msg}</p>)) : <p>No updates yet...</p>}
            </Box>
          </StyledPaper>

          {/* Machine Control */}
          <StyledPaper sx={{ flex: 3, p: 2, mt: 2 }}>
            <h3>Machine Control</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 7 }}>
                  <label htmlFor="variant">Choose Variant</label>
                  <select id="variant" value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value)} style={{ width: '100%', padding: 8 }}>
                    <option value="">Select Variant</option>
                    <option value="variant1">Variant 1</option>
                    <option value="variant2">Variant 2</option>
                  </select>
                </Box>
                <Box sx={{ flex: 3 }}>
                  <label htmlFor="stackSize">Stack Size</label>
                  <input type="number" id="stackSize" value={stackSize} onChange={(e) => setStackSize(e.target.value)} style={{ width: '100%', padding: 8 }} />
                </Box>
              </Box>

              {/* Conditional Button Rendering */}
              {status === "stopped" ? (
                <button type="button" onClick={() => handleSubmit('start')} style={{ width: '100%', padding: 12, backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 8 }}>
                  Start
                </button>
              ) : (
                <button type="button" onClick={() => handleSubmit('stop')} style={{ width: '100%', padding: 12, backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 8}}>
                  Stop
                </button>
              )}
            </form>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}
