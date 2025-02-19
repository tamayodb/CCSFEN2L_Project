import { connectToDatabase } from "@/utils/db";
import clientPromise from "@/utils/db";
import Product from "../../../../models/product"; // relative path


export async function GET(req) {
    try {
      await clientPromise; // This will resolve the MongoDB connection
      const products = await Product.find({}).select(
        "productName brand description tag quantity date price photo"
      );
      return new Response(JSON.stringify(products));
    } catch (error) {
      console.error("Error fetching products:", error);
      return new Response("Failed to fetch products", { status: 500 });
    }
  }