import jwt from 'jsonwebtoken';
import connectToDatabase from "../../../../lib/db.js";
import Order from "../../../../models/order.js";
import Product from "../../../../models/product.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user_id = decoded.userId.toString();
    console.log('User ID:', user_id);

    // Fetch all orders for the user
    const allOrders = await Order.find({ user_id }).lean();

    if (!allOrders.length) {
      return NextResponse.json([], { status: 200 });
    }

    // Shuffle orders and pick 6 random ones
    const shuffledOrders = allOrders.sort(() => 0.5 - Math.random()).slice(0, 6);

    // Collect all product IDs from these orders (may have duplicates)
    const productIds = shuffledOrders.flatMap((order) => order.product_id);

    // Fetch product details for all these IDs
    const products = await Product.find({ _id: { $in: productIds } })
      .select('productName price photo')
      .lean();

    // Create a map of products by ID for quick lookup
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    // Build response: products grouped by order
    const orderedProducts = shuffledOrders.flatMap((order) =>
      order.product_id.map((productId) => {
        const product = productMap.get(productId.toString());
        return product
          ? {
              orderId: order._id.toString(),
              productId: product._id.toString(),
              name: product.productName,
              image: product.photo?.[0] || '',
              price: product.price,
              orderDate: order.order_date,
            }
          : null;
      }).filter(Boolean)
    );

    return NextResponse.json(orderedProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching random ordered products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
