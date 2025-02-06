import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  username: { type: String, required: false },
  password: { type: String, required: true },
  email: { type: String, required: true },
  contact_num: { type: String, required: false },
  street_num: { type: String, required: false },
  barangay: { type: String, required: false },
  city: { type: String, required: false },
  zip_code: { type: Number, required: false },
});

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

export default Customer;
