import React, { useState, useRef, useEffect } from "react";

const GameCarousel = ({ games }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  // Function to scroll to the next item
  const nextSlide = () => {
    if (carouselRef.current) {
      const maxScrollLeft = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

      // Check if at the end, reset to the beginning
      if (scrollPosition >= maxScrollLeft) {
        carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        setScrollPosition(0);
      } else {
        const newScrollPosition = Math.min(scrollPosition + carouselRef.current.clientWidth, maxScrollLeft);
        carouselRef.current.scrollTo({ left: newScrollPosition, behavior: "smooth" });
        setScrollPosition(newScrollPosition);
      }
    }
  };

  // Function to scroll to the previous item
  const prevSlide = () => {
    if (carouselRef.current) {
      // Check if at the beginning, reset to the end
      if (scrollPosition <= 0) {
        const maxScrollLeft = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        carouselRef.current.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
        setScrollPosition(maxScrollLeft);
      } else {
        const newScrollPosition = Math.max(scrollPosition - carouselRef.current.clientWidth, 0);
        carouselRef.current.scrollTo({ left: newScrollPosition, behavior: "smooth" });
        setScrollPosition(newScrollPosition);
      }
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Adjust the interval time (in milliseconds) as needed

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [scrollPosition]);

  return (
    <div className="relative flex justify-center py-6">
      <div className="relative flex items-center overflow-hidden w-full max-w-6xl">
        {/* Carousel Wrapper */}
        <div
          ref={carouselRef}
          className="flex space-x-0 transition-all duration-300 overflow-x-hidden"
        >
          {games.map((game, index) => (
            <div key={index} className="relative group w-full flex-shrink-0">
              {/* Game Cover Image (Landscape) */}
              <div className="w-full h-[500px]">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Game Information (Right Side - Revealed on Hover) */}
              <div className="absolute inset-0 bg-black bg-opacity-60 w-0 group-hover:w-1/4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-start px-6">
                <div className="text-white space-y-4 text-left pl-4">
                  <h2 className="text-2xl font-bold">{game.name}</h2>
                  <p className="text-lg font-semibold">{game.genre}</p>
                  <p className="text-sm">Release: 2024</p> {/* Replace with dynamic release date */}
                  <p className="text-sm mt-2">
                    {game.description.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <div
          onClick={prevSlide}
          className="absolute bottom-4 right-20 bg-blue-900 text-white rounded-md p-3 shadow-md hover:bg-blue-700"
        >
          <span className="text-xl">{"<"}</span>
        </div>

        {/* Next Button */}
        <div
          onClick={nextSlide}
          className="absolute bottom-4 right-4 bg-blue-900 text-white rounded-md p-3 shadow-md hover:bg-blue-700"
        >
          <span className="text-xl">{">"}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCarousel;
