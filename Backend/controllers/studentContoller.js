import Student from "../Models/Student.js";
import jwt from "jsonwebtoken";
import RoomAllocation from "../Models/roomAllocation.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

/**
 * =========================
 * ADMIN - GET ALL STUDENTS
 * =========================
 */
export const getAllStudents = async (req, res) => {
  try {
    // (optional) role protection
    if (req.user && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    // fetch students (exclude password always)
    const students = await Student.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // fetch active room allocations
    const allocations = await RoomAllocation.find({ active: true })
      .populate("room", "roomNumber block")
      .lean();

    // map studentId -> room
    const roomMap = {};
    allocations.forEach((a) => {
      roomMap[a.student.toString()] = a.room;
    });

    // attach room to student
    const formattedStudents = students.map((s) => ({
      ...s,
      room: roomMap[s._id.toString()] || null,
    }));

    res.status(200).json({
      success: true,
      count: formattedStudents.length,
      students: formattedStudents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/**
 * =========================
 * ADMIN CREATES STUDENT
 * =========================
 */
export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, course, parentName, parentPhone } = req.body;

    if (!name || !email || !phone || !course || !parentName || !parentPhone) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    const student = await Student.create({
      name,
      email,
      phone,
      course,
      parentName,
      parentPhone,
      isActive: false,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * =========================
 * STUDENT ACTIVATION
 * =========================
 */
export const activateStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const student = await Student.findOne({ email, isActive: false }).select(
      "+password",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No inactive student found with this email",
      });
    }

    student.password = password;
    student.isActive = true;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Student account activated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * =========================
 * STUDENT LOGIN
 * =========================
 */
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const student = await Student.findOne({ email, isActive: true }).select(
      "+password",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or inactive account",
      });
    }

    const isPasswordMatch = await student.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    student.password = undefined;

    res.status(200).json({
      success: true,
      message: "Student logged in successfully",
      token,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Students only" });
    }

    const student = await Student.findById(req.user.id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const profileUpdate = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { name, phone, gender, course, parentName, parentPhone } = req.body;

    const updateData = {
      name,
      phone,
      gender,
      course,
      parentName,
      parentPhone,
    };

    // remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    // handle profile image upload
    if (req.file?.path) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);

      if (!uploadedImage?.url) {
        return res.status(400).json({
          success: false,
          message: "Profile image upload failed",
        });
      }

      updateData.profileImage = uploadedImage.url;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
