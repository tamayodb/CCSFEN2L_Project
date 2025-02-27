import jwt from 'jsonwebtoken';
import connectToDatabase from "../../../../../lib/db.js";
import Cart from "../../../../../models/cart.js";
import Product from "../../../../../models/product.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectToDatabase();

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user_id = decoded.userId;
            console.log("Using User ID:", user_id);

            const userIdObjectId = new mongoose.Types.ObjectId(user_id);
            const cartItems = await Cart.find({ user_id: userIdObjectId }).lean();

            if (!cartItems || cartItems.length === 0) {
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
        } catch (err) {
            return new Response(JSON.stringify({ message: 'Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
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

        // Fetch product to check stock
        const product = await Product.findById(productIdObjectId);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Fetch current cart quantity for this product
        const existingCartItem = await Cart.findOne({ user_id: userIdObjectId, product_id: productIdObjectId });
        const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;
        const totalQty = currentCartQty + quantity;

        // Prevent exceeding available stock
        if (totalQty > product.quantity) {
            return NextResponse.json({ 
                message: `Only ${product.quantity - currentCartQty} more items available.`,
                availableStock: product.quantity - currentCartQty,
                warning: true // Flag to indicate warning in frontend
            }, { status: 200 });
        }

        // Update cart or create new entry
        if (existingCartItem) {
            existingCartItem.quantity = totalQty;
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
