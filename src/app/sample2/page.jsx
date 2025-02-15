"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function Payment() {
  const searchParams = useSearchParams();
  const cartData = searchParams.get("cart");

  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartData) {
      try {
        const parsedCart = JSON.parse(decodeURIComponent(cartData));
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }
  }, [cartData]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (cartItems.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productRequests = cartItems.map((item) =>
          axios.get(`/api/payment/${item.id}`)
        );

        const productResponses = await Promise.all(productRequests);
        const fetchedProducts = productResponses.map((res) => res.data);

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [cartItems]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Payment Page</h1>

      {loading ? (
        <p className="text-gray-500">Loading product details...</p>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-2">Decoded Cart JSON:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(cartItems, null, 2)}
          </pre>

          {products.length > 0 ? (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Product Details:</h2>
              <ul className="list-disc pl-5">
                {products.map((product, index) => (
                  <li key={product._id} className="text-gray-700">
                    <strong>Name:</strong> {product.productName} | 
                    <strong> Price:</strong> ${product.price} | 
                    <strong> Quantity:</strong> {cartItems[index]?.qty}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-red-500 mt-4">No product details found.</p>
          )}
        </>
      )}
    </div>
  );
}
