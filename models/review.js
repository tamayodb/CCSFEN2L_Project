import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  review_date: { type: Date, default: Date.now },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating from 1 to 5
  comment: { type: String },
}, { collection: "Reviews", versionKey: false });

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
