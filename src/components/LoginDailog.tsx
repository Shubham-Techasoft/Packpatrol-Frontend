import * as React from "react";
import {
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  Slide,
  CircularProgress,
  Grid,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { base_URL } from "../utils/api";

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface CombinedSignInPageProps {
  open: boolean;
  onClose: () => void;
}

const CombinedSignInPage: React.FC<CombinedSignInPageProps> = ({
  open,
  onClose,
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate(); 

  // handle login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
  
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
  
    try {
      console.log("Attempting login with email:", email);

      const loginResponse = await fetch(`${base_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), 
      });
  
      if (!loginResponse.ok) {
        const data = await loginResponse.json();
        console.error("Login failed:", data.detail || "Unknown Error");
        setError(data?.detail || data?.email?.[0] || "Login failed.");
        return;
      }
      const data = await loginResponse.json();
      const accessToken = data.access;
      const refreshToken = data.refresh;

    // Now fetch user details to get designation
    const userInfoRes = await fetch(`${base_URL}/api/users/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoRes.ok) {
      console.error("Failed to fetch user info.");
      setError("Login succeeded, but failed to fetch user info.");
      return;
    }

    const userInfo = await userInfoRes.json();
    const { designation, username } = userInfo;
  
      //  Save tokens and user info
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("designation",designation); 
      localStorage.setItem("username",username);
      localStorage.setItem("email", email);
      // localStorage.setItem("password", password);

      window.dispatchEvent(new Event("storage"));

      console.log(`✅ ${designation.toUpperCase()} '${username}' logged in successfully.`);
      console.log("Access Token stored in localStorage.");
      console.log("Redirecting to Home Page...");

      navigate("/");
      
      // Close modal
      onClose();
  
      // Redirect or update state (you can route to dashboard)
      // window.location.href = "/"; 
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          px: 3,
          py: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#008e57ff", height:'100px', width:'100px'}}>
            <LockOutlinedIcon sx={{fontSize:'3rem', color:'white'}}/>
          </Avatar>
          <Typography component="h1" variant="h4" fontWeight="bold">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoFocus
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: "bold", borderRadius: 2, bgcolor:"#062249" }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>
        </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CombinedSignInPage;
