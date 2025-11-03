import { Box, Container, Typography, Grid, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const reasons = [
  "Proven Expertise Across Industries",
  "Agile & Transparent Work Process",
  "Dedicated Support & Maintenance",
  "On-Time Delivery Commitment",
  "Tailor-Made Scalable Solutions",
  "Trusted by Leading Brands",
  "Innovative Tech-Driven Approach",
  "Customer-First Business Culture",
  "Cost-Effective & Scalable Services"
];

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const WhyChooseUsSection = () => {
  const theme = useTheme();

  return (
    <Box
      py={{ xs: 6, md: 10 }}
      px={2}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.common.white} 70%)`,
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary"
            
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
          >
            Why Choose Us
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto", fontSize: "1.1rem" }}
          >
            What Sets Us Apart
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {reasons.map((reason, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={index}
                variants={cardVariant}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    bgcolor: "#fff",
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    minHeight: 120,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: 'default',
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: theme.shadows[6],
                    },
                    flexDirection: 'row',
                  }}
                >
                  <CheckCircleIcon
                    sx={{ color: theme.palette.primary.main, fontSize: 32, flexShrink: 0 }}
                  />
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
                  >
                    {reason}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyChooseUsSection;
