import Product from "../../../../models/product";
import connectToDatabase from "../../../../lib/db";

export async function GET(req, res) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Categories you want to fetch
    const categories = ["Peripherals", "Games", "Collectibles"];
    let results = {};

    // Fetch products for each category
    for (const category of categories) {
      const categoryProducts = await Product.find({ 'tag.category': category })
        .sort({ date: -1 })  // Sort by newest first
        .limit(10);  // Limit to top 10 products

      results[category] = categoryProducts;
    }

    // Send back the results using `res.json()` (correct way)
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    // Use res.json() here to send the error message
    return res.status(500).json({ message: "Error fetching products", error: error.message });
  }
}
