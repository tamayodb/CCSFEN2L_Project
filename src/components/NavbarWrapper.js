"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import NavbarLogoOnly from "@/components/NavbarLogoOnly";
import AdminNavbar from "@/components/NavbarAdmin";

const NavbarWrapper = () => {
  const pathname = usePathname();

  // Hide Navbar on the signup and login pages
  if (pathname === "/signup" || pathname === "/login") return <NavbarLogoOnly/>;
  if (pathname === "/admin") return <AdminNavbar />;

  return <Navbar />;
};

export default NavbarWrapper;
