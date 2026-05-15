import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisible = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisible);
        return () => window.removeEventListener("scroll", toggleVisible);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", 
        });
    };

    return (
        <button
            onClick={scrollToTop}
            style={{
                position: "fixed",
                bottom: "40px",
                right: "40px",
                padding: "12px 16px",
                fontSize: "18px",
                borderRadius: "50%",
                border: "none",
                background: "#e50914",
                color: "white",
                cursor: "pointer",
                display: visible ? "block" : "none",
                zIndex: 1000,
            }}
        >
            ↑
        </button>
    );
};

export default ScrollToTopButton;