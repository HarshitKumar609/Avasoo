import React, { useContext, useEffect, useState } from "react";
import { FiCheck, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import ComplaintContext from "../../../Context/Complaint/ComplaintContext";
import AdminAuthContext from "../../../Context/AdminAuthContext/AdminAuthContext";

const AdminComplaints = () => {
  const { token } = useContext(AdminAuthContext);
  const { complaints, setComplaints, updateComplaint } =
    useContext(ComplaintContext);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const API_URL = import.meta.env.VITE_URL;

  // Fetch all complaints (admin only)
  useEffect(() => {
    if (!token) return;

    const fetchComplaints = async () => {
      try {
        const res = await fetch(`${API_URL}/api/complaints`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch complaints");
        setComplaints(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchComplaints();
  }, [token]);

  // Resolve complaint
  const handleResolve = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/complaints/${id}/resolve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to resolve complaint");

      updateComplaint(data);
      toast.success("Complaint resolved");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Search + sort
  const filtered = complaints
    .filter(
      (c) =>
        c.subject.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt),
    );

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">
        Student Complaints
      </h1>

      {/* SEARCH + SORT */}
      <div
        className="mb-6 flex flex-col md:flex-row gap-4 rounded-3xl p-5 backdrop-blur-xl
        bg-white/70 dark:bg-gray-900/70
        border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints..."
            className="w-full pl-11 pr-4 py-3 rounded-xl
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 rounded-xl
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* COMPLAINT GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div
            key={c._id}
            className="rounded-3xl p-6 backdrop-blur-xl
              bg-white/70 dark:bg-gray-900/70
              border border-gray-200 dark:border-gray-700
              shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {c.subject}
            </h3>

            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300">
              {c.description}
            </p>

            <p className="text-xs mt-4 text-gray-500 dark:text-gray-400">
              Student: {c.studentId?.name} ({c.studentId?.rollNo})
            </p>

            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              Status:{" "}
              <span
                className={`font-semibold ${
                  c.status === "Resolved"
                    ? "text-green-600 dark:text-green-400"
                    : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {c.status}
              </span>
            </p>

            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              Created: {new Date(c.createdAt).toLocaleDateString()}
            </p>

            {/* RESOLVE BUTTON ONLY */}
            {c.status === "Pending" && (
              <button
                onClick={() => handleResolve(c._id)}
                className="mt-5 flex items-center gap-2
                  text-green-600 dark:text-green-400
                  hover:text-green-700 font-semibold"
              >
                <FiCheck /> Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminComplaints;
