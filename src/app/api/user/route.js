import jwt from 'jsonwebtoken';
import Customer from '../../../../models/accounts'; // Your user model
import connectToDatabase from '../../../../lib/db'; // Your DB connection

// Named export for the GET method
export async function GET(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await connectToDatabase();

    // Get the token from the request headers
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify the token and get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your token verification logic
    const user = await Customer.findById(decoded.userId);

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the user data
    return new Response(
      JSON.stringify({
        email: user.email,
        username: user.username,
        name: user.name,
        contact_num: user.contact_num,
        address: {
          barangay: user.address?.barangay,
          street_num: user.address?.street_num,
          city: user.address?.city,
          zip_code: user.address?.zip_code,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}