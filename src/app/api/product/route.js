import connectToDatabase from "../../../../lib/db";
import Product from "../../../../models/product"; // Import Product model

export async function GET() {
    try {
        console.log("📡 API Request: Fetching products...");
        await connectToDatabase();
    
        const products = await Product.find({});
        if (products.length === 0) {
          console.warn("⚠️ No products found in the database.");
        } else {
          console.log(`✅ Retrieved ${products.length} products from MongoDB.`);
        }
    
        return Response.json(products, { status: 200 });
      } catch (error) {
        console.error("❌ Error in /api/product:", error.message);
        return Response.json({ error: "Failed to fetch products", details: error.message }, { status: 500 });
      }
  }
