import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default function connectToDatabase() {
  mongoose
    .connect(process.env.MONGO_URL, {
      /* your opts */
    })
    .then(() => console.log("✅ MongoDB connected!"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}
