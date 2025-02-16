import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export the clientPromise to be used for database connection
export const connectToDatabase = async () => {
  try {
    await clientPromise; // Ensures the connection is established
    console.log("Connected to database");
  } catch (error) {
    console.error("Failed to connect to database", error);
    throw new Error("Database connection failed");
  }
};

export default clientPromise;
