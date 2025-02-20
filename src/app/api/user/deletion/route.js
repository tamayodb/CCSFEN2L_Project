// /src/app/api/user/deletion/route.js
import connectToDatabase from "../../../../../lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from 'next/server';
import Customer from "../../../../../models/accounts";

export async function DELETE(req) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    // Extract and verify the token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);;
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase(); // Establish database connection

    // Find and delete the user
    const userId = decoded.userId;
    const deletedUser = await Customer.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Additionally, you might want to delete related data like orders, etc.
    // await Order.deleteMany({ userId: userId });
    
    return NextResponse.json(
      { message: 'Account successfully deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { message: `Failed to delete account: ${error.message}` },
      { status: 500 }
    );
  }
}