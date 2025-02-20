import jwt from 'jsonwebtoken';
import connectToDatabase from "../../../../../lib/db.js";
import Cart from "../../../../../models/cart.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(request) {
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
        console.log("User ID from token (Removing from Cart):", user_id);

        const { product_id } = await request.json();

        const userIdObjectId = new mongoose.Types.ObjectId(user_id);
        const productIdObjectId = new mongoose.Types.ObjectId(product_id);

        const cartItem = await Cart.findOne({ user_id: userIdObjectId, product_id: productIdObjectId });

        if (!cartItem) {
            return NextResponse.json({ message: 'Item not found in cart' }, { status: 404 });
        }

        await Cart.deleteOne({ _id: cartItem._id });

        console.log(`Removed from Cart - User ID: ${user_id}, Product ID: ${product_id}`);

        return NextResponse.json({ message: 'Item removed from cart successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export function handleRemoveItem(productId, token) {
    return fetch('/api/cart', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove item from cart');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error removing item:', error);
    });
}