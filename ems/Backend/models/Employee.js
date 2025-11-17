import mongoose from "mongoose";
const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    // link back to the user record
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // your company‐wide employee identifier
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    // date of birth
    dob: {
      type: Date,
      default: null,
    },

    // “Male” | “Female” etc.
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },

    // “Single” | “Married” | etc.
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      default: null,
    },

    // their job title
    designation: {
      type: String,
      trim: true,
      default: "",
    },

    // references the Department collection
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    // numeric salary
    salary: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
