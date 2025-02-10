import { useState, useEffect } from "react";

const DeliveryAddress = () => {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      try {
        const res = await fetch("/api/payment/deliveryaddress", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json(); // Parse response JSON
        console.log("Fetched Data:", data);

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch address");
        }

        setAddress(data.address); // Ensure `address` is not an object
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAddress();
  }, []);

  return (
    <div>
      <h2>Delivery Address</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {address ? (
        <p>{typeof address === "object" ? JSON.stringify(address) : address}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DeliveryAddress;
