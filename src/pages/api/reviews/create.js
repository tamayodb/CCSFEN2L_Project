import connectToDatabase from '../../../../lib/db';
import Review from '../../../../models/review';

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

    res.status(201).json({ message: 'Review created successfully' });
  } catch (error) {
    console.error('Failed to create review:', error.message);
    res.status(500).json({ error: 'Failed to create review', details: error.message });
  }
}
