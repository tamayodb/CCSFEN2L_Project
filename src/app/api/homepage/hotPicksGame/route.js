import connectToDatabase from "../../../../../lib/db";
import { NextResponse } from "next/server";
import Products from "../../../../../models/product";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch 10 random products
    const randomProducts = await Products.aggregate([{ $sample: { size: 10 } }]);

    console.log("🎲 10 Random Products:", randomProducts); // Log in server console

    return NextResponse.json(randomProducts, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
