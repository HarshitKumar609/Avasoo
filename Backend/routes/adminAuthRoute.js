import express from "express";
import {
  adminLogin,
  getAdminProfile,
} from "../controllers/adminAuthController.js";
import { protect, authorizeRoles } from "../middleware/Protect.js";

const router = express.Router();

// Auth
router.post("/login", adminLogin);

// Profile
router.get("/me", protect, authorizeRoles("admin"), getAdminProfile);

export default router;
