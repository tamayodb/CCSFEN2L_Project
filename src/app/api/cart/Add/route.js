import connectToDatabase from "../../../../../lib/db.js"; // Import the connectToDatabase function
import Cart from "../../../../../models/cart.js";
import Product from "../../../../../models/product.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectToDatabase();
        
        const user_id = "679e1945c4de6188e9e44574"; // Static user ID for now
        console.log("Using User ID:", user_id);

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
        const { product_id, user_id, quantity } = await request.json();

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

        return NextResponse.json({ message: "Item added to cart successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}