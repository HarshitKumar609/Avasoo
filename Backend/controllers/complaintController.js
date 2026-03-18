import Complaint from "../Models/Complaint.js";
import { logActivity } from "../utils/logActivity.js";

/* =======================
   STUDENT CONTROLLERS
======================= */

// Create complaint
export const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      studentId: req.user.id,
      subject: req.body.subject,
      description: req.body.description,
    });

    // ✅ FIXED ACTIVITY LOG
    await logActivity(
      `Complaint created: ${complaint.subject}`,
      "complaint",
      req.user.id,
      req.user.role,
    );

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Failed to create complaint" });
  }
};

// Get logged-in student's complaints
export const getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      studentId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

// Update complaint (only if Pending)
export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      studentId: req.user.id,
      status: "Pending",
    });

    if (!complaint)
      return res
        .status(403)
        .json({ message: "You cannot edit this complaint" });

    complaint.subject = req.body.subject;
    complaint.description = req.body.description;
    await complaint.save();

    // ✅ FIXED ACTIVITY LOG
    await logActivity(
      `Complaint updated: ${complaint.subject}`,
      "complaint",
      req.user.id,
      req.user.role,
    );

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Failed to update complaint" });
  }
};

// Delete complaint
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user.id,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // ✅ FIXED ACTIVITY LOG
    await logActivity(
      `Complaint deleted: ${complaint.subject}`,
      "complaint",
      req.user.id,
      req.user.role,
    );

    res.json({ success: true, message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete complaint" });
  }
};

/* =======================
   ADMIN CONTROLLERS
======================= */

// Admin: get all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("studentId", "name email rollNo")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

// Admin: resolve complaint
export const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    complaint.status = "Resolved";
    await complaint.save();

    // ✅ ADMIN ACTIVITY LOG
    await logActivity(
      `Complaint resolved: ${complaint.subject}`,
      "complaint",
      req.user.id,
      req.user.role, // should be "admin"
    );

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Failed to resolve complaint" });
  }
};
