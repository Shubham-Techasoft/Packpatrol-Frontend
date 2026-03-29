import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, List, ListItem,
  ListItemText, ListItemSecondaryAction, IconButton, Paper,
  Divider, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { base_URL } from "../utils/api";

export default function EmailUI() {

  // -------------------------------------------------------
  // STATE
  // -------------------------------------------------------
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newEmailError, setNewEmailError] = useState("");
  const [adding, setAdding] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null); // full object {id, email}
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null); // full object {id, email}
  const [deleting, setDeleting] = useState(false);

  // -------------------------------------------------------
  // FETCH emails on page load
  // -------------------------------------------------------
  const fetchEmails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${base_URL}/api/email-recipients/`);
      if (!res.ok) throw new Error("Failed to fetch emails.");
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      setError("Could not load recipients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // -------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // -------------------------------------------------------
  // ADD email
  // -------------------------------------------------------
  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      setNewEmailError("Email cannot be empty.");
      return;
    }
    if (!isValidEmail(newEmail)) {
      setNewEmailError("Please enter a valid email address.");
      return;
    }
    if (emails.some((e) => e.email === newEmail.trim().toLowerCase())) {
      setNewEmailError("This email is already in the list.");
      return;
    }

    setAdding(true);
    try {
      const token = localStorage.getItem("access_token");
        const res = await fetch(`${base_URL}/api/email-recipients/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ email: newEmail.trim().toLowerCase(), is_active: true }),
        });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.email?.[0] || "Failed to add email.");
      }

      await fetchEmails(); // refresh list
      setNewEmail("");
      setNewEmailError("");
    } catch (err) {
      setNewEmailError(err.message);
    } finally {
      setAdding(false);
    }
  };

  // -------------------------------------------------------
  // EDIT email
  // -------------------------------------------------------
  const handleOpenEdit = (item) => {
    setEditItem(item);
    setEditValue(item.email);
    setEditError("");
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      setEditError("Email cannot be empty.");
      return;
    }
    if (!isValidEmail(editValue)) {
      setEditError("Please enter a valid email address.");
      return;
    }
    if (
      emails.some(
        (e) => e.email === editValue.trim().toLowerCase() && e.id !== editItem.id
      )
    ) {
      setEditError("This email is already in the list.");
      return;
    }

    setSaving(true);
    try {

        const token = localStorage.getItem("access_token");
        const res = await fetch(
        `${base_URL}/api/email-recipients/${editItem.id}/`,
        {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({ email: editValue.trim().toLowerCase() }),
        }
        );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.email?.[0] || "Failed to update email.");
      }

      await fetchEmails();
      setEditDialogOpen(false);
      setEditItem(null);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------
  // DELETE email
  // -------------------------------------------------------
  const handleOpenDelete = (item) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
        `${base_URL}/api/email-recipients/${deleteItem.id}/`,
        {
            method: "DELETE",
            headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            },
        }
        );
      

      if (!res.ok) throw new Error("Failed to delete email.");

      await fetchEmails();
      setDeleteDialogOpen(false);
      setDeleteItem(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddEmail();
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <Box sx={{ flexGrow: 1, padding: 3, bgcolor: "#f0f0f9", minHeight: "88vh" }}>

      {/* Page Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <EmailIcon sx={{ fontSize: 30, color: "#062249" }} />
        <Typography variant="h5" fontWeight={700} fontFamily="Poppins" color="#062249">
          Email Recipients
        </Typography>
      </Box>

      {/* Global error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, alignItems: "flex-start" }}>

        {/* ------------------------------------------------- */}
        {/* LEFT — Add Email Card */}
        {/* ------------------------------------------------- */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: { xs: "100%", md: "35%" }, boxShadow: "0 0 20px -5px rgba(106, 107, 107, 1)" }}>
          <Typography variant="h6" fontWeight={600} mb={2} color="#062249">
            Add New Recipient
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Emails added here will receive the biscuit rejection report every 12 hours.
          </Typography>

          <TextField
            fullWidth
            label="Email Address"
            placeholder="e.g. client@example.com"
            value={newEmail}
            onChange={(e) => { setNewEmail(e.target.value); setNewEmailError(""); }}
            onKeyDown={handleKeyDown}
            error={!!newEmailError}
            helperText={newEmailError}
            size="small"
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            startIcon={adding ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            onClick={handleAddEmail}
            disabled={adding}
            sx={{
              borderRadius: 2, fontWeight: 600,
              background: "linear-gradient(135deg, #062249, #1565c0)",
              textTransform: "capitalize",
              ":hover": { background: "linear-gradient(135deg, #1565c0, #062249)" },
            }}
          >
            {adding ? "Adding..." : "Add Email"}
          </Button>
        </Paper>

        {/* ------------------------------------------------- */}
        {/* RIGHT — Email List Card */}
        {/* ------------------------------------------------- */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: { xs: "100%", md: "65%" }, boxShadow: "0 0 20px -5px rgba(106, 107, 107, 1)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight={600} color="#062249">
              Current Recipients
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {emails.length} {emails.length === 1 ? "email" : "emails"}
            </Typography>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Loading state */}
          {loading ? (
            <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>

          /* Empty state */
          ) : emails.length === 0 ? (
            <Box sx={{ py: 6, display: "flex", flexDirection: "column", alignItems: "center", color: "text.secondary", gap: 1 }}>
              <EmailIcon sx={{ fontSize: 40, opacity: 0.3 }} />
              <Typography variant="body2">No recipients added yet.</Typography>
            </Box>

          /* Email list */
          ) : (
            <List disablePadding>
              {emails.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem sx={{ borderRadius: 2, px: 1.5, transition: "background 0.2s", "&:hover": { bgcolor: "#f0f0f9" } }}>
                    <EmailIcon sx={{ mr: 1.5, color: "#062249", fontSize: 20 }} />
                    <ListItemText
                      primary={item.email}
                      primaryTypographyProps={{ fontSize: "0.95rem", fontFamily: "Poppins" }}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Edit">
                        <IconButton edge="end" onClick={() => handleOpenEdit(item)}
                          sx={{ mr: 0.5, color: "#1565c0", "&:hover": { bgcolor: "#e3f2fd" } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton edge="end" onClick={() => handleOpenDelete(item)}
                          sx={{ color: "#c62828", "&:hover": { bgcolor: "#ffebee" } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < emails.length - 1 && <Divider sx={{ my: 0.5 }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* ------------------------------------------------- */}
      {/* EDIT DIALOG */}
      {/* ------------------------------------------------- */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle fontFamily="Poppins" fontWeight={600}>Edit Email</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Email Address" value={editValue}
            onChange={(e) => { setEditValue(e.target.value); setEditError(""); }}
            error={!!editError} helperText={editError} size="small" sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setEditDialogOpen(false)} startIcon={<CancelIcon />}
            color="inherit" sx={{ textTransform: "capitalize" }}>Cancel</Button>
          <Button onClick={handleSaveEdit} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            variant="contained" disabled={saving}
            sx={{ textTransform: "capitalize", background: "linear-gradient(135deg, #062249, #1565c0)" }}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ------------------------------------------------- */}
      {/* DELETE DIALOG */}
      {/* ------------------------------------------------- */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle fontFamily="Poppins" fontWeight={600}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove <strong>{deleteItem?.email}</strong> from the recipients list?
            They will no longer receive rejection reports.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} startIcon={<CancelIcon />}
            color="inherit" sx={{ textTransform: "capitalize" }}>Cancel</Button>
          <Button onClick={handleConfirmDelete} startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            variant="contained" color="error" disabled={deleting}
            sx={{ textTransform: "capitalize" }}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}