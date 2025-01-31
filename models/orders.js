const OrderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  orderDate: { type: Date, default: Date.now },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Store price at the time of purchase
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  address: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentMode: {
    type: String,
    enum: ["Cash on Delivery", "Credit Card", "E-Wallet", "Bank Transfer"],
    required: true,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
