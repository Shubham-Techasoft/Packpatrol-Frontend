import React from "react";
import { Box, Container, Grid, Typography, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import servicesData from "./Services";
import SectionTitle from "../../../components/shared/SectionTitle";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ServicesSection = () => {
  return (
    <Box py={4} px={2} bgcolor="#f9f9f9">
      <Container maxWidth="lg">
        <SectionTitle title="Our Services" subtitle="What We Offer" />

        <Grid container spacing={4}>
          {servicesData.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index}
                variants={cardVariants}
              >
                <Card
                  elevation={4}
                  sx={{
                    p: 3,
                    height: "100%",
                    textAlign: "center",
                    borderRadius: 4,
                    transition: "transform 0.3s",
                    "&:hover": { transform: "translateY(-8px)", boxShadow: 6 },
                  }}
                >
                  <Typography variant="h3" mb={2}>
                    {service.icon}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesSection;
