import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { heroImages } from "../../../assets/assets";

const floatAnimation = {
  animate: {
    y: [0, -19, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const ContactCTASection = () => {
  // State for form fields
  const [messageSent, setMessageSent] = useState(false);
  const [shouldShowOnReturn, setShouldShowOnReturn] = useState(false);

  // for message display
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && shouldShowOnReturn) {
        setMessageSent(true);
        setShouldShowOnReturn(false);
        setTimeout(() => setMessageSent(false), 4000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [shouldShowOnReturn]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Open Gmail with pre-filled fields
  const handleSendMessage = () => {
    const { name, email, subject, message } = formData;
    const mailTo = "techasoft@gmail.com";
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${mailTo}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open Gmail in a new tab
    window.open(gmailUrl, "_blank");

    // Reset form fields
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    //  Set flag to show message on return
    setShouldShowOnReturn(true);
  };

  return (
    <Box sx={{ py: 10, backgroundColor: "#f5f5f5", mt: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left: Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" mb={2} fontWeight="600">
              Share your query and contact
            </Typography>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Message"
                    variant="outlined"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSendMessage}
                  >
                    Send Message
                  </Button>
                </Grid>

                {messageSent && (
                  <Grid item xs={12} >
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      color: "green",
                      fontWeight: 500,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    ✅ Message sent successfully!
                  </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Right: Floating Image */}
          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <motion.img
              src={heroImages[3]}
              alt="Contact"
              style={{ maxWidth: "100%", height: "auto", borderRadius: 12 }}
              variants={floatAnimation}
              animate="animate"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactCTASection;
