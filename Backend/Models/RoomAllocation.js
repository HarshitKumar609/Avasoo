import mongoose from "mongoose";

const roomAllocationSchema = new mongoose.Schema(
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

    allocatedAt: {
      type: Date,
      default: Date.now,
    },
    deallocatedAt: {
      type: Date,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

roomAllocationSchema.index(
  { student: 1 },
  { unique: true, partialFilterExpression: { active: true } },
);

export default mongoose.model("RoomAllocation", roomAllocationSchema);
