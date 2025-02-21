import connectToDatabase from "../../../../lib/db";
import Product from "../../../../models/product";
import Review from "../../../../models/review";

export async function GET(req) {
    try {
        console.log("📡 API Request: Fetching products...");
        await connectToDatabase();

        const url = new URL(req.url);
        const searchQuery = url.searchParams.get("query") || "";

        console.log("🔍 Query Params:", { searchQuery });

        let filter = {};

        // 🔎 **Search by product name and tag fields**
        if (searchQuery) {
            const regexSearch = { $regex: searchQuery, $options: "i" };

            filter["$or"] = [
                { "productName": regexSearch },          // Match in product name
                { "tag.type" : regexSearch },            // Match in tag.type
                { "tag.category" : regexSearch },        // Match in tag.category array
                { "tag.platform" : regexSearch },        // Match in tag.platform array
                { "tag.brand" : regexSearch },           // Match in tag.brand
            ];
        }

        const products = await Product.find(filter).lean();
        
        // log number of products fetched
        console.log(`Fetched ${products.length} products`);

        if (!products.length) {
            console.warn("⚠️ No products found.");
        }

        // Step 2: Get all product IDs
        const productIds = products.map((product) => product._id);

        // Step 3: Aggregate reviews to compute the average rating per product
        const reviewAggregation = await Review.aggregate([
            { $match: { product_id: { $in: productIds } } }, // Match only relevant product reviews
            {
                $group: {
                    _id: "$product_id",
                    avgRating: { $avg: "$rating" }, // Calculate average rating
                },
            },
        ]);

        // Step 4: Create a mapping of product_id → avgRating
        const ratingMap = Object.fromEntries(
            reviewAggregation.map(({ _id, avgRating }) => [_id.toString(), avgRating])
        );

        // Step 5: Merge ratings with products
        const productsWithRatings = products.map((product) => ({
            ...product,
            rating: ratingMap[product._id.toString()] || 0, // Default to 0 if no reviews
        }));

        return Response.json(productsWithRatings, { status: 200 });
    } catch (error) {
        console.error("❌ API Error:", error);
        return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
