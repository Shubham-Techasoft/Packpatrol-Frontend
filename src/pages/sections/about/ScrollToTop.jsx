import { useEffect, useState } from "react";

  const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      const toggleVisibility = () => {
        setVisible(window.pageYOffset > 300);
      };
  
      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  
    return (
      visible && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#007BFF", // Bootstrap primary blue
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            fontSize: "24px",
            cursor: "pointer",
            zIndex: 1000,
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#007BFF")
          }
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )
    );
  };

export default ScrollToTopButton;
