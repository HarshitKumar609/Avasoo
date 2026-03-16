import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "visited", "confirmed", "rejected"],
      default: "new",
    },
    adminNote: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Enquiry", enquirySchema);
