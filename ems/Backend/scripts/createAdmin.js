// Backend/scripts/createAdmin.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Admin credentials
    const adminData = {
      name: "Admin",
      email: "admin@example.com",
      password: "admin123", // Change this to your desired password
      role: "admin",
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists. Updating password...");

      // Update password (pre-save hook will hash it)
      existingAdmin.password = adminData.password;
      await existingAdmin.save();

      console.log("✅ Admin password updated successfully!");
    } else {
      // Create new admin (pre-save hook will hash the password)
      const admin = await User.create(adminData);

      console.log("✅ Admin user created successfully!");
    }

    console.log("\n📧 Email:", adminData.email);
    console.log("🔑 Password:", adminData.password);
    console.log("\n⚠️  Please change this password after first login!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdmin();
