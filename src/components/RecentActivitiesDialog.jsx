// src/components/RecentActivitiesDialog.jsx
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

export default function RecentActivitiesDialog({ open, handleClose }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Recent Activities</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Latest updates from the manufacturing floor:
        </DialogContentText>
        <List>
          <ListItem>
            <ListItemText
              primary="Batch #45 completed successfully"
              secondary="Today, 04:10 PM"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Line 2 restarted after maintenance"
              secondary="Today, 03:50 PM"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Temperature Alert Resolved on Line 3"
              secondary="Today, 03:20 PM"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="New Batch started in Oven Line 1"
              secondary="Today, 02:45 PM"
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
}
