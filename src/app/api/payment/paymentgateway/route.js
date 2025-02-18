// /api/payment/paymentgateway/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../../../lib/db";
import Order from "../../../../../models/order";
import jwt from "jsonwebtoken";  // For JWT decryption

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { product_id, quantity, address, totalAmount, paymentMode } = body;

    // Decrypt JWT token to get user_id
    const token = req.headers.get('Authorization')?.split(' ')[1];  // Get the token from the Authorization header
    if (!token) {
      return NextResponse.json({ error: "No token provided." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);  // Replace with your JWT_SECRET
    } catch (err) {
      return NextResponse.json({ error: "Invalid token." }, { status: 401 });
    }
    const userIdFromToken = decoded.id;  // Assuming JWT contains user id under 'id'

    // Ensure only COD is supported
    if (paymentMode !== "COD") {
      return NextResponse.json({ error: "Only Cash on Delivery is supported." }, { status: 400 });
    }

    // Prepare the order data
    const newOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      user_id: userIdFromToken,  // Using user_id from token
      product_id,
      quantity,
      order_date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      totalAmount,
      address,
      paymentMode,
      status: "To Approve",
    });

    // Save order to the database
    await newOrder.save();
    return NextResponse.json({ message: "Order placed successfully", order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ error: "Something went wrong", details: error.message }, { status: 500 });
  }
}
