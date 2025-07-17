import HeroSection from "./sections/about/HeroSection";
import ServicesSection from "./sections/about/ServicesSection";
import IndustriesSection from "./sections/about/IndustriesSection";
import WhyChooseUsSection from "./sections/about/WhyChooseUsSection";
import TestimonialsSection from "./sections/about/TestimonialsSection";
import ContactCTASection from "./sections/about/ContactCTASection";
import MilestoneSection from "./sections/about/MilestonesSection";
import TechnologiesSection from "./sections/about/TechnologiesSection";
import FooterSection from "./sections/about/FooterSection";
import ScrollToTopButton from "./sections/about/ScrollToTop";

const About = () => {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <IndustriesSection />
      <TechnologiesSection />
      <WhyChooseUsSection />
      <MilestoneSection />
      <TestimonialsSection />
      <ContactCTASection />
      <FooterSection />
      <ScrollToTopButton />
    </>
  );
};

export default About;

