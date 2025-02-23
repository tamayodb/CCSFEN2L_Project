import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
  quantity: { type: Number, required: true },
  isRated: { type: Boolean, default: false } // ✅ Ensure isRated is stored
});

const orderSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    address: { type: String, required: true },
    order_date: { type: String, required: true },
    paymentMode: { type: String, required: true },
    products: [ProductSchema], // ✅ Store products as objects with isRated
    status: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  },
  { collection: "Orders" }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;