import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress, Box, Grid, TextField, MenuItem, Pagination
} from "@mui/material";
import axios from "axios";
import { isAuthenticated, isSuperAdmin } from "../utils/auth";

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
        const res = await axios.get("http://127.0.0.1:8000/api/users/list_all_users/", {
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
 
  return (
    <Box sx={{ px: 4, py: 5 }}>
    <Paper
      elevation={4}
      sx={{
        padding: 4,
        borderRadius: 4,
        background: "#fefefe",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#1976d2" }}
      >
        Active Users Tracking
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 3, color: "#666" }}>
        View and filter all active users by role and name
      </Typography>

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

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Designation</strong></TableCell>
                  <TableCell><strong>Date Joined</strong></TableCell>
                  <TableCell><strong>Last Login</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                      "&:hover": {
                        backgroundColor: "#f1faff",
                      },
                    }}
                  >
                    <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {user.designation || (user.email === "TechasoftAdmin@techasoft.com" ? "superadmin" : "-")}
                    </TableCell>
                    <TableCell>
                      {new Date(user.date_joined).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : "Never"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
              shape="rounded"
              color="primary"
            />
          </Box>
        </>
      )}
    </Paper>
  </Box>
   
  );
};

export default UsersPage;
