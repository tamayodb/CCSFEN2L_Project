import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  username: { type: String, required: false }, // Make username optional
  password: { type: String, required: true },  // Password is required
  email: { type: String, required: true },     // Email is required
  contact_num: { type: String, required: false }, // Contact number is optional
  address: {
    street_num: { type: String, required: false }, // Street number is optional
    barangay: { type: String, required: false },   // Barangay is optional
    city: { type: String, required: false },       // City is optional
    zip_code: { type: Number, required: false },   // ZIP code is optional
  },
}, { collection: "Customer" });

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

export default Customer;
