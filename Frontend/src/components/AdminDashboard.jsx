import React, { useContext, useEffect } from "react";
import {
  FiUsers,
  FiAlertCircle,
  FiBell,
  FiHome,
  FiPlusCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import DashBoardStatusContext from "../Context/DashBoardStatus/DashBoardStatusContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { dashboardData, loading, getDashboardStats } = useContext(
    DashBoardStatusContext,
  );

  useEffect(() => {
    getDashboardStats();
  }, []);

  const ActionButton = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition"
    >
      <span className="text-indigo-600 dark:text-indigo-400 text-lg">
        {icon}
      </span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 rounded-2xl bg-linear-to-r from-slate-900 to-slate-700 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-slate-300">
          Manage students, rooms, and hostel activities
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Students"
          value={loading ? "..." : dashboardData.totalStudents}
          icon={<FiUsers />}
          accent="indigo"
        />
        <StatCard
          title="Active Complaints"
          value={loading ? "..." : dashboardData.activeComplaints}
          icon={<FiAlertCircle />}
          accent="rose"
        />
        <StatCard
          title="New Notices"
          value={loading ? "..." : dashboardData.totalNotices}
          icon={<FiBell />}
          accent="blue"
        />
        <StatCard
          title="Rooms Occupied"
          value={
            loading ? "..." : `${dashboardData.rooms.occupancyPercentage}%`
          }
          icon={<FiHome />}
          accent="emerald"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="section-title">Quick Actions</h2>

          <div className="mt-4 space-y-3">
            <ActionButton
              icon={<FiPlusCircle />}
              label="Add Student"
              onClick={() => navigate("/dashboard/admin/Allstudents")}
            />
            <ActionButton
              icon={<FiUsers />}
              label="View Students"
              onClick={() => navigate("/dashboard/admin/Allstudents")}
            />
            <ActionButton
              icon={<FiAlertCircle />}
              label="Manage Complaints"
              onClick={() => navigate("/dashboard/admin/complaints")}
            />
            <ActionButton
              icon={<FiBell />}
              label="All Notices"
              onClick={() => navigate("/dashboard/admin/Notices")}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="section-title">Recent Activity</h2>

          <ul className="mt-4 space-y-4">
            <ActivityItem
              text="New student added to Block B"
              time="10 mins ago"
            />
            <ActivityItem
              text="Complaint resolved (Room A-102)"
              time="1 hour ago"
            />
            <ActivityItem
              text="Notice posted: Mess timing updated"
              time="Yesterday"
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

/* ================= Components ================= */

const StatCard = ({ title, value, icon, accent }) => {
  const accents = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    rose: "text-rose-600 dark:text-rose-400",
    blue: "text-blue-600 dark:text-blue-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="glass-card p-5 hover:scale-[1.02] transition-transform">
      <div className={`mb-3 ${accents[accent]} text-xl`}>{icon}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
        {value}
      </h3>
    </div>
  );
};

const ActionButton = ({ icon, label }) => (
  <button className="flex items-center gap-3 w-full rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition">
    <span className="text-indigo-600 dark:text-indigo-400 text-lg">{icon}</span>
    {label}
  </button>
);

const ActivityItem = ({ text, time }) => (
  <li className="flex justify-between items-center rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition">
    <span className="text-gray-700 dark:text-gray-200">{text}</span>
    <span className="text-xs text-gray-400">{time}</span>
  </li>
);
