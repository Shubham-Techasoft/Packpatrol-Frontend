import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Grid,
  TextField,
  MenuItem,
  Pagination,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HistoryIcon from "@mui/icons-material/History";
import axios from "axios";
import { isAuthenticated, isSuperAdmin } from "../utils/auth";
import {base_URL} from "../utils/api";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("access_token");

  const USERS_PER_PAGE = 6;

  // fetch all users data
  useEffect(() => {
    // fetch users
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/users/list_all_users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const activeUsers = res.data.filter((user) => user.is_active);
        setUsers(activeUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // Filter logic
  useEffect(() => {
    let temp = [...users];
    if (search) {
      const keyword = search.toLowerCase();
      temp = temp.filter(
        (u) =>
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword)
      );
    }
    if (designationFilter) {
      temp = temp.filter(
        (u) => (u.designation || "superadmin") === designationFilter
      );
    }
    setFilteredUsers(temp);
    setCurrentPage(1); // reset page when filtering
  }, [search, designationFilter, users]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );
 
  const getRoleChipColor = (role) => {
    switch (role) {
      case "superadmin":
        return "success";
      case "admin":
        return "warning";
      case "manager":
        return "secondary";
      case "user":
        return "primary";
      default:
        return "info";
    }
  };

  return (
    <Box sx={{ px: 4, py: 5, pb: 10, minHeight: '100vh', background: 'linear-gradient(to bottom, #f0f4f8, #e3f2fd)' }}>
      <Paper
      sx={{
        padding: 4,
        borderRadius: 4,
        background: "#fefefe",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
      }}
    >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: "#004d7a" }}
          >
            User Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Browse, search, and filter all active users in the system.
          </Typography>
        </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search by name or email"
            fullWidth
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            label="Filter by Designation"
            fullWidth
            variant="outlined"
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {["admin", "manager", "user", "superadmin"].map((d) => (
              <MenuItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* User Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedUsers.map((user) => {
              const role = user.designation || (user.email === "TechasoftAdmin@techasoft.com" ? "superadmin" : "user");
              return (
                <Grid item xs={12} sm={6} md={4} key={user.id}>
                  <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                            {`${user.first_name} ${user.last_name}`}
                          </Typography>
                          <Chip
                            label={role}
                            color={getRoleChipColor(role)}
                            size="small"
                            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                          />
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1.5 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {user.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Joined: {new Date(user.date_joined).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HistoryIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Last Login: {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
                shape="rounded"
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  </Box>
  );
};

export default UsersPage;
