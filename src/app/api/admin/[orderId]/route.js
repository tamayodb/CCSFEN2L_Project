import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/db";
import Order from "../order"; // Ensure correct path to Order model
import Product from "../product"; // Import Product model

// Handle PUT request for updating order status
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    
    const { orderId } = params;
    const { status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Increment product quantity if order is cancelled
    if (status === "Cancelled") {
      for (let i = 0; i < updatedOrder.product_id.length; i++) {
        const productId = updatedOrder.product_id[i];
        const quantity = updatedOrder.quantity[i];
        await Product.findByIdAndUpdate(productId, { $inc: { quantity } });
      }
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ message: "Failed to update order status" }, { status: 500 });
  }
}
