import mongoose from "mongoose";

const hostelPaymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: Number, // 1–12
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["due", "paid"],
      default: "due",
    },
    stripePaymentIntentId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    dueDate: {
      type: Date, // first day of the month
      required: true,
    },
  },
  { timestamps: true },
);

// Ensure uniqueness of student/month/year
hostelPaymentSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });

// Pre-save hook to set dueDate
hostelPaymentSchema.pre("save", async function () {
  this.dueDate = await new Date(this.year, this.month - 1, 1); // first day of month
});

export default mongoose.models.HostelPayment ||
  mongoose.model("HostelPayment", hostelPaymentSchema);
