// Backend/models/Attendance.js

import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Half-Day", "Work from Home", "On Leave"],
    required: true,
  },
  timeIn: {
    type: String, // Format: "HH:MM" e.g., "09:00"
  },
  timeOut: {
    type: String, // Format: "HH:MM" e.g., "17:30"
  },
  workingHours: {
    type: Number, // Calculated in hours
  },
  remarks: {
    type: String,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
attendanceSchema.index({ employee: 1, date: 1 });

// Prevent duplicate attendance for same employee on same date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
