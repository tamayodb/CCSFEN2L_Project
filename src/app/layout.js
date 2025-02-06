"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { poppins } from "../utils/fonts.jsx";
import Navbar from "@/components/Navbar";
import Navbarblank from "@/components/Navbar-blank";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [useBlankNavbar, setUseBlankNavbar] = useState(false);

  useEffect(() => {
    setUseBlankNavbar(pathname === "/login" || pathname === "/signup");
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${poppins} pt-[40px]`}>
        {useBlankNavbar ? <Navbarblank /> : <Navbar />}
        {children}
        <Footer />
      </body>
    </html>
  );
}
