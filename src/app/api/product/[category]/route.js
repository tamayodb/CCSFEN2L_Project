import connectToDatabase from "../../../../../lib/db";
import Product from "../../../../../models/product"; // Import Product model

export async function GET(req, context) {
    try {
        console.log("📡 API Request: Fetching products...");
        await connectToDatabase();

        const { category } = context.params; // Get category from URL

        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    
        const products = await Product.find({ "tag.type": formattedCategory });
        if (products.length === 0) {
          console.warn("⚠️ No ${formattedCategory} found in the database.");
        } else {
          console.log(`✅ Retrieved ${products.length} ${formattedCategory} products from MongoDB.`);
        }
    
        return Response.json(products, { status: 200 });
      } catch (error) {
        console.error("❌ Error in /api/product:", error.message);
        return Response.json({ error: "Failed to fetch products", details: error.message }, { status: 500 });
      }
  }
