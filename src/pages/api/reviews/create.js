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
    const order = await Order.findOneAndUpdate(
      { "products.product_id": product_id, user_id: user_id },
      { $set: { "products.$.isRated": true } }, // Mark product as rated
      { new: true }
    );

    console.log("Updated order:", order);

    res.status(201).json({ message: 'Review created successfully' });
  } catch (error) {
    console.error('Failed to create review:', error.message);
    res.status(500).json({ error: 'Failed to create review', details: error.message });
  }
}
