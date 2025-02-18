import connectToDatabase from "../../../../lib/db.js"; // Import the connectToDatabase function
import Cart from "../../../../models/cart.js"; 
import Product from "../../../../models/product.js"; 
import { NextResponse } from "next/server";
import mongoose from "mongoose"; 

export async function GET() {
    try {
        await connectToDatabase();
        const user_id = "679e1945c4de6188e9e44574"; // Static user ID for now
        console.log("Using User ID:", user_id);

        // Convert user_id to ObjectId if needed
        const userIdObjectId = new mongoose.Types.ObjectId(user_id);
        
        // Try fetching all cart items to check if any exist in the collection
        const allCartItems = await Cart.find().lean();
        console.log("All Cart Items in Collection:", allCartItems);

        if (!allCartItems || allCartItems.length === 0) {
            console.log("No cart items found in the Cart collection.");
            return NextResponse.json([], { status: 200 });
        }

        // Fetch cart items for the specific user (you can still keep this in case there are user-specific cart items)
        const cartItems = await Cart.find({ user_id: userIdObjectId }).lean();
        console.log("Cart Items for User:", cartItems);

        if (!cartItems || cartItems.length === 0) {
            console.log("No cart items found for the user");
            return NextResponse.json([], { status: 200 });
        }
        
        // Extract product IDs from cart items
        const productIds = cartItems.map(item => item.product_id);
        console.log("Product IDs in Cart:", productIds);

        // Ensure that there are product IDs to query
        if (!productIds.length) {
            console.log("No product IDs found in the cart items");
            return NextResponse.json([], { status: 200 });
        }

        // Fetch product details
        const products = await Product.find({ _id: { $in: productIds } })
            .select("productName price photo")
            .lean();
        console.log("Fetched Products:", products);

        if (!products || products.length === 0) {
            console.log("No products found for the cart items");
            return NextResponse.json([], { status: 200 });
        }

        // Map product details with cart quantity
        const formattedCart = cartItems.map(cartItem => {
            // Ensure comparison works properly for ObjectIds
            const product = products.find(prod => prod._id.toString() === cartItem.product_id.toString());
            if (!product) {
                console.log(`Product not found for Cart Item: ${cartItem.product_id}`);
            }
            return product ? {
                id: product._id.toString(),
                name: product.productName,
                image: product.photo?.[0] || "",
                price: product.price,
                quantity: cartItem.quantity,
            } : null;
        }).filter(item => item !== null);

        console.log("Formatted Cart:", formattedCart);

        if (formattedCart.length === 0) {
            console.log("Formatted Cart is empty");
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(formattedCart, { status: 200 });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
