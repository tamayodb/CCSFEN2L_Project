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

    for (const category of categories) {
      const categoryProducts = await Products.find({ 'tag.category': { $in: [category] } })
        .sort({ date: -1 })
        .limit(10);

      // Format the products data according to your structure
      results[category] = categoryProducts.map(product => ({
        _id: product._id.toString(),
        productName: product.productName,
        brand: product.brand,
        description: product.description,
        tag: product.tag,
        quantity: product.quantity.$numberInt,  // Handle $numberInt
        date: product.date,
        price: product.price.$numberInt,  // Handle $numberInt
        photo: product.photo,
      }));
    }

    console.log("Fetched products:", results);
    return NextResponse.json(results); // Use NextResponse for the response
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Error fetching products", error: error.message }, { status: 500 });
  }
}
