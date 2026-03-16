import express from "express";
import {
  submitEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
} from "../controllers/enquiryController.js";
import { protect, authorizeRoles } from "../middleware/Protect.js";

const router = express.Router();

router.post("/", submitEnquiry); // Public
router.get("/", protect, authorizeRoles("admin"), getAllEnquiries); // Admin
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateEnquiryStatus,
); // Admin

export default router;
