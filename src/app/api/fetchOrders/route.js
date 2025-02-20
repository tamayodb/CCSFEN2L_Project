import jwt from 'jsonwebtoken';
import connectToDatabase from "../../../../../lib/db.js";
import Order from "../../../../../models/order.js";
import Product from "../../../../../models/product.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user_id = decoded.userId;
    const userIdString = user_id.toString();

    const recentOrders = await Order.find({ user_id: userIdString })
      .sort({ order_date: -1 })
      .limit(6)
      .lean();

    if (!recentOrders.length) {
      return NextResponse.json([], { status: 200 });
    }

    const productIds = recentOrders.flatMap(order => order.product_id);

    const uniqueProductIds = [...new Set(productIds)];

    const products = await Product.find({ _id: { $in: uniqueProductIds } })
      .select("productName price photo")
      .lean();

    const orderedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.productName,
      image: product.photo?.[0] || "",
      price: product.price,
    }));

    return NextResponse.json(orderedProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching recent ordered products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
