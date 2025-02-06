import Product from "../../../../models/product";
import connectToDatabase from "../../../../lib/db"; 
import { Response } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();

        const categories = ["Peripherals", "Games", "Collectibles"];
        let results = {};

        for (const category of categories) {
            results[category] = await Product.find({ tags: category })
                .sort({ date: -1 }) // Sort by newest first
                .limit(10); // Limit to top 10
        }

        return Response.json(results, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return Response.json({ message: "Error fetching products" }, { status: 500 });
    }
}
