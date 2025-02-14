import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../lib/db"; // Adjust path if needed
import Product from "../../../../../../models/product";
import mongoose from "mongoose";0

// ✅ Use named export for GET request
export async function GET(req, { params }) {
  await connectToDatabase();
  console.log("🔗 Connected to Database");

  try {
    const { id } = params; // Use params for dynamic routes
    console.log(`🔍 Fetching product with ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid product ID");
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(id);
    console.log(`✅ Product found: ${product}`);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
