import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderID: { type: String, required: true },
  userID: { type: String, required: true },
  orderDate: { type: Date, required: true },
  quantity: { type: [Number], required: true },
  status: { type: String, required: true },
  product_id: { type: [String], required: true },
  address: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentMode: { type: String, required: true },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
