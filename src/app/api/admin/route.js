import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/db";
import Order from "../../../../models/order";
import Product from "../../../../models/product";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all orders
    const orders = await Order.find({}).lean();

    // Fetch product details for each order
    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        const productDetails = await Promise.all(
          order.product_id.map(async (productId, index) => {
            try {
              const product = await Product.findById(
                mongoose.Types.ObjectId(productId)  // Ensure ObjectId conversion
              ).lean();
              return product
                ? { name: product.productName, quantity: order.quantity[index] }
                : { name: "Unknown Product", quantity: order.quantity[index] };
            } catch (error) {
              console.error("Error fetching product:", error);
              return { name: "Unknown Product", quantity: order.quantity[index] };
            }
          })
        );

        return { ...order, items: productDetails };
      })
    );

    return NextResponse.json(updatedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
