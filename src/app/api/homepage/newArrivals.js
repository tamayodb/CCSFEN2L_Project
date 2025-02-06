import { NextResponse } from "next/server"; 
import connectToDatabase from "../../../../lib/db";

export async function GET(req) {
  console.log("API endpoint hit"); // Log for debugging
  try {
    await connectToDatabase();
    console.log("Database connected successfully");

    const categories = ["Peripherals", "Games", "Collectibles"];
    let results = {};

    for (const category of categories) {
      const categoryProducts = await Product.find({ 'tag.category': { $in: [category] } })
        .sort({ date: -1 })
        .limit(10);

      results[category] = categoryProducts;
    }

    console.log("Fetched products:", results); // Log to check the fetched products
    return NextResponse.json(results); // Use NextResponse for the response
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Error fetching products", error: error.message }, { status: 500 });
  }
}
