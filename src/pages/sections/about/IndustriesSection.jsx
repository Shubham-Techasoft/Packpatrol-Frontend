import React from "react";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import { heroImages } from "../../../assets/assets";

const IndustriesSection = () => {
  return (
    <Box py={10} bgcolor="#f9f9f9">
      <Container maxWidth="lg">
        <motion.img
          src={heroImages[0]}
          alt="Industries"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: 12,
            boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
            objectFit: "cover",
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />
      </Container>
    </Box>
  );
};

export default IndustriesSection;
