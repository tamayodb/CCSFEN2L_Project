import dbConnect from "../db";
import Product from "@/models/product/product";

export async function getPeripheralProducts() {
  await dbConnect();

  const products = await Product.find({ category: "Peripherals" });

  return products.map((product) => ({
    name: product.productName, // Match this with 'productName' on frontend
    price: product.price,
    photo: product.photo[0], // Handle this appropriately
    slug: product.slug,
    stock: product.stock,
    description: product.description,
    category: product.category,
    rating: product.rating,
  }));
}
