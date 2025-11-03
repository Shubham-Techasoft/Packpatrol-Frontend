import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Facebook, Instagram, YouTube } from "@mui/icons-material";

const FooterSection = () => {
  return (
    <Box sx={{ background: "#0a1929", color: "#ccd6f6", py: 6, fontSize: 14 }}>
      <Container>
        <Grid container spacing={4}>
          {/* Column 1 - About */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>Techasoft Pvt. Ltd.</Typography>
            <Typography variant="body2" sx={{ color: '#8892b0' }}>
              Driving innovation with AI, Data Solutions, and next-gen software. We transform businesses through technology and creative UI/UX design.
            </Typography>
            <Box mt={2}>
              <IconButton href="https://www.linkedin.com/company/techasoft-pvt-ltd/posts/?feedView=all" sx={{ color: '#ccd6f6' }}><LinkedInIcon /></IconButton>
              <IconButton href="https://x.com/TECHASOFT_BNGLR" sx={{ color: '#ccd6f6' }}><TwitterIcon /></IconButton>
              <IconButton href="https://www.facebook.com/techasoft/" sx={{ color: '#ccd6f6' }}><Facebook /></IconButton>
              <IconButton href="https://www.instagram.com/techasoft_pvt_ltd/" sx={{ color: '#ccd6f6' }}><Instagram /></IconButton>
              <IconButton href="https://www.youtube.com/channel/UC3MLSIMJdEamt0Q0iQ21Omg" sx={{ color: '#ccd6f6' }}><YouTube /></IconButton>
            </Box>
          </Grid>

          {/* Column 2 - Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>Quick Links</Typography>
            <Link href="https://www.techasoft.com/" display="block" color="inherit" underline="hover" sx={{ mb: 1 }}>Services</Link>
            <Link href="https://www.techasoft.com/" display="block" color="inherit" underline="hover" sx={{ mb: 1 }}>Products</Link>
            <Link href="https://www.techasoft.com/" display="block" color="inherit" underline="hover" sx={{ mb: 1 }}>Portfolio</Link>
            <Link href="https://www.techasoft.com/" display="block" color="inherit" underline="hover" sx={{ mb: 1 }}>Careers</Link>
          </Grid>

          {/* Column 3 - Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>Contact Us</Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOnIcon sx={{ mr: 1, color: '#64ffda' }} />
              <Typography variant="body2" sx={{ color: '#8892b0' }}>HSR Layout, Bangalore - 560102</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon sx={{ mr: 1, color: '#64ffda' }} />
              <Typography variant="body2" sx={{ color: '#8892b0' }}>+91 8884 739 988</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <EmailIcon sx={{ mr: 1, color: '#64ffda' }} />
              <Typography variant="body2" sx={{ color: '#8892b0' }}>info@techasoft.com</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box mt={6} textAlign="center" pt={3} borderTop="1px solid #303c55">
          <Typography variant="body2" sx={{ color: '#8892b0' }}>
            © {new Date().getFullYear()} Techasoft Pvt. Ltd. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterSection;
