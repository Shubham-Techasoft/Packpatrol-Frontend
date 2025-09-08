import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100%"
      bgcolor="#f5f5f5"
    >
      <CircularProgress color="primary" size={48} />
      <Typography mt={2} variant="h6" color="textSecondary">
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;