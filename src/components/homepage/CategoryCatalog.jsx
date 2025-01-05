const CategoryCatalog = () => {

    const categories = [
      {
        name: "Games",
        image: "/homepage/games_samplepic2.webp",
        description: "Explore a world of entertainment and adventure.",
      },
      {
        name: "Accessories",
        image: "/homepage/accessories_samplepic.webp",
        description: "Perfect accessories to complement your lifestyle.",
      },
      {
        name: "Peripherals",
        image: "/homepage/peripherals_samplepic.webp",
        description: "Enhance your setup with the best peripherals.",
      },
      {
        name: "Collectibles",
        image: "/homepage/cards_samplepic.jpg",
        description: "Collect and display unique items.",
      },
      {
        name: "Plush",
        image: "/homepage/plush_samplepic2.jpeg",
        description: "Soft and cuddly plush toys for everyone.",
      },
      {
        name: "Action Figures",
        image: "/homepage/actionfig_samplepic.webp",
        description: "Discover detailed action figures for all ages.",
      },
      {
        name: "Amiibo",
        image: "/homepage/amiibo_samplepic2.webp",
        description: "Expand your gaming experience with Amiibo.",
      },
    ];
  
    return (
      <div className="pt-16">
        <div className="max-w-6xl mx-auto">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{
              gridAutoRows: "auto", // Ensures dynamic height based on content
            }}
          >
            {categories.map((category, index) => (
              <div
                key={index}
                className={`relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${
                  index % 2 === 0 ? "row-span-2" : "row-span-1"
                }`}
                style={{
                  height: category.name === "Plush" || category.name === "Amiibo" ? "207px" : "auto", // Reduce height for Amiibo and Plush
                }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300`}
                />
                {/* Static title */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                  <span className="text-white text-lg font-semibold">
                    {category.name}
                  </span>
                </div>
                {/* Hover content */}
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                  <span className="text-white text-xl font-semibold mb-2">
                    {category.name}
                  </span>
                  <p className="text-white text-sm text-center">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default CategoryCatalog;
  