// Backend/scripts/createTestEmployee.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

const createTestEmployee = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Get or create department
    let department = await Department.findOne();
    if (!department) {
      department = await Department.create({
        dep_name: "IT Department",
        description: "Information Technology",
      });
      console.log("✅ Created IT Department");
    }

    // Employee with ID: 55555
    const employeeData = {
      name: "Test Employee 55555",
      email: "test55555@company.com",
      password: "employee123", // Plain password - will be hashed by User model
      role: "employee",
    };

    // Check if user exists
    let user = await User.findOne({ email: employeeData.email });

    if (user) {
      console.log("⚠️  User already exists. Updating password...");
      user.password = employeeData.password;
      await user.save();
      console.log("✅ Password updated!");
    } else {
      user = await User.create(employeeData);
      console.log("✅ User created!");
    }

    // Check if employee record exists
    let employee = await Employee.findOne({ employeeId: "55555" });

    if (employee) {
      console.log("✅ Employee ID 55555 already exists");
    } else {
      employee = await Employee.create({
        userId: user._id,
        employeeId: "55555",
        dob: new Date("1995-05-15"),
        gender: "Male",
        maritalStatus: "Single",
        designation: "Software Engineer",
        department: department._id,
        salary: 75000,
      });
      console.log("✅ Employee record created!");
    }

    console.log("\n📋 Test Employee Details:");
    console.log("📧 Email:", employeeData.email);
    console.log("🆔 Employee ID: 55555");
    console.log("🔑 Password: employee123");
    console.log("\n✨ You can login with EITHER:");
    console.log("   1. Email: test55555@company.com + Password: employee123");
    console.log("   2. ID: 55555 + Password: employee123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createTestEmployee();
