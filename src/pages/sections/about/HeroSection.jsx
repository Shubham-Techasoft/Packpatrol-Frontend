import React, { useEffect, useState } from "react";
import { heroImages } from "../../../assets/assets";

import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// Slide data
const slides = [
  {
    title: "Driving Innovation with AI & Data Solutions",
    subtitle:
      "Unlock the power of Machine Learning, Automation, and Cloud Intelligence to supercharge your business.",
    button: "Get Started",
    link: "https://www.techasoft.com/",
  },
  {
    title: "Transforming Businesses with Next-Gen Software",
    subtitle:
      "Explore our powerful and scalable product solutions for various industries.",
    button: "Explore Our Products",
    link: "https://www.techasoft.com/products",
  },
  {
    title: "Empowering Digital Presence with Creative UI/UX",
    subtitle:
      "See how we’ve helped our clients with engaging, high-conversion digital experiences.",
    button: "Our Clients",
    link: "https://www.techasoft.com/clients",
  },
];

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const currentSlide = slides[index];

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % slides.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box sx={{ position: "relative", overflow: "hidden", minHeight: "70vh" }}>
        {/* Background Gradient Animation */}
        <motion.div
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{
            background:
              "linear-gradient(135deg, #d0e8ff, #fef6f0, #f0f4ff, #f9f9f9)",
            backgroundSize: "600% 600%",
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 30, repeat: Infinity }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 8, md: 10 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Grid container spacing={6} alignItems="center">
            {/* Left: Slide Content */}
            <Grid item xs={12} md={6}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}
                  >
                    {currentSlide.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {currentSlide.subtitle}
                  </Typography>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 8,
                        backgroundColor: "#1976d2",
                      }}
                      onClick={() => window.open(currentSlide.link, "_blank")} 
                    >
                      {currentSlide.button}
                    </Button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Pagination Dots */}
              <Box mt={4} display="flex" alignItems="center">
                {slides.map((_, i) => (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.9 }}
                    style={{ marginRight: 8 }}
                  >
                    <IconButton
                      onClick={() => setIndex(i)}
                      sx={{
                        width: 14,
                        height: 14,
                        p: 0,
                        borderRadius: "50%",
                        border: "1px solid",
                        borderColor:
                          i === index ? "primary.main" : "grey.400",
                        bgcolor:
                          i === index ? "primary.main" : "transparent",
                        transition: "all 0.3s",
                      }}
                    >
                      <FiberManualRecordIcon
                        fontSize="small"
                        sx={{
                          fontSize: 10,
                          color: i === index ? "#fff" : "transparent",
                        }}
                      />
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </Grid>

            {/* Right: Consistent Image */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 500,
                  height: { xs: 250, md: 350 },
                  mx: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={index}
                    src={heroImages[index]}
                    alt="Techasoft Banner Slide"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </AnimatePresence>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bridging Line */}
      <Box py={2} textAlign="center" bgcolor="#f5f5f5">
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1rem", md: "1.25rem" }, color: "#333" }}
        >
          Bridging the Gap Between Business and Technology
        </Typography>
      </Box>
    </>
  );
};

export default HeroSection;
