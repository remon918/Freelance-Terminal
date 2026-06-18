"use client";

import React, { useEffect, useRef, useState } from "react";
import NavLink from "./NavLink";

const DropDownMenu = ({ menus }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div ref={menuRef} className="md:hidden relative z-999999">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="relative z-999999 flex flex-col justify-center items-center gap-1.5 w-9 h-9 rounded-xl bg-base-content border-teal-200"
      >
        <span
          className={`w-5 h-0.5 bg-teal-600 rounded-full transition-all duration-300 ${
            menuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />

        <span
          className={`w-5 h-0.5 bg-teal-600 rounded-full transition-all duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />

        <span
          className={`w-5 h-0.5 bg-teal-600 rounded-full transition-all duration-300 ${
            menuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      <div
        className={`fixed inset-0 bg-black/40 transition-all duration-300 z-999997
        ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      <div
        className={`absolute top-14 left-0 w-64 rounded-3xl
        bg-white/95 backdrop-blur-2xl border border-white/20
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        transition-all duration-300 z-999998
        ${
          menuOpen
            ? "opacity-100 translate-y-0 scale-100 visible"
            : "opacity-0 -translate-y-5 scale-95 invisible"
        }`}
      >
        <div className="p-3">
          <div className="mb-3 px-4 py-3 rounded-2xl bg-linear-to-r from-teal-500 to-teal-300 text-white">
            <h3 className="font-semibold text-lg">Welcome 👋</h3>

            <p className="text-sm text-white/80 mt-1">
              Explore services
            </p>
          </div>

          <ul className="space-y-2">
            {menus.map((menu) => (
              <li key={menu.href}>
                <NavLink href={menu.href} onClick={() => setMenuOpen(false)}>
                  <span className="flex items-center gap-3 rounded-2xl px-4 py-3 text-gray-700 font-medium hover:bg-teal-500/10 hover:text-teal-700 transition-all duration-200">
                    {menu.icon} {menu.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropDownMenu;
