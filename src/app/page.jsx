"use client";
import React, { useState, useEffect, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Image from "next/image";
import { images } from "@/utils/homepage/constantsHomepage";
import ProductCarouselItem from "@/components/homepage/ProductCarouselItem";
import { productsPeri } from "@/utils/homepage/constantsFeaturedPeripherals";
import { imagePaths } from "@/utils/homepage/constantsBrand";
import BrandCard from "@/components/homepage/BrandCard";
import { products } from "@/utils/homepage/constantsProductGrid";
import ProductGrid from "@/components/homepage/ProductGrid";
import { FGames } from "@/utils/homepage/constantsGameCarousel";
import GameCarousel from "@/components/homepage/GameCarousel";
import GameCarouselHotpicks from "@/components/homepage/GameCarouselHotpicks";
import CategoryCatalog from "@/components/homepage/CategoryCatalog";
import NewArrivals from "@/components/homepage/NewArrivals";
import AssuranceSection from "@/components/homepage/AssuranceSection";
import FeaturedCarousel from "@/components/homepage/FeaturedCarousel";

const Page = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);
  const videoTimeoutRef = useRef(null);

  const handleMouseEnter = (id) => {
    setHoveredItem(id);
    videoTimeoutRef.current = setTimeout(() => {
      setPlayVideo(true);
    }, 3000);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setPlayVideo(false);
    clearTimeout(videoTimeoutRef.current);
  };

  useEffect(() => {
    return () => clearTimeout(videoTimeoutRef.current);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Highlight Carousel */}
      <AliceCarousel
        autoPlay
        autoPlayInterval={3000}
        infinite
        renderPrevButton={({ isDisabled }) => (
          <button
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-blue-900 text-white rounded-md p-3 shadow-md hover:bg-blue-700 ${
              isDisabled ? "opacity-50" : ""
            }`}
          >
            ◀
          </button>
        )}
        renderNextButton={({ isDisabled }) => (
          <button
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-blue-900 text-white rounded-md p-3 shadow-md hover:bg-blue-700 ${
              isDisabled ? "opacity-50" : ""
            }`}
          >
            ▶
          </button>
        )}
      >
        {images.map((image) => (
          <div
            key={image.id}
            className="h-full relative"
            onMouseEnter={() => handleMouseEnter(image.id)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Image */}
            {!(hoveredItem === image.id && playVideo) && (
              <div className="h-[70vh] w-full relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}

            {/* Video */}
            {hoveredItem === image.id && playVideo && (
              <video
                className="absolute inset-0 h-[70vh] w-full object-cover"
                src="/homepage/HighlightCarouselVideo3.webm"
                autoPlay
                loop
                muted
                preload="auto"
              />
            )}
          </div>
        ))}
      </AliceCarousel>

      <style jsx global>{`
        .alice-carousel__dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
        }

        .alice-carousel__dots-item {
          background: rgba(0, 0, 0, 0.5);
          border: none;
        }

        .alice-carousel__dots-item.__active {
          background: #fff;
        }
      `}</style>

      {/* Assurance Section */}
      <div>
        <AssuranceSection></AssuranceSection>
      </div>

      {/* New Arrivals Section */}
      <div className="relative mt-10 flex justify-center">
        {/* Background Container */}
        <div className="absolute top-0 w-[60%] h-[200px] bg-[#FAF0CA] left-1/2 -translate-x-1/2 z-0 rounded-2xl"></div>
        <NewArrivals></NewArrivals>
      </div>

      {/* Category Catalog */}
      <div className="bg-[#FAF9F6]">
        {/* <CategoryCatalogExpi games={FGames}></CategoryCatalogExpi> */}
        <CategoryCatalog></CategoryCatalog>
      </div>

      {/* Featured Peripherals Carousel */}
      <FeaturedCarousel category="Peripherals"></FeaturedCarousel>

      {/* Peripherals Product Grid */}
      <div className="container mx-auto justify-center flex mb-32">
        <ProductGrid category="Peripherals" />
      </div>

      <div className="bg-[#FAF9F6]">
        {/* Hot Picks Section */}
        <div className="relative mt-10 flex justify-center">
          {/* Yellow Background Container */}
          <div className="absolute top-0 w-[60%] h-[250px] bg-[#F4D35E] left-1/2 -translate-x-1/2 z-0 rounded-2xl"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-10 py-8">
            <GameCarouselHotpicks games={FGames} />
          </div>
        </div>

        {/* Featured Games Carousel */}
        <FeaturedCarousel category="Games" />

        {/* Games Product Grid */}
        <div className="container mx-auto justify-center flex mb-32">
          <ProductGrid category="Games" />
        </div>
      </div>

      {/* Featured Collectibles Carousel */}
      <FeaturedCarousel category="Collectibles" />

      {/* Collectibles Product Grid */}
      <div className="container mx-auto justify-center flex mb-20">
        <ProductGrid category="Collectibles" />
      </div>

      {/* Brand Feature */}
      <div className="bg-[#FAF9F6]">
        <div className="container mx-auto px-48 py-10 pb-12">
          {/* 3x2 Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {imagePaths.map((imagePath, index) => (
              <BrandCard
                key={index}
                imagePath={imagePath}
                altText={`Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
