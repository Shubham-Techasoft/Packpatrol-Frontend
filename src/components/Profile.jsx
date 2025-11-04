import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Autocomplete,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {base_URL} from '../utils/api';

const Profile = () => {
  const accessToken = localStorage.getItem("access_token");
  const userEmail = localStorage.getItem("email");
  const isSuperAdmin = userEmail === "TechasoftAdmin@techasoft.com";

  const [userInfo, setUserInfo] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, setResetPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [showConfirmResetPassword, setShowConfirmResetPassword] =
    useState(false);

  const [snack, setSnack] = useState({
    open: false,
    type: "info",
    message: "",
  });
  const [confirmDialog, setConfirmDialog] = useState(false);

  const showAlert = (msg, type = "info") => {
    setSnack({ open: true, type, message: msg });
  };

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${base_URL}/api/users/me/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setUserInfo(data);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

  // fetch users for dropdown
  const fetchAllUsers = async () => {
    try {
      const res = await fetch(
        `${base_URL}/api/users/list_all_users/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      setAllUsers(data);
    } catch (err) {
      console.error("Failed to fetch all users", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    if (isSuperAdmin) {
      fetchAllUsers();
      setSelectedUserEmail("");
      setResetPassword("");
      setConfirmResetPassword("");
    }
  }, []);

  // users change their password admin, manager,user
  const handleChangeOwnPassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword)
      return showAlert("Please fill all fields", "error");
    if (newPassword !== confirmPassword)
      return showAlert("New passwords do not match", "error");

    try {
      const res = await fetch(
        `${base_URL}/api/users/change_password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...userInfo,
            old_password: oldPassword,
            new_password: newPassword,
            confirm_new_password: confirmPassword,
          }),
        }
      );

      const data = await res.json();
      console.log("🔁 Change Password Response:", data);

      if (!res.ok) {
        const firstError =
          Object.values(data)[0]?.[0] || "Password update failed";
        throw new Error(firstError);
      }

      showAlert("Password updated successfully!", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password change failed:", err);
      showAlert(err.message || "Something went wrong", "error");
    }
  };

  // super admin to reset other users password
  const handleResetOtherUserPassword = async (e) => {
    e.preventDefault();

    const userToReset = allUsers.find((u) => u.email === selectedUserEmail);

    if (!userToReset || !resetPassword)
      return showAlert("Select user and enter password", "error");

    if (resetPassword !== confirmResetPassword) {
      return showAlert("Passwords do not match", "error");
    }

    try {
      const res = await fetch(
        `${base_URL}/api/users/admin_password_reset/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...userToReset,
            new_password: resetPassword,
            confirm_new_password: confirmResetPassword,
          }),
        }
      );

      const data = await res.json();
      console.log("🔧 Admin Reset Password Response:", data);

      if (!res.ok) {
        console.error("❌ Full error:", data);

        // 👇 Check if backend returned "new password same as old" kind of message
        if (
          data?.new_password?.[0]?.includes(
            "cannot be the same as the old password"
          )
        ) {
          return showAlert(
            "New password must be different from old password",
            "error"
          );
        }

        // fallback generic error
        throw new Error(data.detail || "Reset failed");
      }

      showAlert(`Password reset for ${userToReset.email}`, "success");

      setResetPassword("");
      setConfirmResetPassword("");
      setSelectedUserEmail("");
      setConfirmDialog(false);
    } catch (err) {
      console.error("Admin password reset error:", err);
      showAlert(err.message || "Something went wrong", "error");
    }
  };

  return (
    <Box sx={{ px: 4, py: 5, pb: 10, minHeight: '100vh', background: 'linear-gradient(to bottom, #f0f4f8, #e3f2fd)' }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={700} color="#004d7a" gutterBottom>
            User Profile & Settings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your account details and security settings.
          </Typography>
        </Box>

      {userInfo && (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      gap: 3,
    }}
  >
    {/* 👤 Left Section: User Info + Change My Password */}
    <Box flex={1}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                {userInfo.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {userInfo.username}
                </Typography>
                <Chip
                  label={userInfo.designation || "Root Admin"}
                  size="small"
                  color={
                    userInfo.designation === "admin"
                      ? "warning"
                      : userInfo.designation === "manager"
                      ? "info"
                      : "success"
                  }
                  sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {userInfo.email}
            </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h8" gutterBottom>
          🔐 Change My Password
        </Typography>
        <form onSubmit={handleChangeOwnPassword}>
          <TextField
            label="Old Password"
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.2 }}>
            Update Password
          </Button>
        </form>
      </Paper>
    </Box>

    {/* 🔐 Right Section: Reset Any User Password (Only Super Admin) */}
    {isSuperAdmin && (
      <Box flex={1}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            🔐 Reset Password for Any User
          </Typography>

          <form onSubmit={handleResetOtherUserPassword}>
            <Autocomplete
              freeSolo
              options={allUsers.map((user) => user.email)}
              value={selectedUserEmail}
              onChange={(event, newValue) => setSelectedUserEmail(newValue || "")}
              onInputChange={(event, newInputValue) =>
                setSelectedUserEmail(newInputValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="User Email"
                  margin="normal"
                  fullWidth
                  required
                />
              )}
            />

            <TextField
              label="New Password"
              type={showResetPassword ? "text" : "password"}
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      edge="end"
                    >
                      {showResetPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm New Password"
              type={showConfirmResetPassword ? "text" : "password"}
              value={confirmResetPassword}
              onChange={(e) => setConfirmResetPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmResetPassword(!showConfirmResetPassword)
                      }
                      edge="end"
                    >
                      {showConfirmResetPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, py: 1.2 }}
              onClick={() => setConfirmDialog(true)}
            >
              Reset User Password
            </Button>
          </form>
        </Paper>
      </Box>
    )}
  </Box>
)}
      </Box>

    
      {/* Confirm Modal */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Password Reset</DialogTitle>
        <DialogContent>
          Are you sure you want to reset the password for{" "}
          <b>{selectedUserEmail}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>

          {/* confirm reset button */}
          <Button
            onClick={handleResetOtherUserPassword}
            variant="contained"
            color="error"
          >
            Confirm Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.type} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>    
  );
};

export default Profile;
