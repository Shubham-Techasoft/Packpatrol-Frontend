import { useEffect } from 'react';

export const useKeyboardSafeView = () => {
  useEffect(() => {
    // Update viewport height
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Handle input focus
    const handleInputFocus = (e) => {
      setTimeout(() => {
        e.target.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    };

    // Add event listeners
    window.addEventListener('resize', updateViewportHeight);
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', handleInputFocus);
    });

    // Initial call
    updateViewportHeight();

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      inputs.forEach(input => {
        input.removeEventListener('focus', handleInputFocus);
      });
    };
  }, []);
};