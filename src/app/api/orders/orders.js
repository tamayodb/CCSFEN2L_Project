// filepath: /C:/Users/Ella/projects/datablitz/src/app/api/orders/orders.js
import connectToDatabase from '../../../../lib/db';
import Order from '../../../../models/order';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const orders = await Order.find({});
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}