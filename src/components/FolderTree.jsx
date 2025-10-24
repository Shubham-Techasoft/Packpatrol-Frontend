import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";
import {base_URL} from '../utils/api';

const FolderTree = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState({});

  useEffect(() => {
    axios
      .get(`${base_URL}/api/machines/`)
      .then((res) => {
        setMachines(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching machines", err);
        setLoading(false);
      });
  }, []);

  const toggle = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, pt: 10 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Folder Structure (PackPatrol-logs)
      </Typography>

      <List>
        {machines.map((machine) => (
          <Box key={machine.id}>
            <ListItemButton onClick={() => toggle(machine.id)}>
              <ListItemIcon>
                <FolderIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={machine.name} />
              {open[machine.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open[machine.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                {machine.variants?.map((variant) => (
                  <Box key={variant.id}>
                    <ListItemButton onClick={() => toggle(variant.id)}>
                      <ListItemIcon>
                        <FolderIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary={variant.name} />
                      {open[variant.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open[variant.id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 4 }}>
                        <ListItemButton>
                          <ListItemIcon>
                            <ImageIcon />
                          </ListItemIcon>
                          <ListItemText primary="image.jpg" />
                        </ListItemButton>
                      </List>
                    </Collapse>
                  </Box>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default FolderTree;
