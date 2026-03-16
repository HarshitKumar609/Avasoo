import express from "express";
import { protect, authorizeRoles } from "../middleware/Protect.js";
import {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticecontroller.js";

const router = express.Router();

// GET all notices (admin + student)
router.get("/", protect, getAllNotices);

// CREATE notice (admin only)
router.post("/create", protect, authorizeRoles("admin"), createNotice);

// UPDATE notice
router.put("/:id", protect, authorizeRoles("admin"), updateNotice);

// DELETE notice
router.delete("/:id", protect, authorizeRoles("admin"), deleteNotice);

export default router;
