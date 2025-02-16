import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/db";
import Product from "../../../../../models/product";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const { id } = params; // No need to `await` params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    await connectToDatabase();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // ✅ Fix: Map `productName` to `itemName`
    return NextResponse.json({ 
      id: product._id,
      itemName: product.productName, // ✅ Fix here
      price: product.price,
      image: product.photo?.[0] || "/placeholder.jpg", // Use first image, fallback if missing
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Error fetching product", error: error.message }, { status: 500 });
  }
}
