import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 }, // Default to 1 if not specified
  totalPrice: { type: Number, required: true },
}, { collection: "Cart" });

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
