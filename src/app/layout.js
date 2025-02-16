import "./globals.css";
import { poppins } from "../utils/fonts.jsx";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "DataBlitz",
  description: "Your Total Gaming & Multimedia Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins} pt-[40px]`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
