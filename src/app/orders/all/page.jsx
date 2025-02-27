"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const tabs = ['All', 'To Approve', 'To Ship', 'To Receive', 'Completed', 'Cancelled'];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [ratingOrder, setRatingOrder] = useState(null);
  const [ratingProduct, setRatingProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRatingMessage, setShowRatingMessage] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [ratedProducts, setRatedProducts] = useState({});
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`/api/orders?userId=${userId}`);
      const data = await response.json();

      console.log("Fetched orders:", data); // Debugging

      setOrders(Array.isArray(data) ? data : []);

      // Extract rated products from API response
      const ratedMap = {};
      data.forEach(order => {
        order.products.forEach((product, index) => {
          if (order.isRated[index]) {
            ratedMap[product._id] = true;
          }
        });
      });

      setRatedProducts(ratedMap); // Update state
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Call it when the component mounts
  }, []);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const openProductDetails = (productId) => {
    if (productId) {
      router.push(`/peripherals/${productId}`);
    } else {
      console.error('Product ID is undefined');
    }
  };

  const startRating = (orderId, productId) => {
    setRatingOrder(orderId);
    setRatingProduct(productId);
    setRating(0);
  };

  const submitRating = async () => {
    if (rating === 0) {
      setRatingMessage('Please select a rating before submitting.');
      setIsErrorMessage(true);
      setShowRatingMessage(true);
      setTimeout(() => setShowRatingMessage(false), 1000); // Show message for 1 second
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: ratingProduct,
          user_id: userId,
          rating,
          comment: '', // Add a comment field if needed
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Failed to submit rating');
      }

      console.log(`Rating for product ${ratingProduct} in order ${ratingOrder}: ${rating}`);
      setRatedProducts((prev) => ({ ...prev, [ratingProduct]: true }));
      setRatingOrder(null);
      setRatingProduct(null);
      setRating(0);
      setRatingMessage('Rating submitted successfully!');
      setIsErrorMessage(false);
      setShowRatingMessage(true);
      setTimeout(() => setShowRatingMessage(false), 1000); // Show message for 1 second

      // Wait for MongoDB update
      setTimeout(async () => {
        await fetchOrders(); // Now it should have the updated isRated value
      }, 1500);
    } catch (error) {
      console.error('Failed to submit rating:', error.message);
    }
  };

  const confirmCancelOrder = (orderId) => {
    setCancelOrderId(orderId);
    setShowCancelConfirmation(true);
  };

  const cancelOrder = async () => {
    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: cancelOrderId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Failed to cancel order');
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === cancelOrderId ? { ...order, status: 'Cancelled' } : order
        )
      );
      setShowCancelConfirmation(false);
      setCancelOrderId(null);
    } catch (error) {
      console.error('Failed to cancel order:', error.message);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = order.products.some(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl text-gray-600">Loading Orders...</p>
    </div>
  );
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="flex flex-wrap mb-4">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`flex-grow px-4 py-2 mr-2 mb-2 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by Product Name"
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-6xl text-gray-400">X</div>
          <div className="text-xl text-gray-600 mt-4">No Orders Available</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order._id} className="border rounded-lg p-4 bg-white shadow">
              <h2 className="text-lg font-bold mb-2" style={{ color: '#155897' }}>Order ID: {order._id}</h2>
              <div className="text-sm text-gray-600 mb-2">
                <p>Order Date: {order.order_date}</p>
                <p>Status: {order.status}</p>
                <p>Total: ₱{order.totalAmount}</p>
                <p>Address: {order.address}</p>
                <p>Payment Mode: {order.paymentMode}</p>
              </div>
              <div className="mb-4">
                {order.products.slice(0, expandedOrders[order._id] ? order.products.length : 1).map((product, index) => (
                  <div key={index} className="flex items-center mb-4">
                    {product.photo && product.photo.length > 0 ? (
                      <Image
                        src={product.photo[0]}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-cover rounded mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded mr-4">
                        <span className="text-gray-600 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-md font-bold cursor-pointer" onClick={() => openProductDetails(order.product_id[index])}>{product.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {order.quantity[index]}</p>
                      <p className="text-sm text-gray-600">Price: ₱{product.price}</p>
                    </div>
                    {order.status === 'Completed' && (
                      <button
                        className={`px-4 py-2 rounded ${order.isRated[index] ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}
                        disabled={order.isRated[index]}
                        onClick={() => !order.isRated[index] && startRating(order._id, order.product_id[index])}
                      >
                        {order.isRated[index] ? 'Already Rated' : 'Rate'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-2 space-x-4">
                {order.products.length > 1 && (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => toggleExpandOrder(order._id)}
                  >
                    {expandedOrders[order._id] ? 'View Less' : 'View More'}
                  </button>
                )}
                {(order.status === 'To Ship' || order.status === 'To Approve') && (
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => confirmCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {ratingOrder && ratingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Rate Product</h3>
            <div className="flex mb-4 space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`cursor-pointer text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => setRatingOrder(null)}>Cancel</button>
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={submitRating}>Submit</button>
            </div>
          </div>
        </div>
      )}
      {showRatingMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-4 rounded-lg shadow-lg ${isErrorMessage ? 'bg-red-500' : 'bg-green-500'}`}>
            <p className="text-lg font-bold text-white">{ratingMessage}</p>
          </div>
        </div>
      )}
      {showCancelConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Confirm Cancellation</h3>
            <p className="mb-4">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setShowCancelConfirmation(false)}>No</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={cancelOrder}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
