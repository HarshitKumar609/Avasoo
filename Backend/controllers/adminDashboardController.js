import Student from "../Models/Student.js";
import Complaint from "../Models/Complaint.js";
import Notice from "../Models/Notice.js";
import Room from "../Models/Room.js";

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

// Recent activity
export const getRecentActivity = async (req, res) => {
  try {
    // fetch latest 10 activities: students, complaints, notices
    const students = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const complaints = await Complaint.find({ status: "active" })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();
    const notices = await Notice.find().sort({ createdAt: -1 }).limit(5).lean();

    const activities = [];

    students.forEach((s) =>
      activities.push({
        text: `New student added: ${s.name}`,
        time: s.createdAt,
      }),
    );
    complaints.forEach((c) =>
      activities.push({
        text: `Complaint active: ${c.title}`,
        time: c.updatedAt,
      }),
    );
    notices.forEach((n) =>
      activities.push({ text: `Notice posted: ${n.title}`, time: n.createdAt }),
    );

    // sort by time descending
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({ activities: activities.slice(0, 10) }); // latest 10
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
