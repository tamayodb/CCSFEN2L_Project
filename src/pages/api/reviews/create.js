import connectToDatabase from '../../../../lib/db';
import Review from '../../../../models/review';
import Order from '../../../../models/order';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product_id, user_id, rating, comment } = req.body;

  await connectToDatabase();

  try {
    const newReview = new Review({
      product_id,
      user_id,
      rating,
      comment,
    });

    await newReview.save();

    // Update the order to set isRated to true for the rated product
    const order = await Order.findOne({ user_id: user_id, product_id: { $in: [product_id] } });
    if (order) {
      const productIndex = order.product_id.indexOf(product_id);
      if (productIndex !== -1) {
        order.isRated[productIndex] = true;
        await order.save();
      }
    }

    res.status(201).json({ message: 'Review created successfully' });
  } catch (error) {
    console.error('Failed to create review:', error.message);
    res.status(500).json({ error: 'Failed to create review', details: error.message });
  }
}
