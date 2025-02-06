import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: [{type: String, required: true}], // Array of Description Strings
  price: { type: Number, required: true },
  photo: [ {type: String} ], // URL or file path to the product image
  quantity: { type: Number, required: true },
  tag: {
    type: { type: String }, // Type of product (e.g., "Games", "Electronics")
    category: [{ type: String }], // Categories (e.g., ["Peripherals", "Gaming"])
    platform: [{ type: String }], // Platforms (e.g., ["Nintendo"])
  },
  brand: { type: String },
  date: { type: Date, default: Date.now },
}, { collection: "Products" });

const Product =
  mongoose.models.Products || mongoose.model("Products", ProductSchema);

export default Product;
