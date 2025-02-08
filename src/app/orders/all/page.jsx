"use client";

import { useEffect, useState } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        console.log('Fetched orders:', data); // Add logging
        setOrders(data);
      } catch (error) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            <p>Order ID: {order._id}</p>
            <p>Address: {order.address}</p>
            <p>Order Date: {order.order_date}</p>
            <p>Payment Mode: {order.paymentMode}</p>
            <p>Status: {order.status}</p>
            <p>Total Amount: {order.totalAmount}</p>
            <p>User ID: {order.user_id}</p>
            <p>Products:</p>
            <ul>
              {order.products.map((product, index) => (
                <li key={index}>
                  <p>Product Name: {product.name}</p> {/* Ensure this matches the API response */}
                  <img src={product.picture} alt={product.name} className="w-full h-48 object-cover mb-4" />
                  <p>Quantity: {product.quantity}</p> {/* Display the quantity */}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;
