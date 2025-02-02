import mongoose from "mongoose";

const MONGODB_URI = process.env.MongoURL || "mongodb+srv://softengloop:mongo%40loop@cluster0.hkbmy.mongodb.net/"; // Replace with your connection string
const DB_NAME = "Loop"; // Explicitly specify the "Loop" database

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ Already connected to MongoDB.");
      return;
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME, // Specify the database name here
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Connected to MongoDB database: ${DB_NAME}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
};

export default connectToDatabase;