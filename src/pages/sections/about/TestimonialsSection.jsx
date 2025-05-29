import { Box, Container, IconButton } from '@mui/material';
import SectionTitle from '../../../components/shared/SectionTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { testimonialImages } from '../../../assets/assets';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const TestimonialsSection = () => {
  return (
    <Box sx={{ position: 'relative', py: 8, backgroundColor: '#f9f9f9' }}>
      {/* Half-screen background overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          backgroundColor: '#e3f2fd', // light blue
          zIndex: 0,
        }}
      />
      
      <Container sx={{ position: 'relative', zIndex: 1 }}>
        <SectionTitle title="What Our Clients Say" subtitle="Testimonials from Our Partners" />

        {/* Navigation Arrows */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <IconButton
            className="custom-swiper-prev"
            sx={{
              backgroundColor: '#fff',
              color: '#1976d2',
              border: '1px solid #ccc',
              '&:hover': { backgroundColor: '#e3f2fd' },
              width: 48,
              height: 48,
              borderRadius: '50%',
              boxShadow: 2,
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <IconButton
            className="custom-swiper-next"
            sx={{
              backgroundColor: '#fff',
              color: '#1976d2',
              border: '1px solid #ccc',
              '&:hover': { backgroundColor: '#e3f2fd' },
              width: 48,
              height: 48,
              borderRadius: '50%',
              boxShadow: 2,
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={3}
          navigation={{
            prevEl: '.custom-swiper-prev',
            nextEl: '.custom-swiper-next',
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonialImages.map((img, index) => (
            <SwiperSlide key={index}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`Testimonial ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
