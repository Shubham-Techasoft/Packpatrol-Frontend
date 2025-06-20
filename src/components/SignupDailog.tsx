import * as React from "react";
import {
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import from utils
import { isAuthenticated, isSuperAdmin } from "../utils/auth"

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface CombinedSignUpPageProps {
  open: boolean;
  onClose: () => void;
}

const CombinedSignUpPage: React.FC<CombinedSignUpPageProps> = ({
  open,
  onClose,
}) => {
  const [fullName, setFullName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [designation, setDesignation] = React.useState("employee");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // const handleSignUp = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   if (!username.trim()) return setError("Username is required.");
  //   if (fullName.trim().length < 3) return setError("First name must be at least 3 characters.");
  //   if (!lastName.trim()) return setError("Last name is required.");
  //   if (!email.includes("@")) return setError("Invalid email format.");
  //   if (!company.trim()) return setError("Company is required.");
  //   if (password.length < 6) return setError("Password must be at least 6 characters.");
  //   if (password !== confirmPassword) return setError("Passwords do not match.");

  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/api/users/", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         username,
  //         email,
  //         password,
  //         first_name: fullName,
  //         last_name: lastName,
  //         designation,
  //         company,
  //       }),
  //     });

  //     if (!response.ok) {
  //       try {
  //         const data = await response.json();
  //         console.error("Signup failed with data:", data);
  //         setError(data.detail ||  Object.values(data).flat().join(" ") || "Signup failed.");
  //       } catch (jsonErr) {
  //         const text = await response.text();
  //         console.error("Non-JSON response:", text);
  //         setError("Signup failed. Server returned unexpected response.");
  //       }
  //       return;
  //     }

  //     alert("Signup successful!");

  //     // Clear form after successful signup
  //     setFullName("");
  //     setLastName("");
  //     setUsername("");
  //     setEmail("");
  //     setPassword("");
  //     setConfirmPassword("");
  //     setCompany("");
  //     setDesignation("user");
  //     setError("");

  //     onClose(); // Close the dialog
  //   } catch (err) {
  //     console.error("Signup error:", err);
  //     setError("Signup failed due to a server error.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim()) return setError("Username is required.");
    if (fullName.trim().length < 3)
      return setError("First name must be at least 3 characters.");
    if (!lastName.trim()) return setError("Last name is required.");
    if (!email.includes("@")) return setError("Invalid email format.");
    if (!company.trim()) return setError("Company is required.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    try {
      const accessToken = localStorage.getItem("access_token");

      // Step 1: Signup 
      const signupResponse = await fetch("http://127.0.0.1:8000/api/users/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}` },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: fullName,
          last_name: lastName,
          designation, 
          company,
        }),
      });

      if (!signupResponse.ok) {
        const data = await signupResponse.json();
        console.error("Signup failed with data:", data);
        setError(
          data?.detail || data?.non_field_errors?.[0] || "Signup failed."
        );
        return;
      }

      // Step 2: Login immediately
      const loginResponse = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.error("Login after signup failed:", loginData);
        setError("Signup succeeded, but login failed.");
        return;
      }

      const loginData = await loginResponse.json();

      localStorage.setItem("access_token", loginData.access);
      localStorage.setItem("refresh_token", loginData.refresh);
      localStorage.setItem("designation", designation.toLowerCase() );
      localStorage.setItem("username", username);

      // const { access, refresh } = await loginResponse.json();
      // localStorage.setItem("access_token", access);
      // localStorage.setItem("refresh_token", refresh);

      alert("Signed up and logged in successfully as Admin!");

      // Clear form
      setFullName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCompany("");
      setDesignation("employee"); 

      onClose();

      // Redirect or set admin dashboard
      window.location.href = "/"; 
    } catch (err) {
      console.error("Signup error:", err);
      setError("Signup failed due to a server error.");
    } finally {
      setLoading(false);
    }
  };

  //  Restrict access to only SuperAdmin
  if (!isAuthenticated() || !isSuperAdmin()) {
    return null; 
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Transition}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          px: 3,
          py: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        Sign Up
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSignUp} sx={{ mt: 2 }}>
          <Typography variant="body1" mb={2}>
            Create your account
          </Typography>

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="First Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="designation-label">Designation</InputLabel>
            <Select
              labelId="designation-label"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              label="Designation"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            margin="normal"
            required
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
          <TextField
            fullWidth
            label="Re-enter Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CombinedSignUpPage;
