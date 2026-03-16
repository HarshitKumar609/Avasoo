import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    coverImage: {
      url: String,
      public_id: String,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    block: {
      type: String,
      required: true,
      trim: true,
    },

    floor: {
      type: Number,
      required: true,
      min: 0,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    occupied: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "full"],
      default: "available",
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

/**
 * Runs on document save()
 */
roomSchema.pre("save", function () {
  if (this.occupied > this.capacity) {
    throw new Error("Occupied beds cannot exceed room capacity");
  }

  this.status = this.occupied >= this.capacity ? "full" : "available";
});

/**
 * Runs on findByIdAndUpdate / findOneAndUpdate
 */
roomSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate() || {};
  const $set = update.$set || {};

  const occupied = $set.occupied ?? update.occupied;
  const capacity = $set.capacity ?? update.capacity;

  if (occupied !== undefined && capacity !== undefined && occupied > capacity) {
    throw new Error("Occupied beds cannot exceed room capacity");
  }

  if (occupied !== undefined || capacity !== undefined) {
    this.set({
      status:
        (occupied ?? this._update?.occupied) >=
        (capacity ?? this._update?.capacity)
          ? "full"
          : "available",
    });
  }
});

/**
 * Ensure unique index
 */
// roomSchema.index({ roomNumber: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);
