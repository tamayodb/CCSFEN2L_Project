"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const exploreCategories = [
  {
    label: "Peripherals",
    href: "/peripherals",
    items: [
      { label: "Mice", href: "/peripherals" },
      { label: "Keyboards", href: "/peripherals" },
      { label: "Headsets", href: "/peripherals" },
      { label: "Microphones", href: "/peripherals" },
      { label: "Webcams", href: "/peripherals" },
      { label: "Gamepads", href: "/peripherals" },
      { label: "Gaming Chairs", href: "/peripherals" },
    ],
  },
  {
    label: "Games",
    href: "/games",
    items: [
      { label: "Action", href: "/games" },
      { label: "Adventure", href: "/games" },
      { label: "Casual", href: "/games" },
      { label: "Fighting", href: "/games" },
      { label: "Puzzle", href: "/games" },
      { label: "Racing", href: "/games" },
      { label: "Role Playing", href: "/games" },
    ],
  },
  {
    label: "Collectibles",
    href: "/collectibles",
    items: [
      { label: "Action Figures", href: "/collectibles" },
      { label: "Amiibo", href: "/collectibles" },
      { label: "Badges", href: "/collectibles" },
      { label: "Cards", href: "/collectibles" },
      { label: "Plush", href: "/collectibles" },
    ],
  },
];

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null); // Add timeout state
  const [currentImage, setCurrentImage] = useState(0); // State to control the current image

  const images = [
    "/homepage/brand1.webp",
    "/homepage/brand2.webp",
    "/homepage/brand4.png",
    "/homepage/brand5.webp",
  ];

  const router = useRouter();

  const toggleSearchBar = () => setIsSearchOpen(!isSearchOpen);

  const handleMouseEnterExplore = () => {
    clearTimeout(timeoutId); // Clear the timeout if mouse enters the explore area
    setIsExploreOpen(true);
  };

  const handleMouseLeaveExplore = () => {
    const newTimeoutId = setTimeout(() => {
      setIsExploreOpen(false);
    }, 400); // Delay in ms before closing
    setTimeoutId(newTimeoutId);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm) {
      router.push(`/search/${searchTerm}`);
    }
  };

  const handleCloseExplore = () => {
    clearTimeout(timeoutId); // Clear the timeout on close
    setIsExploreOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  // Animation Variants
  const listItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger the child elements
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Change image every 2 seconds (slower change)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 2 seconds (slower change)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <nav className="bg-white text-black pt-1 fixed top-0 left-0 right-0 shadow-md z-50 w-full">
      <div className="container mx-auto flex items-center justify-between px-12">
        <div className="flex items-center flex-shrink-0">
          <Link href="/" passHref>
            <Image
              src="/navbar/Logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain cursor-pointer"
            />
          </Link>
        </div>

        <div
          className={`flex-grow hidden md:flex justify-center ${
            isSearchOpen ? "opacity-0" : "opacity-100"
          }`}
        >
          <ul className="flex space-x-12">
            <li
              className="relative hover:text-bg[#0D3B66] hover:font-semibold transition-all duration-200 ease-in-out cursor-pointer"
              style={{ minWidth: "max-content" }}
            >
              <Link href="/" className="block text-xs">
                Home
              </Link>
            </li>
            <li
              className="relative hover:text-bg[#0D3B66] hover:font-semibold transition-all duration-200 ease-in-out cursor-pointer text-xs"
              style={{ minWidth: "max-content" }}
              onMouseEnter={handleMouseEnterExplore}
              onMouseLeave={handleMouseLeaveExplore}
            >
              Products
            </li>
            <li
              className="relative hover:text-bg[#0D3B66] hover:font-semibold transition-all duration-200 ease-in-out cursor-pointer"
              style={{ minWidth: "max-content" }}
            >
              <Link href="/orders/all" className="block text-xs">
                Orders
              </Link>
            </li>
            <li
              className="relative hover:text-bg[#0D3B66] hover:font-semibold transition-all duration-200 ease-in-out cursor-pointer"
              style={{ minWidth: "max-content" }}
            >
              <Link href="/discover" className="block text-xs">
                Discover
              </Link>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex space-x-6">
          <Image
            src="/navbar/Search.png"
            alt="Search"
            width={18}
            height={18}
            className="object-contain cursor-pointer"
            onClick={toggleSearchBar}
          />
          <Image
            src="/navbar/Shopping Cart.png"
            onClick={() => router.push("/cart")}
            alt="Shopping Cart"
            width={18}
            height={18}
            className="object-contain cursor-pointer"
          />
          <Link href="/user/account/profile">
            <Image
              src="/navbar/User.png"
              alt="User"
              width={18}
              height={18}
              className="object-contain cursor-pointer"
            />
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-[#0D3B66] hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-[#0D3B66] h-1 w-full mt-1"></div>

      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white shadow-lg pt-2"
        initial={{ width: "0%", opacity: 0 }}
        animate={{
          width: isSearchOpen ? "50rem" : "0%",
          opacity: isSearchOpen ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
        onMouseLeave={() => setIsSearchOpen(false)} // Close search bar on hover out
      >
        <input
          type="text"
          className="w-full p-1 border border-gray-300 rounded-md text-xs"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </motion.div>

      {/* Explore Dropdown */}
      {isExploreOpen && (
        <motion.div
          className="absolute top-full left-0 w-full bg-gray-100 shadow-lg z-40 pt-2 px-4 pb-4"
          onMouseEnter={handleMouseEnterExplore}
          onMouseLeave={handleMouseLeaveExplore}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <button
            className="absolute top-2 right-2 text-xl font-bold text-[#0D3B66] cursor-pointer"
            onClick={handleCloseExplore}
          >
            &times;
          </button>
          <div className="flex mt-4 mx-auto justify-center gap-28">
            {/* Categories Container */}
            <div className="flex grid grid-cols-3 py-2 gap-28">
              {" "}
              {/* Compact the grid by reducing padding and adjusting*/}
              {exploreCategories.map((category) => (
                <div key={category.label}>
                  <motion.h3
                    className="font-semibold text-lg text-[#0D3B66] mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 1 } }}
                  >
                    <Link href={category.href}>{category.label}</Link>
                  </motion.h3>
                  <motion.ul variants={containerVariants}>
                    {category.items.map((item) => (
                      <motion.li
                        key={item.label}
                        variants={listItemVariants}
                        className=""
                      >
                        <Link
                          href={item.href}
                          className="hover:text-[#0D3B66] cursor-pointer text-sm"
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              ))}
            </div>
            {/* Vertical Separator */}
            <div className="border-l border-gray-300 h-auto mx-4"></div>{" "}
            {/* Vertical line */}
            {/* Image Container (Right side of categories) */}
            <div className=" flex justify-center items-start">
              <motion.div
                key={images[currentImage]}
                className="w-[300px] h-[200px] flex justify-center items-center" // Updated container size
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 2 } }}
                exit={{ opacity: 0 }}
              >
                <Image
                  src={images[currentImage]}
                  alt={`Brand ${currentImage}`}
                  width={300} // Set fixed width
                  height={150} // Set fixed height
                  className="object-fill" // Ensures image covers the container appropriately
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}