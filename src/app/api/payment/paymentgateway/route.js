import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../../../lib/db";
import Order from "../../../../../models/order";
import Customer from "../../../../../models/accounts";
import Product from "../../../../../models/product"; // Import the Product model
import jwt from "jsonwebtoken";

// Helper function to verify JWT token
async function verifyToken(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return { error: "Token missing", status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.userId };
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

    const body = await req.json();
    const { cart, address, totalAmount, paymentMode } = body;

    // Decode the URI encoded cart items
    const decodedCart = JSON.parse(decodeURIComponent(cart));

    // Create arrays for order creation
    const productIds = [];
    const quantities = [];
    const isRated = [];
    
    // Check all products are available in the required quantities
    const productUpdates = [];
    for (const item of decodedCart) {
      const product = await Product.findById(item.id);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 404 });
      }
      
      if (product.quantity < item.qty) {
        return NextResponse.json(
          { 
            error: "Insufficient inventory", 
            product: product.productName, 
            requested: item.qty, 
            available: product.quantity 
          }, 
          { status: 400 }
        );
      }
      
      // Save product IDs and quantities for order
      productIds.push(item.id);
      quantities.push(item.qty);
      isRated.push(false);
      
      // Prepare the inventory update
      productUpdates.push({
        updateOne: {
          filter: { _id: item.id },
          update: { $inc: { quantity: -item.qty } }
        }
      });
    }

    // Set the address from the user's customer document
    const fullAddress = `${user.address.street_num}, ${user.address.barangay}, ${user.address.city}, ${user.address.zip_code}`;

    const orderDate = new Date();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const formattedDate = `${orderDate.getDate().toString().padStart(2, "0")}-${
      monthNames[orderDate.getMonth()]
    }-${orderDate.getFullYear()}`;

    // Create new order document
    const newOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      user_id: auth.userId,
      product_id: productIds,
      quantity: quantities,
      isRated: isRated,
      order_date: formattedDate,
      totalAmount: totalAmount,
      address: fullAddress,
      paymentMode,
      status: "To Approve",
    });

    // Start a session to ensure atomicity of operations
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Save the order
      await newOrder.save({ session });
      
      // Update product quantities in a bulk operation
      if (productUpdates.length > 0) {
        await Product.bulkWrite(productUpdates, { session });
      }
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      return NextResponse.json(
        { message: "Order placed successfully", order: newOrder },
        { status: 201 }
      );
    } catch (transactionError) {
      // If an error occurs, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}