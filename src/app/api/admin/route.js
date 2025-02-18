import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/db";
import Order from "../../../../models/order";

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find({});
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { orderId, status } = await req.json();
    await connectToDatabase();
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update order" }, { status: 500 });
  }
}
