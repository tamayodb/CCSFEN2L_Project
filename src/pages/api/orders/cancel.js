import connectToDatabase from '../../../../lib/db';
import Order from '../../../../models/order';
import Product from '../../../../models/product'; // Import the Product model

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.body;

  await connectToDatabase();

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'To Ship' && order.status !== 'To Approve') {
      return res.status(400).json({ error: 'Only orders with status "To Ship" or "To Approve" can be cancelled' });
    }

    // Increment the product quantities
    const productUpdates = order.product_id.map((productId, index) => ({
      updateOne: {
        filter: { _id: productId },
        update: { $inc: { quantity: order.quantity[index] } }
      }
    }));

    await Product.bulkWrite(productUpdates);

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ message: 'Order status updated to Cancelled successfully' });
  } catch (error) {
    console.error('Failed to cancel order:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to cancel order', details: error.message });
  }
}
