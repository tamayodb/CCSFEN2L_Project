import connectToDatabase from "../../../../../lib/db";
import { NextResponse } from "next/server";
import Products from "../../../../../models/product";

export async function GET(req) {
  try {
    await connectToDatabase();
    console.log("Database connected successfully");

    // Extract category from request URL
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { message: "Category is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching products for category: ${category}`);

    const categoryProducts = await Products.find({
      $or: [
        { "tag.type": category },
        { "tag.category": category },
        { "tag.category": { $in: [category] } },
      ],
    })
      .sort({ date: -1 })
      .limit(10);

    console.log(`Found ${categoryProducts.length} products for ${category}`);

    const formattedProducts = categoryProducts.map((product) => ({
      _id: product._id.toString(),
      productName: product.productName,
      brand: product.brand,
      description: product.description,
      tag: product.tag,
      quantity: parseInt(product.quantity) || 0,
      date: product.date,
      price: parseInt(product.price) || 0,
      photo: product.photo,
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
}
