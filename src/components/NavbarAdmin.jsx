"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <nav className="bg-white text-black pt-1 fixed top-0 left-0 right-0 shadow-md z-50 w-full">
      <div className="container mx-auto flex items-center justify-between px-12">
        <div className="flex items-center flex-shrink-0">
          <h2 className="text-xl font-bold mr-4">ADMIN</h2>
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
        <button
          onClick={handleLogout}
          className="text-xs text-[#0D3B66] hover:underline"
        >
          Logout
        </button>
      </div>
      <div className="bg-[#0D3B66] h-1 w-full mt-1"></div>
    </nav>
  );
}