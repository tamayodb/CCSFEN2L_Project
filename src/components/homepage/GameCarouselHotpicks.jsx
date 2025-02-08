"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const GameCarouselHotpicks = () => {
  const carouselRef = useRef(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("/api/homepage/hotPicksGame");
        console.log("🎲 Fetched Games:", response.data); // Debugging API response

        const formattedGames = response.data.map((game) => ({
          ...game,
          photo:
            Array.isArray(game.photo) && game.photo.length > 0
              ? game.photo[0]
              : "/fallback-image.jpg", // Ensure image exists
        }));

        setGames(formattedGames);
      } catch (error) {
        console.error("❌ Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 mb-16">
      <h2 className="text-3xl font-bold text-black tracking-widest text-center pb-4 pt-2">
        HOT PICKS
      </h2>
      <div className="relative flex items-center">
        <button
          className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
          onClick={scrollLeft}
        >
          <ChevronLeftIcon size={24} />
        </button>
        <div
          ref={carouselRef}
          className="flex overflow-x-scroll scrollbar-hide mx-12 space-x-4"
        >
          {games.map((game) => (
            <div key={game._id} className="flex-shrink-0 w-48">
              <Image
                src={game.photo}
                alt="Game Cover"
                width={400} // Increase width
                height={600} // Increase height
                quality={100} // Max quality
                className="w-full h-[320px] object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
        <button
          className="absolute right-0 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
          onClick={scrollRight}
        >
          <ChevronRightIcon size={24} />
        </button>
      </div>
    </div>
  );
};

export default GameCarouselHotpicks;
