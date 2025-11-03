import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { heroImages } from "../../../assets/assets";
import SectionTitle from "../../../components/shared/SectionTitle";

const IndustriesSection = () => {
  return (
    <Box py={{ xs: 6, md: 10 }} bgcolor="#f8f9fa">
      <Container maxWidth="lg">
        <SectionTitle title="Industries We Serve" subtitle="Delivering excellence across diverse sectors" />
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
