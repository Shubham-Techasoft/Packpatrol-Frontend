import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Typography,
  Box,
  Paper,
  Grid,
  Pagination,
  FormControl,
  InputLabel,
  Select as MUISelect,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CheckCircle, Cancel, AccessTime } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import {base_URL} from '../utils/api';

const LOCAL_STORAGE_KEY = "hiddenActivityLogs";

export default function RecentActivitiesDialog({ open, handleClose, onApplyLog }) {
  const theme = useTheme();
  const [logs, setLogs] = React.useState([]);
  const [page, setPage] = React.useState(1);              // 1-based page
  const [rowsPerPage, setRowsPerPage] = React.useState(4); // default items per page

  React.useEffect(() => {
    if (open) {
      axios
        .get(`${base_URL}/api/machinerunlogs/`)
        .then((res) => {
          const hiddenIds = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
          const filtered = res.data
            .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
            .filter((log) => !hiddenIds.includes(log.id));
          setLogs(filtered);
          setPage(1); // reset to first page when dialog opens
        })
        .catch((err) => console.error("Failed to fetch machine logs", err));
    }
  }, [open]);

  const handleHideActivity = (id) => {
    setLogs((prev) => {
      const updated = prev.filter((log) => log.id !== id);
      const currentHidden = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      const updatedHidden = [...new Set([...currentHidden, id])];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHidden));
      // keep page within bounds after removal
      const newPageCount = Math.max(1, Math.ceil(updated.length / rowsPerPage));
      setPage((p) => (p > newPageCount ? newPageCount : p));
      return updated;
    });
  };

  // pagination calc
  const pageCount = Math.max(1, Math.ceil(logs.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedLogs = logs.slice(startIndex, startIndex + rowsPerPage);

  // reset to page 1 when changing page size
  React.useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { padding: theme.spacing(2), position: "relative", zIndex: 1301, borderRadius: 7 },
      }}
      BackdropProps={{
        sx: { backdropFilter: "blur(3px)", backgroundColor: "rgba(0, 0, 0, 0.2)" },
      }}
    >
      <DialogTitle>
        Recent Activities
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8, color: (t) => t.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {logs.length === 0 ? (
          <Typography variant="body2">No recent activities available</Typography>
        ) : (
          <>
            <Grid container spacing={2}>
              {paginatedLogs.map((log) => (
                <Grid item xs={12} md={6} key={log.id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      borderLeft: "6px solid #1976d2",
                      backgroundColor: "#fafafa",
                      position: "relative",
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography fontWeight="bold">
                        {log.machine_name || "Unknown Machine"} – {log.variant_name || "Unknown Variant"}
                      </Typography>

                      <Box display="flex" flexDirection="column" alignItems="flex-end">
                        <IconButton
                          size="small"
                          onClick={() => handleHideActivity(log.id)}
                          sx={{ color: "#888", padding: 0, mb: 0.5 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={log.is_running ? "Running" : "Stopped"}
                            color={log.is_running ? "success" : "error"}
                            icon={log.is_running ? <CheckCircle /> : <Cancel />}
                            size="small"
                          />
                          <Chip
                            label="Apply"
                            size="small"
                            clickable
                            onClick={() => {
                              onApplyLog?.(log);
                              handleClose();
                            }}
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              color: "#fff",
                              fontWeight: "bold",
                              px: 2.5,
                              py: 1,
                              "&:hover": { bgcolor: theme.palette.primary.dark },
                              boxShadow: 2,
                              borderRadius: "6px",
                              transition: "0.3s",
                            }}
                            variant="filled"
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant="body2" mt={1}>
                      Biscuit: {log.biscuit_type || "N/A"}
                    </Typography>

                    <Grid container spacing={1} mt={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2">Min Stack Size: {log.min_stack_size}</Typography>
                        <Typography variant="body2">Min Stack Length: {log.min_stack_length}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Max Stack Size: {log.max_stack_size}</Typography>
                        <Typography variant="body2">Max Stack Length: {log.max_stack_length}</Typography>
                      </Grid>
                    </Grid>

                    <Box mt={1}>
                      <Typography variant="caption" color="text.secondary">
                        <AccessTime fontSize="inherit" /> Start: {new Date(log.start_time).toLocaleString()}
                      </Typography>
                      <br />
                      {log.stop_time ? (
                        <Typography variant="caption" color="text.secondary">
                          <AccessTime fontSize="inherit" /> Stop: {new Date(log.stop_time).toLocaleString()}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          <AccessTime fontSize="inherit" /> Stop: Not available
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Pagination + Rows per page */}
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              alignItems="center"
              justifyContent="space-between"
              mt={2}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="text.secondary">
                  Rows per page:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <MUISelect
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    {[2, 4, 6, 8, 10, 12, 16].map((n) => (
                      <MenuItem key={n} value={n}>
                        {n}
                      </MenuItem>
                    ))}
                  </MUISelect>
                </FormControl>
              </Box>

              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape= "rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2, // makes them rectangular
                  },
                }}
              />
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
