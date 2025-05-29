import React from "react";
import { Typography, Box } from "@mui/material";

const SectionTitle = ({ title, subtitle }) => {
  return (
    <Box textAlign="center" mb={6}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default SectionTitle;
