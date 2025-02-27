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

    // Extract all unique product IDs from all orders
    const uniqueProductIds = new Set();
    allOrders.forEach(order => {
      order.product_id.forEach(id => {
        uniqueProductIds.add(id.toString());
      });
    });

    // Convert Set to Array
    const uniqueProductIdsArray = Array.from(uniqueProductIds);
    
    // Shuffle the unique product IDs and take at most 6
    const shuffledUniqueProductIds = uniqueProductIdsArray
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);

    // Fetch product details for the selected unique IDs
    const products = await Product.find({ _id: { $in: shuffledUniqueProductIds } })
      .select('productName price photo tag.type')
      .lean();

    // Find which order each product came from (use the most recent order if multiple)
    const productOrderMap = new Map();
    
    // Sort orders by date (newest first) to ensure we use the most recent order
    const sortedOrders = [...allOrders].sort((a, b) => 
      new Date(b.order_date) - new Date(a.order_date)
    );
    
    // Map each product to its order
    for (const order of sortedOrders) {
      for (const productId of order.product_id) {
        const productIdStr = productId.toString();
        // Only add if this product is in our shuffled selection and hasn't been mapped yet
        if (shuffledUniqueProductIds.includes(productIdStr) && !productOrderMap.has(productIdStr)) {
          productOrderMap.set(productIdStr, {
            orderId: order._id.toString(),
            orderDate: order.order_date
          });
        }
      }
    }

    // Build the final response with no duplications
    const orderedProducts = products.map(product => {
      const productId = product._id.toString();
      const orderInfo = productOrderMap.get(productId);
      
      return {
        orderId: orderInfo?.orderId,
        productId: productId,
        name: product.productName,
        image: product.photo?.[0] || '',
        price: product.price,
        type: product.tag?.type || 'unknown',
        orderDate: orderInfo?.orderDate,
      };
    });

    return NextResponse.json(orderedProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching random ordered products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}