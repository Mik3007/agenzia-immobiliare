import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

await connectDB(process.env.MONGODB_URI);

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

const existing = await User.findOne({ email });
if (existing) {
  console.log("ℹ️ Admin già esistente:", email);
  process.exit(0);
}

const passwordHash = await bcrypt.hash(password, 10);
await User.create({ email, passwordHash, role: "admin" });

console.log("✅ Admin creato:", email);
process.exit(0);