import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getAllAvailableRooms,
} from "../controllers/roomController.js";

import { upload } from "../middleware/multer.js";
import { protect, authorizeRoles } from "../middleware/Protect.js";

const router = express.Router();

/**
 * PUBLIC ROUTES
 */
router.get("/available", getAllAvailableRooms);
router.get("/:id", getRoomById);

/**
 * ADMIN ROUTES
 */
router.get("/", protect, authorizeRoles("admin"), getAllRooms);

/**
 * CREATE ROOM
 */
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createRoom,
);

/**
 * UPDATE ROOM
 * Supports:
 * - coverImage (replace)
 * - image (replace ONE gallery image)
 * - images (add multiple new images)
 */
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "image", maxCount: 1 }, // 👈 replace ONE gallery image
    { name: "images", maxCount: 5 }, // 👈 add new images
  ]),
  updateRoom,
);

/**
 * DELETE ROOM
 */
router.delete("/:id", protect, authorizeRoles("admin"), deleteRoom);

export default router;
