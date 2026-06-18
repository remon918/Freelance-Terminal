"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLink = ({ href, children, className }) => {
  const pathname = usePathname();
  // console.log("pathname", pathname)

  const isActive = href === pathname;
  return (
    <Link
      href={href}
      className={`${isActive ? "border-b-2 border-gray-500" : ""} ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
