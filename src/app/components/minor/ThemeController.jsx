"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeController = () => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "normal";

    setTimeout(() => {
      setTheme(savedTheme);
    }, 0);
  }, []);

  useEffect(() => {
    if (!theme) return;

    const html = document.documentElement;
    if (theme === "deepBlue") {
      html.setAttribute("data-theme", "deepBlue");
    } else {
      html.removeAttribute("data-theme");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  if (!theme) return null;

  return (
    <button
      onClick={() => setTheme(theme === "deepBlue" ? "normal" : "deepBlue")}
      className={` ${theme === "deepBlue" ? "" : "bg-[#06152b]/60"} fixed top-25 left-6 z-999 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white transparent shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95`}
    >
      {theme === "deepBlue" ? <FaSun size={22} /> : <FaMoon size={22} />}
    </button>
  );
}

export default ThemeController;