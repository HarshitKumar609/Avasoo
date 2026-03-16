import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    profileImage: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      select: false, //  never send password
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },

    course: {
      type: String,
    },

    parentName: {
      type: String,
    },

    parentPhone: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: false, //  IMPORTANT
    },

    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true },
);

/**
 * =========================
 * PASSWORD HASH
 * =========================
 */
studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * =========================
 * PASSWORD COMPARE
 * =========================
 */
studentSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Student", studentSchema);
