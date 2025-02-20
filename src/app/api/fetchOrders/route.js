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

    // Get the most recent 6 orders
    const recentOrders = await Order.find({ user_id })
      .sort({ order_date: -1 })
      .limit(6)
      .lean();

    console.log('Fetched Orders:', recentOrders);

    if (!recentOrders.length) {
      return NextResponse.json([], { status: 200 });
    }

    // Collect all product IDs from these orders (may have duplicates)
    const productIds = recentOrders.flatMap((order) => order.product_id);

    // Fetch product details for all these IDs
    const products = await Product.find({ _id: { $in: productIds } })
      .select('productName price photo')
      .lean();

    // Create a map of products by ID for quick lookup
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    // Build response: products grouped by order and keep the order sequence
    const orderedProducts = recentOrders.flatMap((order) =>
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
    console.error('Error fetching recent ordered products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
