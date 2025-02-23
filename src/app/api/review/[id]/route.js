import connectToDatabase from "../../../../../lib/db";
import Review from "../../../../../models/review";

export async function GET(req, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        // Fetch all reviews for this product
        const reviews = await Review.find({ product_id: id }).lean();

        return Response.json({ reviews }, { status: 200 });
    } catch (error) {
        console.error("❌ API Error:", error);
        return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
