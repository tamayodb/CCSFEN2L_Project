"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavbarLogoOnly() {
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
      </div>
      <div className="bg-[#0D3B66] h-1 w-full mt-1"></div>
    </nav>
  );
}