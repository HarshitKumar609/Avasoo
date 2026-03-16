import express from "express";
import { protect, authorizeRoles } from "../middleware/Protect.js";
import {
  allocateRoom,
  deallocateRoom,
  reallocateRoom,
  getAllAllocations,
  getStudentAllocation,
} from "../controllers/allocationController.js";

const router = express.Router();

// Admin: manage allocations
router.post("/", protect, authorizeRoles("admin"), allocateRoom);
router.put("/reallocate", protect, authorizeRoles("admin"), reallocateRoom);
router.delete("/:studentId", protect, authorizeRoles("admin"), deallocateRoom);
router.get("/", protect, authorizeRoles("admin"), getAllAllocations);

// Admin / Student: view allocation
router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("admin", "student"),
  getStudentAllocation,
);

export default router;
