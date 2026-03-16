import mongoose from "mongoose";
import Student from "../Models/Student.js";
import Room from "../Models/Room.js";
import RoomAllocation from "../Models/roomAllocation.js";

/**
 * ============================
 * ALLOCATE ROOM
 * ============================
 */
export const allocateRoom = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId, roomId } = req.body;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(roomId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId or roomId",
      });
    }

    // Check student exists
    const student = await Student.findById(studentId).session(session);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Ensure student has no active allocation
    const existingAllocation = await RoomAllocation.findOne({
      student: studentId,
      active: true,
    }).session(session);

    if (existingAllocation) {
      return res.status(400).json({
        success: false,
        message: "Student already has a room allocated",
      });
    }

    // Check room
    const room = await Room.findById(roomId).session(session);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.occupied >= room.capacity) {
      return res.status(400).json({
        success: false,
        message: "Room is already full",
      });
    }

    // Create allocation
    const allocation = await RoomAllocation.create(
      [
        {
          student: studentId,
          room: roomId,
          allocatedAt: new Date(),
          active: true,
        },
      ],
      { session },
    );

    // Update room occupancy
    room.occupied += 1;
    await room.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Room allocated successfully",
      data: allocation[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/**
 * ============================
 * DEALLOCATE ROOM
 * ============================
 */
export const deallocateRoom = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId",
      });
    }

    const allocation = await RoomAllocation.findOne({
      student: studentId,
      active: true,
    }).session(session);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "No active room allocation found",
      });
    }

    const room = await Room.findById(allocation.room).session(session);
    if (!room) {
      throw new Error("Allocated room not found");
    }

    // Update room occupancy
    if (room.occupied > 0) {
      room.occupied -= 1;
      await room.save({ session });
    }

    // Mark allocation inactive (history preserved)
    allocation.active = false;
    allocation.deallocatedAt = new Date();
    await allocation.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Room deallocated successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/**
 * ============================
 * REALLOCATE ROOM
 * ============================
 */
export const reallocateRoom = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId, newRoomId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(newRoomId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId or newRoomId",
      });
    }

    // Find active allocation
    const currentAllocation = await RoomAllocation.findOne({
      student: studentId,
      active: true,
    }).session(session);

    if (!currentAllocation) {
      return res.status(404).json({
        success: false,
        message: "Student does not have an active room allocation",
      });
    }

    // Prevent same-room reallocation
    if (currentAllocation.room.toString() === newRoomId) {
      return res.status(400).json({
        success: false,
        message: "Student is already allocated to this room",
      });
    }

    const oldRoom = await Room.findById(currentAllocation.room).session(
      session,
    );
    if (!oldRoom) {
      throw new Error("Old room not found");
    }

    const newRoom = await Room.findById(newRoomId).session(session);
    if (!newRoom) {
      return res.status(404).json({
        success: false,
        message: "New room not found",
      });
    }

    if (newRoom.occupied >= newRoom.capacity) {
      return res.status(400).json({
        success: false,
        message: "New room is already full",
      });
    }

    // Update old room
    oldRoom.occupied -= 1;
    await oldRoom.save({ session });

    // Deactivate old allocation
    currentAllocation.active = false;
    currentAllocation.deallocatedAt = new Date();
    await currentAllocation.save({ session });

    // Create new allocation
    const newAllocation = await RoomAllocation.create(
      [
        {
          student: studentId,
          room: newRoomId,
          allocatedAt: new Date(),
          active: true,
        },
      ],
      { session },
    );

    // Update new room
    newRoom.occupied += 1;
    await newRoom.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Room reallocated successfully",
      data: newAllocation[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/**
 * ============================
 * GET ALL ACTIVE ALLOCATIONS
 * ============================
 */
export const getAllAllocations = async (req, res) => {
  try {
    const allocations = await RoomAllocation.find({ active: true })
      .populate("student", "name email")
      .populate("room", "roomNumber capacity occupied");

    res.status(200).json({
      success: true,
      data: allocations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * ============================
 * GET STUDENT ACTIVE ALLOCATION
 * ============================
 */
export const getStudentAllocation = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId",
      });
    }

    const allocation = await RoomAllocation.findOne({
      student: studentId,
      active: true,
    })
      .populate("student", "name email")
      .populate("room", "roomNumber capacity occupied");

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "No active room allocation found",
      });
    }

    res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
