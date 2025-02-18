// /api/payment/paymentgateway/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../../../lib/db";
import Order from "../../../../../models/order";

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { user_id, product_id, quantity, address, totalAmount, paymentMode } = body;

    if (paymentMode !== "COD") {
      return NextResponse.json({ error: "Only Cash on Delivery is supported." }, { status: 400 });
    }
    console.log("this works!!!!!!!!!!!");

    const newOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      user_id,
      product_id,
      quantity,
      order_date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      totalAmount,
      address,
      paymentMode,
      status: "To Approve",
    });

    await newOrder.save();
    return NextResponse.json({ message: "Order placed successfully", order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
