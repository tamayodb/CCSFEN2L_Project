import mongoose from "mongoose";

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  address: { type: String, required: true },
  isRated: { type: [Boolean], default: false },
  order_date: { type: String, required: true },
  paymentMode: { type: String, required: true },
  product_id: [{ type: String, required: true }],
  quantity: [{ type: Number, required: true }],
  status: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  user_id: { type: String, required: true }
}, { collection: 'Orders' });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;