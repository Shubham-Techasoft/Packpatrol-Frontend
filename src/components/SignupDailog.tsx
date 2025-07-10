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
import { isAuthenticated, isSuperAdmin } from "../utils/auth";

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

  // Auto-clear error message after 3 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Reset form when dialog is reopened (after being closed manually)
  React.useEffect(() => {
    if (!open) return; // Don't reset unless it's being opened

    setFullName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setCompany("");
    setPassword("");
    setConfirmPassword("");
    setDesignation("employee");
    setError("");
    setLoading(false);
  }, [open]);

  // handle sign up function
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim()) {
      setError("Username is required.");
      setLoading(false);
      return;
    }
    if (fullName.trim().length < 3) {
      setError("First name must be at least 3 characters.");
      setLoading(false);
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required.");
      setLoading(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Invalid email format.");
      setLoading(false);
      return;
    }
    if (!company.trim()) {
      setError("Company is required.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");

      // Step 1: Signup
      const signupResponse = await fetch("http://127.0.0.1:8000/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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

        // message from any field error
        const detailedMessage =
          data.detail && typeof data.detail === "string"
            ? data.detail
            : Object.entries(data)
                .map(([key, val]) => {
                  if (Array.isArray(val)) {
                    return `${key}: ${val.join(", ")}`;
                  }
                  return `${key}: ${val}`;
                })
                .join("\n") || "Signup failed.";

        alert(`Signup failed: ${detailedMessage}`);
        setError(detailedMessage);

        setLoading(false);
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
      localStorage.setItem("designation", designation.toLowerCase());
      localStorage.setItem("username", username);

      localStorage.setItem("email", email);

      // localStorage.setItem("password", password);

      // const { access, refresh } = await loginResponse.json();
      // localStorage.setItem("access_token", access);
      // localStorage.setItem("refresh_token", refresh);

      alert(
        `Signed up and logged in successfully as ${designation.charAt(0).toUpperCase() + designation.slice(1)}!`
      );

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
      setError(`Signup failed due to a server error: ${err.message || err}`);
      // setError("Signup failed due to a server error.");
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
            Create Account
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
