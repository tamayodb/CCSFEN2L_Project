import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/db"; // Your existing connection utility
import Order from "../admin/order"; // Order model
import Customer from "../../../../models/accounts"; // Correct User model

export async function GET() {
  try {
    await connectToDatabase();

    const orders = await Order.find({})
      .populate({
        path: "product_id",
        select: "productName price photo",
        model: "Products",
      })
      .populate({
        path: "user_id", // Populate user details
        select: "username contact_num address",
        model: "Customer", // Ensure this matches your actual Mongoose model name
      })
      .lean();

    // Map orders to ensure correct data formatting
    const updatedOrders = orders.map((order) => {
      const items =
        order.product_id?.map((product, index) => ({
          name: product?.productName || "Unknown Product",
          quantity: order.quantity?.[index] || 1,
          price: product?.price || 0,
          photo: product?.photo?.[0] || "",
        })) || [];

      return {
        ...order,
        items,
        customerName: order.user_id?.username || "Unknown User", // Use username from User collection
        contactNumber: order.user_id?.contact_num || "No Contact", // Use contact number
        address: order.user_id?.address || {}, // Full address object
      };
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
