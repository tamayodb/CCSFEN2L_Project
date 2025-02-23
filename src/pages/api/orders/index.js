import connectToDatabase from '../../../../lib/db';
import Order from '../../../../models/order';
import Review from '../../../../models/review';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  await connectToDatabase();

  try {
    const orders = await Order.find({ user_id: userId }).populate('products.product_id');

    const ordersWithRatings = await Promise.all(
      orders.map(async (order) => {
        const productsWithRatings = await Promise.all(
          order.products.map(async (product) => {
            const review = await Review.findOne({ product_id: product.product_id, user_id: userId });
            return {
              ...product.toObject(),
              isRated: !!review,
            };
          })
        );
        return {
          ...order.toObject(),
          products: productsWithRatings,
        };
      })
    );

    console.log("Orders fetched:", ordersWithRatings); // Debugging
    res.status(200).json(ordersWithRatings);
  } catch (error) {
    console.error('Failed to fetch orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
}
