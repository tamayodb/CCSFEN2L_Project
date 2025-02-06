import jwt from 'jsonwebtoken';
import Customer from '../../../../models/accounts'; // Your user model
import connectToDatabase from '../../../../lib/db'; // Your DB connection

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    // Get the token from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the token and get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your token verification logic
    const user = await Customer.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.status(200).json({
      email: user.email,
      username: user.username,
      name: user.name,
      phone: user.phone,
      address: {
        barangay: user.address?.barangay,
        street: user.address?.street,
        city: user.address?.city,
        zipCode: user.address?.zipCode,
      },
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}