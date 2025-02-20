import jwt from 'jsonwebtoken';
import connectToDatabase from "../../../../../lib/db.js"; // Import the connectToDatabase function
import Cart from "../../../../../models/cart.js";
import Product from "../../../../../models/product.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
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
        try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Adjust secret as needed
        const user = await Customer.findById(decoded.userId);

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
            });
        }

        // Pass decoded user ID
        const user_id = decoded.userId;
        console.log("Using User ID:", user_id);

        // Continue with your logic here

        } catch (err) {
        return new Response(JSON.stringify({ message: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
        }

        const userIdObjectId = new mongoose.Types.ObjectId(user_id);
        
        const cartItems = await Cart.find({ user_id: userIdObjectId }).lean();
        console.log("Cart Items for User:", cartItems);

        if (!cartItems || cartItems.length === 0) {
            console.log("No cart items found for the user");
            return NextResponse.json([], { status: 200 });
        }
        
        const productIds = cartItems.map(item => item.product_id);

        const products = await Product.find({ _id: { $in: productIds } })
            .select("productName price photo")
            .lean();

        const formattedCart = cartItems.map(cartItem => {
            const product = products.find(prod => prod._id.toString() === cartItem.product_id.toString());
            return product ? {
                id: product._id.toString(),
                name: product.productName,
                image: product.photo?.[0] || "",
                price: product.price,
                quantity: cartItem.quantity,
            } : null;
        }).filter(item => item !== null);

        return NextResponse.json(formattedCart, { status: 200 });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();

        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
        }

        const user_id = decoded.userId;
        console.log("User ID from token (Adding to Cart):", user_id);

        const { product_id, quantity } = await request.json();

        const userIdObjectId = new mongoose.Types.ObjectId(user_id);
        const productIdObjectId = new mongoose.Types.ObjectId(product_id);

        const existingCartItem = await Cart.findOne({ user_id: userIdObjectId, product_id: productIdObjectId });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
        } else {
            const newCartItem = new Cart({ product_id: productIdObjectId, user_id: userIdObjectId, quantity });
            await newCartItem.save();
        }

        console.log(`Added to Cart - User ID: ${user_id}, Product ID: ${product_id}, Quantity: ${quantity}`);

        return NextResponse.json({ message: "Item added to cart successfully", user_id }, { status: 201 });

    } catch (error) {
        console.error("Error adding item to cart:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}