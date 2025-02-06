import Customer from "../../../../models/accounts";
import connectToDatabase from "../../../../lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectToDatabase(); // Establish database connection
    const { email, password } = await request.json();
    console.log("Customer: ", Customer.collection.email);
    // Find the user by email
    const userExistence = await Customer.findOne({ email });
    console.log("Customer: ", Customer.collection.email);
    console.log("User Existence: ", userExistence);
    if (!userExistence) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    console.log("Got here");
    // Compare the password
    const checkPassword = await bcrypt.compare(password, userExistence.password);
    if (!checkPassword) {
      return NextResponse.json(
        { message: "Wrong Password" },
        { status: 401 } // Use 401 for unauthorized
      );
    }
    console.log("Got here");
    // Generate a JWT token
    console.log("JWT_SECRET: ", process.env.JWT_SECRET);
    const token = jwt.sign({ userId: userExistence._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });
    console.log("Got here");
    // Return the token to the client
    return NextResponse.json(
      { message: "Login successful", token }, // Include the token in the response
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}