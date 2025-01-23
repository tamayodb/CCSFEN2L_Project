import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
});

const account = mongoose.models.accounts || mongoose.model("accounts", AccountSchema);

export default account;