import connectToDatabase from '../../../lib/db';
import Order from '../../../models/order';
import Product from '../../../models/product';

export default async function handler(req, res) {
  await connectToDatabase();

  try {
    const orders = await Order.find({});

    // Fetch product details for each order
    const ordersWithProductDetails = await Promise.all(
      orders.map(async (order) => {
        const products = await Promise.all(
          order.product_id.map(async (productId) => {
            const product = await Product.findById(productId);
            console.log('Fetched product:', product); // Add logging
            return {
              name: product.productName,
              picture: product.photo[0], // Get the first image from the array
              quantity: order.quantity[order.product_id.indexOf(productId)],
            };
          })
        );
        return { ...order._doc, products };
      })
    );

    console.log('Orders with product details fetched successfully:', ordersWithProductDetails);
    res.status(200).json(ordersWithProductDetails);
  } catch (error) {
    console.error('Failed to fetch orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
}
