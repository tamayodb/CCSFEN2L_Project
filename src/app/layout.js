import "./globals.css";
import { poppins } from "../utils/fonts.jsx";
import NavbarWrapper from "@/components/NavbarWrapper"; // Use a separate client component
import Footer from "@/components/Footer";

export const metadata = {
  title: "DataBlitz",
  description: "Your Total Gaming & Multimedia Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins} pt-[40px]`}>
        <NavbarWrapper /> {/* Conditionally renders Navbar */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
