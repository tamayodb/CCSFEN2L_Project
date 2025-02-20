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
        console.log("User ID from token (Removing Multiple Items from Cart):", user_id);

        const { product_ids } = await request.json();

        if (!Array.isArray(product_ids) || product_ids.length === 0) {
            return NextResponse.json({ message: 'Invalid product IDs' }, { status: 400 });
        }

        const userIdObjectId = new mongoose.Types.ObjectId(user_id);
        const productObjectIds = product_ids.map(id => new mongoose.Types.ObjectId(id));

        const result = await Cart.deleteMany({ user_id: userIdObjectId, product_id: { $in: productObjectIds } });

        console.log(`Removed from Cart - User ID: ${user_id}, Product IDs: ${product_ids}`);

        return NextResponse.json({ message: 'Items removed from cart successfully', deletedCount: result.deletedCount }, { status: 200 });
    } catch (error) {
        console.error("Error removing items from cart:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export function handleRemoveMultipleItems(productIds, token) {
    return fetch('/api/cart', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_ids: productIds })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove items from cart');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error removing items:', error);
    });
}