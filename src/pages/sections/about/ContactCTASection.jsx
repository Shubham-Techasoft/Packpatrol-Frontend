import { Box, Container, Typography, Button, TextField, Grid, Paper } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { heroImages } from "../../../assets/assets";

const floatAnimation = {
  animate: {
    y: [0, -19, 0], // moves up 19px and back
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const ContactCTASection = () => {
  return (
    <Box sx={{ py: 10, backgroundColor: '#f5f5f5', mt:10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left side: Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" mb={2} fontWeight="600">
              Share your query and contact
            </Typography>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Name" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Subject" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={4} label="Message" variant="outlined" />
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Button variant="contained" size="large">
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right side: Animated Image */}
          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <motion.img
              src={heroImages[3]}
              alt="Contact"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: 12 }}
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
