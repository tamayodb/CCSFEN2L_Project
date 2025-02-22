import connectToDatabase from "../../../../../lib/db.js";
import Cart from "../../../../../models/cart.js";
import Product from "../../../../../models/product.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await connectToDatabase();

    // Extract token from headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const user_id = decoded.userId;
    console.log("Decoded User ID:", user_id);

    const userIdObjectId = new mongoose.Types.ObjectId(user_id);

    const cartItems = await Cart.find({ user_id: userIdObjectId }).lean();

    console.log("Fetched Cart Items:", cartItems);

    if (cartItems.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const productIds = cartItems.map((item) => item.product_id);
    const products = await Product.find({ _id: { $in: productIds } })
      .select("productName price photo")
      .lean();

    const formattedCart = cartItems
      .map((cartItem) => {
        const product = products.find(
          (prod) => prod._id.toString() === cartItem.product_id.toString()
        );
        return product
          ? {
              id: product._id.toString(),
              name: product.productName,
              image: product.photo?.[0] || "",
              price: product.price,
              quantity: cartItem.quantity,
            }
          : null;
      })
      .filter((item) => item !== null);

    console.log("Formatted Cart Response:", formattedCart);

    return NextResponse.json(formattedCart, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
