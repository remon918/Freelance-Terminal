"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const Scroll = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
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
      className={`fixed bottom-6 right-6 z-999999
      bg-teal-400 hover:bg-teal-300
      text-white p-4 rounded-full shadow-2xl
      transition-all duration-300
      hover:scale-110 active:scale-95
      ${
        showButton
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <FaArrowUp size={24} />
    </button>
  );
};

export default Scroll;
