import account from "../../../../models/accounts";
import connectToDatabase from "../../../../lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDatabase(); // Establish database connection
    const {
      name, 
      email, 
      password,
      username,
      contact_num,
      address
    } = await request.json();

    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const userExistence = await account.findOne({ email });
    if (userExistence) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);
    // Create new account with all fields
    const newAccount = new account({
      email,
      name: name || "",
      password: hashPassword,
      username: username || "",
      contact_num: contact_num || "",
      address: {
        street_num: address?.street_num || "",
        barangay: address?.barangay || "",
        city: address?.city || "",
        zip_code: address?.zip_code || null,
      }
    });
    await newAccount.save();
    const response = NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
    return response;
  } catch (err) {
    console.error("Registration error details:", {
      message: err.message,
      stack: err.stack
    });
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
