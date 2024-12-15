"use client";
import React, { useState, useEffect, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import AssuranceElement from "@/components/homepage/AssuranceElement";
import Image from "next/image";
import { images } from "@/utils/homepage/constantsHomepage";
import { hot_picks } from "@/utils/homepage/constantsHotpicks";
import Card from "@/components/homepage/Card";
import CardWithDetails from "@/components/homepage/CardWithDetails";

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
    <div className="relative h-[300vh]">
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
                  style={{ objectFit: 'cover' }} 
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
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-3">
          <div className="relative pr-6 md:pr-8">
            <AssuranceElement
              src="/homepage/AssuranceLogo1.png"
              title="Your Most Trusted Store"
              description="100% All Brand New & Original Shop with Confidence."
            />
            <div className="absolute inset-y-0 right-0 w-px bg-gray-400 hidden md:block"></div>
          </div>
          <div className="relative pr-6 md:pr-8">
            <AssuranceElement
              src="/homepage/AssuranceLogo2.png"
              title="Fast Shipping Nationwide"
              description="Ships in 24 hours! Express and Same-Day Delivery within Metro Manila!"
            />
            <div className="absolute inset-y-0 right-0 w-px bg-gray-400 hidden md:block"></div>
          </div>
          <div className="relative pr-6 md:pr-8">
            <AssuranceElement
              src="/homepage/AssuranceLogo3.png"
              title="Save on Loyalty Rewards"
              description="Sign in to start earning Loyalty Rewards Points!"
            />
            <div className="absolute inset-y-0 right-0 w-px bg-gray-400 hidden md:block"></div>
          </div>
          <div>
            <AssuranceElement
              src="/homepage/AssuranceLogo4.png"
              title="100% Safe and Secure"
              description="All Transactions are Fully Encrypted with State of the Art Technology!"
            />
          </div>
        </div>
      </div>

      {/* Hot Picks Section */}
      <div className="relative mt-10 flex justify-center">
        {/* Yellow Background Container */}
        <div className="absolute top-0 w-[60%] h-[220px] bg-[#F4D35E] left-1/2 -translate-x-1/2 z-0 rounded-2xl"></div>

        {/* Content Section */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6 text-black tracking-widest text-left">
            HOT PICKS
          </h2>
          <div className="flex space-x-4 overflow-x-auto justify-center items-center gap-9">
            <Card key={1} image="/homepage/hotpicks_game1.jpg" />
            <Card
              key={2}
              image="/homepage/hotpicks_game1.jpg"
            />
            <Card key={3} image="/homepage/hotpicks_game1.jpg" />
            <Card key={4} image="/homepage/hotpicks_game1.jpg" />
            <Card
              key={5}
              title="Cyberpunk 2077"
              image="/homepage/hotpicks_game1.jpg"
            />
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="relative mt-10 flex justify-center">
        {/* Yellow Background Container */}
        <div className="absolute top-0 w-[60%] h-[220px] bg-[#FAF0CA] left-1/2 -translate-x-1/2 z-0 rounded-2xl"></div>

        {/* Content Section */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6 text-black tracking-widest text-left">
            NEW ARRIVALS
          </h2>
          <div className="flex space-x-4 overflow-x-auto justify-center items-center gap-9">
            <CardWithDetails key={1} name="Mouse Corsair" price="123.00" image="/homepage/product_sample.webp"/>
            <CardWithDetails key={2} name="Mouse Corsair" price="123.00" image="/homepage/product_sample.webp"/>
            <CardWithDetails key={3} name="Mouse Corsair" price="123.00" image="/homepage/product_sample.webp"/>
            <CardWithDetails key={4} name="Mouse Corsair" price="123.00" image="/homepage/product_sample.webp"/>
            <CardWithDetails key={5} name="Mouse Corsair" price="123.00" image="/homepage/product_sample.webp"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
