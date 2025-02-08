import connectToDatabase from "../../../../../lib/db";
import { NextResponse } from "next/server";
import Products from "../../../../../models/product";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch 10 random products where tag.type is "Games"
    const randomGames = await Products.aggregate([
      { $match: { "tag.type": "Games" } }, // Correct filter for category
      { $sample: { size: 10 } }, // Get 10 random games
    ]);

    console.log("🎲 10 Random Games:", randomGames); // Debugging

    return NextResponse.json(randomGames, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
