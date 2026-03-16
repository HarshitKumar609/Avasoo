import express from "express";
import { dashboardStats } from "../controllers/adminDashboardController.js";
import { protect, authorizeRoles } from "../middleware/Protect.js";

import { studentDashboardStats } from "../controllers/studentDashboardController.js";

const router = express.Router();

// Dashboard stats route
router.get("/", protect, authorizeRoles("admin"), dashboardStats);

//for student dashboard
router.get(
  "/student/dashboard",
  protect,
  authorizeRoles("student"),
  studentDashboardStats,
);

export default router;
