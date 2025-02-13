import * as React from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";

export default function AppSuccessAlert() {
  const [showAlert, setShowAlert] = React.useState(true);

  React.useEffect(() => {
    // Hide alert after 3 seconds
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <Box sx={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}>
      {showAlert && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Application loaded successfully!
        </Alert>
      )}
    </Box>
  );
}
