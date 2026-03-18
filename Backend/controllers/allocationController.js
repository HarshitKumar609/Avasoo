import mongoose from "mongoose";
import Student from "../Models/Student.js";
import Room from "../Models/Room.js";
import RoomAllocation from "../Models/RoomAllocation.js";

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

    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(roomId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId or roomId",
      });
    }

    const student = await Student.findById(studentId).session(session);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

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

    const student = await Student.findById(studentId).session(session);

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

    if (room.occupied > 0) {
      room.occupied -= 1;
      await room.save({ session });
    }

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

    const student = await Student.findById(studentId).session(session);

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

    oldRoom.occupied -= 1;
    await oldRoom.save({ session });

    currentAllocation.active = false;
    currentAllocation.deallocatedAt = new Date();
    await currentAllocation.save({ session });

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
