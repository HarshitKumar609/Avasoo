import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["student", "complaint", "notice", "room", "payment", "allocation"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userModel", // supports Admin + Student
    },

    userModel: {
      type: String,
      enum: ["Student", "Admin"], //  IMPORTANT
    },

    role: {
      type: String,
      enum: ["student", "admin"],
    },
  },
  { timestamps: true },
);

// 🔥 Performance
activitySchema.index({ user: 1 });
activitySchema.index({ createdAt: -1 });

export default mongoose.model("Activity", activitySchema);
