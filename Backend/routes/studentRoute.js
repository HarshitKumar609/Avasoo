import express from "express";
import { authorizeRoles, protect } from "../middleware/Protect.js";
import {
  activateStudent,
  createStudent,
  studentLogin,
  getStudentProfile,
  getAllStudents,
  profileUpdate,
} from "../controllers/studentContoller.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/createstudent", protect, authorizeRoles("admin"), createStudent);
router.post("/signup", activateStudent);
router.post("/login", studentLogin);
router.get("/allstudents", protect, authorizeRoles("admin"), getAllStudents);
router.get("/me", protect, authorizeRoles("student"), getStudentProfile);
router.patch(
  "/profile",
  protect,
  authorizeRoles("student"),
  upload.single("profileImage"),
  profileUpdate,
);

export default router;
