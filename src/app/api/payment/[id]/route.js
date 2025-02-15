import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/db";
import Product from "../../../../../models/product";
import mongoose from "mongoose"; // Ensure ObjectId is handled correctly

export async function GET(req, { params }) {
  try {
    // Ensure params is awaited
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    await connectToDatabase();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Error fetching product", error: error.message }, { status: 500 });
  }
}
