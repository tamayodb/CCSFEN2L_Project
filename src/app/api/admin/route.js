import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/db"; // Your existing connection utility
import Order from "../admin/order"; // Your existing Order model

export async function GET() {
  try {
    await connectToDatabase(); // Use your existing connection function

    // Fetch all orders and populate product details
    const orders = await Order.find({})
      .populate("product_id", "productName price photo") // Populate product details
      .lean();

    // Map orders to include items with product details
    const updatedOrders = orders.map((order) => {
      const items = order.product_id.map((product, index) => ({
        name: product?.productName || "Unknown Product",
        quantity: order.quantity[index],
        price: product?.price || 0,
        photo: product?.photo?.[0] || "", // Use the first photo if available
      }));

      return { ...order, items }; // Attach items array to each order
    });

    return NextResponse.json(updatedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}