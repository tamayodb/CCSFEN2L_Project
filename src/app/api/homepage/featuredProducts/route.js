import connectToDatabase from "../../../../../lib/db";
import { NextResponse } from "next/server";
import Products from "../../../../../models/product";

export async function GET(req) {
  try {
    await connectToDatabase();
    console.log("Database connected successfully");

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { message: "Category is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching featured products for category: ${category}`);

    const categoryProducts = await Products.find({
      $or: [
        { "tag.type": category },
        { "tag.category": category },
        { "tag.category": { $in: [category] } },
      ],
    })
      .lean(); // Optimize query

    console.log(`Found ${categoryProducts.length} products for ${category}`);

    return NextResponse.json({ products: categoryProducts });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
}
