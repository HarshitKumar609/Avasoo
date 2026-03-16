import express from "express";
import {
  createComplaint,
  getStudentComplaints,
  updateComplaint,
  deleteComplaint,
  getAllComplaints,
  resolveComplaint,
} from "../controllers/complaintController.js";
import { protect, authorizeRoles } from "../middleware/Protect.js";

const router = express.Router();

/* ===== STUDENT ROUTES ===== */
router.post("/", protect, authorizeRoles("student"), createComplaint);
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentComplaints,
);
router.put("/:id", protect, authorizeRoles("student"), updateComplaint);
router.delete("/:id", protect, authorizeRoles("student"), deleteComplaint);

/* ===== ADMIN ROUTES ===== */
router.get("/", protect, authorizeRoles("admin"), getAllComplaints);
router.put("/:id/resolve", protect, authorizeRoles("admin"), resolveComplaint);

export default router;
