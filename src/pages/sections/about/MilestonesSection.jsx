import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import SectionTitle from "../../../components/shared/SectionTitle";

const milestones = [
  { label: "Years Experience", value: "6+", icon: "🎯" },
  { label: "Websites Built", value: "100+", icon: "💻" },
  { label: "Service Locations", value: "15+", icon: "📍" },
  { label: "Happy Customers", value: "35+", icon: "😊" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const MilestonesSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 12,
        px: 2,
        background: `linear-gradient(180deg, #ffffff 0%, #f9fbfc 100%)`,
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary"
            gutterBottom
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
          >
            Our Milestones
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              fontSize: "1rem",
            }}
          >
            A quick look at what we've accomplished over the years
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
              mx: "auto",
              mt: 2,
            }}
          />
        </Box>

        {/* Milestone Cards */}
        <Grid container spacing={4}>
          {milestones.map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
                variants={cardVariants}
              >
                <Card
                  elevation={3}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 5,
                    bgcolor: "#ffffff",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: `0 8px 16px rgba(0, 0, 0, 0.08)`,
                    },
                  }}
                >
                  <Typography
                    variant="h2"
                    component="div"
                    mb={1}
                    sx={{ fontSize: "3rem" }}
                  >
                    {item.icon}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                  >
                    {item.value}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}
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

export default MilestonesSection;
