import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../../../lib/db";
import Order from "../../../../../models/order";
import Customer from "../../../../../models/accounts"; // Assuming you have a Customer model
import jwt from "jsonwebtoken"; // For JWT token verification

// Helper function to verify JWT token
async function verifyToken(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return { error: "Token missing", status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Your secret key
    return { userId: decoded.userId }; // Assuming the JWT payload has a userId field
  } catch (err) {
    return { error: "Invalid or expired token", status: 401 };
  }
}

// POST request to process payment
export async function POST(req) {
  try {
    await connectToDatabase();

    const auth = await verifyToken(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Fetch the user from the Customer collection
    const user = await Customer.findById(
      auth.userId,
      "username contact_num address"
    );
    if (!user) {
      console.log("User Not Found:", auth.userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json(); // Get the request body
    const { cart, address, totalAmount, paymentMode } = body;

    // Decode the URI encoded cart items (product_id and quantity)
    const decodedCart = JSON.parse(decodeURIComponent(cart)); // Decode and parse the cart items

    // Get the total amount by summing the prices of products (you can adjust this logic as needed)
    let totalAmountCalculated = 0;
    const productIds = [];
    const quantities = [];

    for (const item of decodedCart) {
      productIds.push(item.id);
      quantities.push(item.qty);

      // Here, fetch the product price based on productId if needed.
      // You may use your Product model to get product details.
      // const product = await Product.findById(item.id); // Assuming you have a Product model
      // totalAmountCalculated += product.price * item.qty;
    }

    // Set the address from the user's customer document
    const fullAddress = `${user.address.street_num}, ${user.address.barangay}, ${user.address.city}, ${user.address.zip_code}`;

    const orderDate = new Date();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate = `${orderDate.getDate().toString().padStart(2, "0")}-${
      monthNames[orderDate.getMonth()]
    }-${orderDate.getFullYear()}`;

    const newOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      user_id: auth.userId,
      product_id: productIds,
      quantity: quantities,
      order_date: formattedDate, // Correctly formatted date
      totalAmount: totalAmount || totalAmountCalculated,
      address: fullAddress,
      paymentMode,
      status: "To Approve",
    });

    // Save order to the database
    await newOrder.save();
    return NextResponse.json(
      { message: "Order placed successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
