import jwt from 'jsonwebtoken';
import connectToDatabase from "../../../../../lib/db.js";
import Cart from "../../../../../models/cart.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(request) {
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
        const { product_id, quantity } = await request.json();

        if (!product_id || typeof quantity !== 'number' || quantity < 1) {
            return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
        }

        const userIdObjectId = new mongoose.Types.ObjectId(user_id);
        const productIdObjectId = new mongoose.Types.ObjectId(product_id);

        const cartItem = await Cart.findOne({ user_id: userIdObjectId, product_id: productIdObjectId });

        if (!cartItem) {
            return NextResponse.json({ message: 'Item not found in cart' }, { status: 404 });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return NextResponse.json({ message: 'Cart updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
