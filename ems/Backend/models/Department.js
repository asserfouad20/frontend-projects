import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  dep_name: { type: String, required: true },
  description: { type: String }, // String, not lowercase `string`
  createdAt: { type: Date, default: Date.now }, // Date.now, not DataTransfer.now
  updatedAt: { type: Date, default: Date.now },
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;
