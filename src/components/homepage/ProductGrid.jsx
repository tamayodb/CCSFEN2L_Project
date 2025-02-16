import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./CardWithDetails";

const ProductGrid = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      try {
        const response = await axios.get(`/api/homepage/gridProduct?category=${category}`);
        console.log(`Fetched products for ${category}:`, response.data);

        const categoryProducts = response.data?.products || [];

        setProducts(
          categoryProducts.slice(0, 10).map((product) => ({
            ...product,
            photo:
              Array.isArray(product.photo) && product.photo.length > 0
                ? product.photo[0]
                : "/fallback-image.jpg",
          }))
        );
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (products.length === 0) return <p>No products found for {category}.</p>;

  return (
    <div className="grid grid-cols-5 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          name={product.productName}
          price={product.price}
          image={product.photo}
          category={category}
          id={product._id}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
