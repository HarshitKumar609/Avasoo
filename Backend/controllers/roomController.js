import Room from "../Models/Room.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
  replaceOnCloudinary,
} from "../utils/Cloudinary.js";

/**
 * CREATE ROOM
 */
export const createRoom = async (req, res) => {
  try {
    const { roomNumber, block, floor, capacity, price, description } = req.body;

    if (!roomNumber || !block || !floor || !capacity || !price) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(409).json({
        success: false,
        message: "Room with this number already exists",
      });
    }

    let coverImage = null;
    const images = [];

    if (req.files?.coverImage?.[0]) {
      coverImage = await uploadOnCloudinary(
        req.files.coverImage[0].path,
        "AvasooImages/rooms/cover",
      );
    }

    if (req.files?.images?.length) {
      for (const file of req.files.images) {
        const upload = await uploadOnCloudinary(
          file.path,
          "AvasooImages/rooms/gallery",
        );
        if (upload) images.push(upload);
      }
    }

    const room = await Room.create({
      roomNumber,
      block,
      floor,
      capacity,
      price,
      description,
      coverImage,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL ROOMS (ADMIN)
 */
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ block: 1, floor: 1 });

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE ROOM
 * - Update fields
 * - Replace cover image
 * - Replace ONE gallery image by index
 * - OR add new gallery images
 */
export const updateRoom = async (req, res) => {
  try {
    const { roomNumber, block, floor, capacity, price, description } = req.body;
    const { imageIndex } = req.body; // index for replacing gallery image

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    room.roomNumber = roomNumber ?? room.roomNumber;
    room.block = block ?? room.block;
    room.floor = floor ?? room.floor;
    room.capacity = capacity ?? room.capacity;
    room.price = price ?? room.price;
    room.description = description ?? room.description;

    /**
     * REPLACE COVER IMAGE
     */
    if (req.files?.coverImage?.[0]) {
      const replaced = await replaceOnCloudinary(
        room.coverImage?.public_id,
        req.files.coverImage[0].path,
        "AvasooImages/rooms/cover",
      );

      if (replaced) {
        room.coverImage = replaced;
      }
    }

    /**
     * REPLACE ONE GALLERY IMAGE (BY INDEX)
     */
    if (
      req.files?.image?.[0] &&
      imageIndex !== undefined &&
      room.images[imageIndex]
    ) {
      const replaced = await replaceOnCloudinary(
        room.images[imageIndex].public_id,
        req.files.image[0].path,
        "AvasooImages/rooms/gallery",
      );

      if (replaced) {
        room.images[imageIndex] = replaced;
      }
    }

    /**
     * ADD NEW GALLERY IMAGES
     */
    if (req.files?.images?.length) {
      for (const file of req.files.images) {
        const upload = await uploadOnCloudinary(
          file.path,
          "AvasooImages/rooms/gallery",
        );
        if (upload) room.images.push(upload);
      }
    }

    await room.save();

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE ROOM
 */
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.occupied > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete room with occupied beds",
      });
    }

    if (room.coverImage?.public_id) {
      await deleteFromCloudinary(room.coverImage.public_id);
    }

    if (room.images?.length) {
      for (const img of room.images) {
        await deleteFromCloudinary(img.public_id);
      }
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET AVAILABLE ROOMS (PUBLIC)
 */
export const getAllAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "available" }).sort({
      block: 1,
      floor: 1,
    });

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ROOM BY ID
 */
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid room ID",
    });
  }
};
