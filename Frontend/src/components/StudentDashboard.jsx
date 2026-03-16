import React, { useContext } from "react";
import { FiHome, FiBell, FiAlertCircle, FiCreditCard } from "react-icons/fi";
import StudentDashboardContext from "../Context/DashBoardStatus/StudentDashboardContext";

const StudentDashboard = () => {
  const { dashboardData, loading } = useContext(StudentDashboardContext);

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-semibold">Welcome back 👋</h1>
        <p className="text-sm text-indigo-100">
          Here’s what’s happening in your hostel today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="My Room"
          value={loading ? "..." : dashboardData?.room?.roomNumber || "—"}
          icon={<FiHome />}
        />
        <StatCard
          title="Complaints"
          value={
            loading
              ? "..."
              : `${dashboardData?.complaints?.pending || 0} Pending`
          }
          icon={<FiAlertCircle />}
          accent="amber"
        />

        <StatCard
          title="Notices"
          value={loading ? "..." : `${dashboardData?.notices?.total || 0} New`}
          icon={<FiBell />}
          accent="blue"
        />
        <StatCard
          title="Fees Status"
          value={loading ? "..." : dashboardData?.fees?.status || "—"}
          icon={<FiCreditCard />}
          accent="emerald"
          pill
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notices */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="section-title">Recent Notices</h2>

          <ul className="mt-4 space-y-4">
            {dashboardData?.notices?.recent?.map((notice) => (
              <NoticeItem
                key={notice._id}
                title={notice.title}
                date={new Date(notice.createdAt).toLocaleDateString()}
              />
            ))}
          </ul>
        </div>

        {/* Room Info */}
        <div className="glass-card p-6">
          <h2 className="section-title">My Room</h2>

          <div className="mt-4 space-y-3 text-sm">
            <InfoRow
              label="Room Number"
              value={dashboardData?.room?.roomNumber || "—"}
            />
            <InfoRow label="Block" value={dashboardData?.room?.block || "—"} />
            <InfoRow label="Floor" value={dashboardData?.room?.floor || "—"} />
            <InfoRow
              label="Capacity"
              value={
                dashboardData?.room?.capacity
                  ? `${dashboardData.room.capacity} Students`
                  : "—"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

/* ================== Components ================== */

const StatCard = ({ title, value, icon, accent = "indigo", pill }) => {
  const accents = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    amber: "text-amber-600 dark:text-amber-400",
    blue: "text-blue-600 dark:text-blue-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="glass-card p-5 hover:scale-[1.02] transition-transform">
      <div className={`mb-3 ${accents[accent]} text-xl`}>{icon}</div>

      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>

      {pill ? (
        <span className="inline-block mt-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {value}
        </span>
      ) : (
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
          {value}
        </h3>
      )}
    </div>
  );
};

const NoticeItem = ({ title, date }) => (
  <li className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition">
    <span className="text-gray-700 dark:text-gray-200">{title}</span>
    <span className="text-xs text-gray-400">{date}</span>
  </li>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-gray-900 dark:text-gray-200 font-medium">
      {value}
    </span>
  </div>
);
