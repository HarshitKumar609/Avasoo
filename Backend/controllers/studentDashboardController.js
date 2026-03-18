import Student from "../Models/Student.js";
import Complaint from "../Models/Complaint.js";
import Notice from "../Models/Notice.js";
import RoomAllocation from "../Models/RoomAllocation.js";
import Activity from "../Models/Activity.js";

export const studentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1️⃣ Fetch student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 2️⃣ Fetch active room allocation
    const allocation = await RoomAllocation.findOne({
      student: studentId,
      active: true,
    }).populate("room");

    // 3️⃣ Run everything in parallel 🚀
    const [pendingComplaints, noticesCount, recentNotices, activities] =
      await Promise.all([
        Complaint.countDocuments({
          studentId: studentId,
          status: "Pending",
        }),

        Notice.countDocuments(),

        Notice.find()
          .sort({ createdAt: -1 })
          .limit(3)
          .select("title createdAt"),

        // 🔥 FIXED ACTIVITY
        Activity.find({
          $or: [{ user: studentId }, { type: "notice" }],
        })
          .populate("user", "name") // ✅ FIX
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    // 4️⃣ Response
    res.status(200).json({
      success: true,
      data: {
        room: allocation?.room
          ? {
              roomNumber: allocation.room.roomNumber,
              block: allocation.room.block,
              floor: allocation.room.floor,
              capacity: allocation.room.capacity,
            }
          : null,

        complaints: {
          pending: pendingComplaints,
        },

        notices: {
          total: noticesCount,
          recent: recentNotices,
        },

        fees: {
          status: student.feesStatus || "Due",
        },

        // 🔥 FINAL ACTIVITY
        activity: activities,
      },
    });
  } catch (error) {
    console.error("Student dashboard error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
