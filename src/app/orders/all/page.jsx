"use client";

import React, { useEffect, useState } from 'react';

const tabs = ['All', 'To Ship', 'To Receive', 'Completed', 'Cancelled'];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        console.log('Fetched orders:', data);
        setOrders(data);
      } catch (error) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const submitRating = () => {
    console.log(`Rating: ${rating}, Review: ${review}`);
    setIsRating(false);
    setRating(0);
    setReview('');
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Failed to cancel order');
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
    } catch (error) {
      console.error('Failed to cancel order:', error.message);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = order.products.some(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      {selectedProduct ? (
        <div>
          <div className="flex justify-start mb-4">
            <button onClick={() => setSelectedProduct(null)} className="px-4 py-2 bg-blue-500 text-white rounded">&lt; Back</button>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img src={selectedProduct.picture} alt={selectedProduct.name} className="w-full h-auto mb-4" />
            </div>
            <div className="md:w-1/2 md:pl-4">
              <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
              <p className="text-xl text-gray-700 mb-4">₱{selectedProduct.price}</p>
              <p className="mb-4"><strong>Description:</strong> {selectedProduct.description && selectedProduct.description.length > 0 ? selectedProduct.description[0] : 'No description available'}</p>
              <div className="flex mb-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded mr-2">Add to Cart</button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded mr-2">Buy Again</button>
                {selectedProduct && filteredOrders.find(order => order.products.some(product => product.name === selectedProduct.name) && order.status === 'Completed') && (
                  <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsRating(true)}>Rate Product</button>
                )}
              </div>
              {isRating && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                  <h3 className="text-lg font-bold mb-2">Rate {selectedProduct.name}</h3>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Write your review here..."
                    value={review}
                    onChange={e => setReview(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-red-500 text-white rounded mr-2" onClick={() => setIsRating(false)}>Cancel</button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={submitRating}>Submit</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map(order => (
              <div key={order._id} className="border rounded-lg p-4 bg-white shadow">
                <h2 className="text-lg font-bold mb-2">Order ID: {order._id}</h2>
                <div className="text-sm text-gray-600 mb-2">
                  <p>Order Date: {order.order_date}</p>
                  <p>Status: {order.status}</p>
                  <p>Total: ₱{order.totalAmount}</p>
                  <p>Address: {order.address}</p>
                  <p>Payment Mode: {order.paymentMode}</p>
                </div>
                <div className="flex items-center mb-4">
                  <img src={order.products[0].picture} alt={order.products[0].name} className="w-12 h-12 object-cover rounded mr-4" />
                  <div>
                    <h3 className="text-md font-bold cursor-pointer" onClick={() => openProductDetails(order.products[0])}>{order.products[0].name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {order.products[0].quantity}</p>
                    <p className="text-sm text-gray-600">Price: ₱{order.products[0].price}</p>
                  </div>
                </div>
                {expandedOrders[order._id] && order.products.slice(1).map((product, index) => (
                  <div key={index} className="flex items-center mb-4">
                    <img src={product.picture} alt={product.name} className="w-12 h-12 object-cover rounded mr-4" />
                    <div>
                      <h3 className="text-md font-bold cursor-pointer" onClick={() => openProductDetails(product)}>{product.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ₱{product.price}</p>
                    </div>
                  </div>
                ))}
                {order.products.length > 1 && (
                  <div className="flex justify-center mt-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      {expandedOrders[order._id] ? 'View Less' : 'View More'}
                    </button>
                    {order.status === 'To Ship' && (
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                )}
                {order.status === 'To Ship' && order.products.length <= 1 && (
                  <div className="flex justify-center mt-2">
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
