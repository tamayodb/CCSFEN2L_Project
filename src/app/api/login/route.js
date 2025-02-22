import Customer from "../../../../models/accounts";
import connectToDatabase from "../../../../lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectToDatabase(); // Establish database connection
    const { email, password } = await request.json();
    // Find the user by email
    const userExistence = await Customer.findOne({ email });
    if (!userExistence) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    // Compare the password
    const checkPassword = await bcrypt.compare(password, userExistence.password);
    if (!checkPassword) {
      return NextResponse.json(
        { message: "Wrong Password" },
        { status: 401 } // Use 401 for unauthorized
      );
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: userExistence._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });
    // Return the token to the client
    return NextResponse.json(
      { message: "Login successful", token, userId: userExistence._id }, // Include the token and userId in the response
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}