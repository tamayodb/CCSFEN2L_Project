import connectToDatabase from "../../../../lib/db";
import Product from "../../../../models/product";
import Review from "../../../../models/review";

export async function GET(req) {
    try {
        console.log("📡 API Request: Fetching products...");
        await connectToDatabase();

        const url = new URL(req.url);
        const searchQuery = url.searchParams.get("query") || "";
        const category = url.searchParams.get("category") || "";
        const minPrice = parseFloat(url.searchParams.get("minPrice")) || 0;
        const maxPrice = parseFloat(url.searchParams.get("maxPrice")) || 100000;
        const ratings = url.searchParams.getAll("ratings").map(Number);

        console.log("🔍 Query Params:", { searchQuery, category, minPrice, maxPrice, ratings });

        let filter = {};

        // 🔎 **Search by name (partial match)**
        if (searchQuery) {
            filter.productName = { $regex: searchQuery, $options: "i" };
        }

        // 📂 **Filter by category**
        if (category) {
            filter["tag.type"] = category;
        }

        // 💰 **Filter by price range**
        filter.price = { $gte: minPrice, $lte: maxPrice };

        // ⭐ **Filter by ratings**
        if (ratings.length > 0) {
            filter.rating = { $in: ratings };
        }

        console.log("🛒 Applied Filter:", JSON.stringify(filter, null, 2));

        const products = await Product.find(filter);

        if (!products.length) {
            console.warn("⚠️ No products found.");
        }

        return Response.json(products, { status: 200 });
    } catch (error) {
        console.error("❌ API Error:", error);
        return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
