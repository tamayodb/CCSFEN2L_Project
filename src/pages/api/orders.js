import connectToDatabase from '../../../lib/db';
import Order from '../../../models/order';
import Product from '../../../models/product';

export default async function handler(req, res) {
  await connectToDatabase();

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    console.log('Fetching orders for userId:', userId); // Add logging
    const orders = await Order.find({ user_id: userId });
    console.log('Fetched orders:', orders); // Add logging

    // Fetch product details for each order
    const ordersWithProductDetails = await Promise.all(
      orders.map(async (order) => {
        const products = await Promise.all(
          order.product_id.map(async (productId, index) => {
            const product = await Product.findById(productId);
            console.log('Fetched product:', product); // Add logging
            return {
              name: product.productName,
              photo: product.photo, // Include the photo field
              price: product.price, // Get the price from the product
              description: product.description, // Get the desc from the product
              quantity: order.quantity[index], // Get the quantity from the order
            };
          })
        );

        // Calculate the total amount by summing the prices of each product
        const totalAmount = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

        return { ...order._doc, products, totalAmount };
      })
    );

    console.log('Orders with product details fetched successfully:', ordersWithProductDetails);
    res.status(200).json(ordersWithProductDetails);
  } catch (error) {
    console.error('Failed to fetch orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
}
