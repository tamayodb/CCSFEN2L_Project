import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: [{type: String, required: true}], // Array of Description Strings
  price: { type: Number, required: true },
  photo: { type: String }, // URL or file path to the product image
  quantity: { type: Number, required: true },
  tags: [{ type: String }], // Array of tags
  brand: { type: String },
  date: { type: Date, default: Date.now },
}, { collection: "product" });

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
