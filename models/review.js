const ReviewSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  date: { type: Date, default: Date.now },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating from 1 to 5
  comment: { type: String },
});

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
