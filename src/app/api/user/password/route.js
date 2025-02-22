import jwt from "jsonwebtoken";
import Customer from "../../../../../models/accounts";
import connectToDatabase from "../../../../../lib/db";
import bcrypt from "bcrypt";

// Helper function to verify the token and get the user ID
const verifyToken = (token) => {
  if (!token) {
    throw new Error("Unauthorized");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

// GET method to fetch current password (hashed)
export async function GET(req) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    
    const user = await Customer.findById(decoded.userId);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify({ currentPassword: user.password }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching current password:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST method to verify the current password
export async function POST(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await connectToDatabase();

    // Verify the token and get the user ID
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);

    // Parse the request body
    const { currentPassword } = await req.json();

    // Fetch the user from the database
    const user = await Customer.findById(decoded.userId);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Incorrect current password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return success message
    return new Response(JSON.stringify({ message: "Current password is correct" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error verifying current password:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT method to update the user's password
export async function PUT(req) {
  if (req.method !== "PUT") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await connectToDatabase();

    // Verify the token and get the user ID
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);

    // Parse the request body
    const { newPassword } = await req.json();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updatedUser = await Customer.findByIdAndUpdate(
      decoded.userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return success message
    return new Response(JSON.stringify({ message: "Password updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
