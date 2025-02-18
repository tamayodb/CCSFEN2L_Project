import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/db"; // Your existing connection utility
import Order from "../admin/order"; // Your existing Order model

export async function GET() {
  try {
    await connectToDatabase(); // Use your existing connection function

    // Fetch all orders and populate product details
    const orders = await Order.find({})
      .populate({
        path: "product_id",
        select: "productName price photo",
        model: "Products", // Ensure correct model name
      })
      .lean();

    // Map orders to include items with product details
    const updatedOrders = orders.map((order) => {
      const items = order.product_id?.map((product, index) => ({
        name: product?.productName || "Unknown Product",
        quantity: order.quantity?.[index] || 1, // Ensure quantity exists
        price: product?.price || 0,
        photo: product?.photo?.[0] || "",
      })) || [];
    
      return { ...order, items };
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
