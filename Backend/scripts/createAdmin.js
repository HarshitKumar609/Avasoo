import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../Models/Admin.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const admin = await Admin.create({
  name: "Hostel Admin",
  email: "admin@hostel.com",
  password: "Admin@123", // auto-hashed
});

console.log("Admin created successfully");
process.exit();
