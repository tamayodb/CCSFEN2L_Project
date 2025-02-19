import connectToDatabase from "../../../../lib/db.js"; // Import the connectToDatabase function
import Order from "../../../../models/order.js"; // Import the Order model
import Product from "../../../../models/product.js"; // Import the Product model
import mongoose from "mongoose"; 

export async function GET() {
    try {
        await connectToDatabase();
        
        const user_id = "679e1945c4de6188e9e44574"; // Replace this with dynamic user_id
        console.log("Using User ID:", user_id);

        // Convert user_id to ObjectId if needed
        const userIdObjectId = new mongoose.Types.ObjectId(user_id);
        
        // Fetch orders for the user
        const orders = await Order.find({ user_id: userIdObjectId }).lean();
        console.log("Orders for User:", orders);

        if (!orders || orders.length === 0) {
            console.log("No orders found for the user.");
            return NextResponse.json([], { status: 200 });
        }

        // Extract product IDs from the orders
        const productIds = orders.flatMap(order => order.product_id);
        console.log("Product IDs from Orders:", productIds);

        // Fetch product details for the ordered products
        const products = await Product.find({ _id: { $in: productIds } })
            .select("productName price photo")
            .lean();
        console.log("Fetched Products:", products);

        if (!products || products.length === 0) {
            console.log("No products found for the ordered items.");
            return NextResponse.json([], { status: 200 });
        }

        // Map product details to the order data
        const formattedOrders = products.map(product => ({
            id: product._id.toString(),
            name: product.productName,
            image: product.photo?.[0] || "",
            price: product.price,
        }));

        console.log("Formatted Orders:", formattedOrders);
        return NextResponse.json(formattedOrders, { status: 200 });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
