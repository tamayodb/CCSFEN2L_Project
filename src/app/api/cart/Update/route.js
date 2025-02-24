import jwt from 'jsonwebtoken';
import connectToDatabase from "../../../../../lib/db.js";
import Cart from "../../../../../models/cart.js";
import Product from "../../../../../models/product.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(request) {
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
        const { product_id, action } = await request.json();

        const userIdObjectId = new mongoose.Types.ObjectId(user_id);
        const productIdObjectId = new mongoose.Types.ObjectId(product_id);

        const cartItem = await Cart.findOne({ user_id: userIdObjectId, product_id: productIdObjectId });

        if (!cartItem) {
            return NextResponse.json({ message: 'Item not found in cart' }, { status: 404 });
        }

        const product = await Product.findById(productIdObjectId);
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        if (action === 'increase') {
            cartItem.quantity += 1;
        } else if (action === 'decrease' && cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        }

        await cartItem.save();

        console.log(`User ID: ${user_id}, Product Name: ${product.productName}, Quantity: ${cartItem.quantity}`);

        return NextResponse.json({ message: 'Cart updated successfully', quantity: cartItem.quantity }, { status: 200 });
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
