import { Box, Container, Grid, Typography } from "@mui/material";

const FooterSection = () => {
  return (
    <Box sx={{ background: "#f9f9f9", py: 6, mt: 2, fontSize: 14 }}>
      <Container>
        <Grid container spacing={4}>
          {/* Column 1 - Company Address */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Techasoft Pvt. Ltd.</Typography>
            <Typography>#435, 3rd Floor, 27th Main Road,<br/>1st Sector HSR Layout, Bangalore - 560102</Typography>
            <Typography mt={2}><strong>Branch Office (Hyderabad)</strong><br/>Wajid Residency, 9-4-77 /A/55, Al Hasnath Colony,<br/>Toli Chowki,Hyderabad,Telangana.</Typography>
            <Typography mt={2}><strong>Branch Office (Jabalpur)</strong><br/>G.D COMPLEX, Old Krishna Talkies Compound, Nagar Nigam Road,<br/>Teen Patti, Jabalpur, Madhya Pradesh - 482002</Typography>
            <Typography mt={2}><strong>Branch Office (Delhi)</strong><br/>K-108, Thokar No.5, Abul Fazal Enclave Part 1,<br/>Jamia Nagar, Okhla, New Delhi, Delhi, 110025</Typography>
            <Typography mt={2}><strong>Branch Office (Haryana)</strong><br/>D19, Near Made Easy Primary School, Sector 57,<br/>Gurgaon, Haryana 122413</Typography>
            <Typography mt={2}><strong>Branch Office (Thane)</strong><br/>Jagdish Industrial Estate Acharya Atre Marg, Tulsi Dham,<br/>Vedant Complex, Vartak Nagar, Thane West, Thane<br/>Gala No : 110, Thane, Maharashtra 400606</Typography>
            <Typography mt={2}><strong>Branch Office (Jamshedpur)</strong><br/>Qr No : 41, T.R Type, Diagonal Road, Bistupur,<br/>Jamshedpur, Jharkhand 831001</Typography>
            <Typography mt={2}>📞 +91 8884 739 988<br/>✉️ info@techasoft.com<br/>📍 Map Get Direction</Typography>
          </Grid>

          {/* Column 2 - International & Services */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>INTERNATIONAL SERVICE</Typography>
            <Typography>Digital Marketing<br/>SEO Agency<br/>Search Engine Marketing<br/>Social Media Marketing</Typography>
            <Typography mt={2}><strong>International Address</strong><br/>2170 Sherobee Road Mississauga,<br/>ON L5A 3P8 Canada<br/>📞 +1 647 470 2985</Typography>
            <Typography mt={2}>Meena Bazar, Cosmos Lane - near Dubai Museum - Bur Dubai - Al Souq Al Kabeer - Dubai - United Arab Emirates.<br/>📞 +971 507557789</Typography>
            <Typography mt={2}><strong>Ecommerce SERVICE</strong><br/>Book E-commerce Store<br/>Electronic E-commerce Store<br/>Home E-commerce Store<br/>Jewelery E-commerce Store</Typography>
            <Typography mt={2}><strong>Testing</strong><br/>Software Testing<br/>Security Testing<br/>Performance Testing</Typography>
            <Typography mt={2}><strong>Consultant</strong><br/>NetSuite solution consultant<br/>Recruitment Service<br/>SharePoint Development<br/>Software Consultant<br/>SharePoint Support & Maintenance<br/>NetSuite Support Services</Typography>
          </Grid>

          {/* Column 3 - Services & Developers */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>SERVICES</Typography>
            <Typography>Digital Marketing<br/>SEO Services<br/>HR and Payroll Management<br/>Website Design<br/>Mobile App Development<br/>UI/UX Design<br/>SEO Company In India<br/>Logo Design<br/>Brochure Design</Typography>
            <Typography mt={2}><strong>Product Service</strong><br/>Healthcare Management<br/>Election Management Software<br/>Banking Management Software<br/>Trading Software<br/>Travel Management Software<br/>Event Management Software<br/>Custom Boutique Software<br/>Wedding Management Software<br/>Salon Booking Software</Typography>
            <Typography mt={2}><strong>Other Services</strong><br/>Bulk Laptop Dealers<br/>Guest Post Package<br/>Bulk SMS Services</Typography>
            <Typography mt={2}><strong>HIRE DEVELOPERS</strong><br/>PHP Developers<br/>Android Developers<br/>IOS Developers<br/>React Native Developers<br/>Angular Developers<br/>Node.JS Developers<br/>NetSuite Developers<br/>SharePoint Developers</Typography>
          </Grid>

          {/* Column 4 - Training, Tech & Jobs */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Training We Offer</Typography>
            <Typography>Software Training Company In Bangalore<br/>Digital Marketing Training<br/>Full Stack Development Training<br/>IMS and SIP Training<br/>Devops Training</Typography>
            <Typography mt={2}>Contact Us For Training<br/>📞 +91 8867 746 186</Typography>
            <Typography mt={2}><strong>Latest Technologies</strong><br/>Machine Learning Services<br/>Artificial Intelligence Services</Typography>
            <Typography mt={2}><strong>Quick Links</strong><br/>Logo Design Packages<br/>SEO Packages<br/>Portfolio<br/>Become a Partner<br/>Programing Guidelines For PHP<br/>Brand Guidelines<br/>HTML Sitemap<br/>XML Sitemap</Typography>
            <Typography mt={2}><strong>Jobs</strong><br/>Android Developer Jobs<br/>React Native Developer Jobs<br/>Angular Developer Jobs<br/>Node.Js Developer Jobs<br/>Overseas Education Counselor Jobs<br/>Automation Testing Jobs<br/>Work From Home Jobs</Typography>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box mt={6} textAlign="center">
          <Typography variant="body2">© Techasoft. 2025. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterSection;
