import connectToDatabase from "../../../../../lib/db";
import Product from "@/models/product";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const { id } = req.query;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
