import connectToDatabase from "../../../../../lib/db";
import { NextResponse } from "next/server";
import Products from "../../../../../models/product";

export async function GET(req) {
  console.log("API endpoint hit");
  try {
    await connectToDatabase();
    console.log("Database connected successfully");

    const categories = ["Peripherals", "Games", "Collectibles"];
    let results = {};

    const allProducts = await Products.find({});
    console.log("Total products in database:", allProducts.length);

    for (const category of categories) {
      console.log(`Fetching products for category: ${category}`);

      const categoryProducts = await Products.find({
        $or: [
          { "tag.type": category }, // Match category type
          { "tag.category": category }, // Match if stored as string
          { "tag.category": { $in: [category] } }, // Match if stored as array
        ],
      })
        .sort({ date: -1 })
        .limit(10);

      console.log(`Found ${categoryProducts.length} products for ${category}`);

      results[category] = categoryProducts.map((product) => ({
        _id: product._id.toString(),
        productName: product.productName,
        brand: product.brand,
        description: product.description,
        tag: product.tag,
        quantity: product.quantity?.$numberInt || product.quantity || 0, // Safe handling
        date: product.date,
        price: product.price?.$numberInt || product.price || 0, // Safe handling
        photo: product.photo,
      }));
    }

    console.log("Final fetched products:", results);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
}
