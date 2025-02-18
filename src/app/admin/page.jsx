"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/admin");
      setOrders(response.data);
    } catch (error) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  const statuses = [
    "To Approve",
    "To Ship",
    "To Receive",
    "Completed",
    "Cancelled",
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      {statuses.map((status) => (
        <div key={status} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{status}</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">User ID</th>
                  <th className="border p-2">Order Date</th>
                  <th className="border p-2">Items</th>
                  <th className="border p-2">Total Amount</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter((order) => order.status === status)
                  .map((order) => (
                    <tr key={order._id} className="border">
                      <td className="border p-2">{order._id}</td>
                      <td className="border p-2">{order.user_id}</td>
                      <td className="border p-2">{order.order_date}</td>
                      <td className="border p-2">
                        <ul>
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => (
                              <li key={index}>
                                {item.name} - Qty: {item.quantity}
                              </li>
                            ))
                          ) : (
                            <p>No items found</p>
                          )}
                        </ul>
                      </td>
                      <td className="border p-2">₱{order.totalAmount}</td>
                      <td className="border p-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className="p-1 border"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {orders.filter((order) => order.status === status).length === 0 && (
              <p className="text-gray-500 text-center p-4">
                No orders in this category.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderManagement;