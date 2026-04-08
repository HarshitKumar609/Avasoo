import Student from "../Models/Student.js";
import Complaint from "../Models/Complaint.js";
import Notice from "../Models/Notice.js";
import Room from "../Models/Room.js";

import Activity from "../Models/Activity.js";

// Dashboard Stats
export const dashboardStats = async (req, res) => {
  try {
    const [totalStudents, activeComplaints, totalNotices, roomStats] =
      await Promise.all([
        Student.countDocuments(),
        Complaint.countDocuments({ status: "Pending" }),
        Notice.countDocuments(),
        Room.aggregate([
          {
            $group: {
              _id: null,
              totalCapacity: { $sum: "$capacity" },
              totalOccupied: { $sum: "$occupied" },
            },
          },
        ]),
      ]);

    const totalCapacity = roomStats[0]?.totalCapacity || 0;
    const totalOccupied = roomStats[0]?.totalOccupied || 0;

    const occupancyPercentage =
      totalCapacity === 0
        ? 0
        : Math.round((totalOccupied / totalCapacity) * 10000) / 100;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeComplaints,
        totalNotices,
        rooms: {
          totalCapacity,
          totalOccupied,
          occupancyPercentage,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    let activities;

    // ✅ ADMIN → sees all
    if (req.user.role === "admin") {
      activities = await Activity.find().sort({ createdAt: -1 }).limit(5);
    }

    // ✅ STUDENT → sees only their activity
    else if (req.user.role === "student") {
      activities = await Activity.find({
        user: req.user.id,
      })
        .sort({ createdAt: -1 })
        .limit(5);
    }

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
