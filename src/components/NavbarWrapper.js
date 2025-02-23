"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import NavbarLogoOnly from "@/components/NavbarLogoOnly";

const NavbarWrapper = () => {
  const pathname = usePathname();

  // Hide Navbar on the signup and login pages
  if (pathname === "/signup" || pathname === "/login") return <NavbarLogoOnly/>;

  return <Navbar />;
};

export default NavbarWrapper;
