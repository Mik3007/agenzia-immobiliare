// backend/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" }, // qui potresti gestire più ruoli in futuro
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
