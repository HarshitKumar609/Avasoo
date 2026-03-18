import express from "express";
import {
  dashboardStats,
  getRecentActivity,
} from "../controllers/adminDashboardController.js";

import { studentDashboardStats } from "../controllers/studentDashboardController.js";

import { protect, authorizeRoles } from "../middleware/Protect.js";

const router = express.Router();

/**
 * =========================
 * ADMIN DASHBOARD
 * =========================
 */

// 📊 Admin Stats
router.get("/", protect, authorizeRoles("admin"), dashboardStats);

// Admin Activity (also works for student role-based)
router.get(
  "/activity",
  protect,
  authorizeRoles("admin", "student"),
  getRecentActivity,
);

/**
 * =========================
 * STUDENT DASHBOARD
 * =========================
 */

// 👨‍🎓 Student Dashboard
router.get(
  "/student/dashboard",
  protect,
  authorizeRoles("student"),
  studentDashboardStats,
);

export default router;
