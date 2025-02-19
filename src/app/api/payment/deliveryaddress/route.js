import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "../../../../../lib/db";
import Customer from "../../../../../models/accounts";

// Middleware to verify token
async function verifyToken(req) {
  const authHeader = req.headers.get("authorization");

  console.log("Received Authorization Header:", authHeader); // Debugging

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Token is required", status: 403 };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User ID:", decoded.userId); // Debugging
    return { userId: decoded.userId };
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return { error: "Failed to authenticate token", status: 401 };
  }
}

// GET request to fetch delivery address
export async function GET(req) {
  await connectToDatabase(); // Ensure DB connection

  const auth = await verifyToken(req);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const user = await Customer.findById(auth.userId, "address");

    if (!user) {
      console.log("User Not Found:", auth.userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ address: user.address }, { status: 200 });
  } catch (err) {
    console.error("Database Error:", err.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
