import React, { useContext, useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import ComplaintContext from "../../../Context/Complaint/ComplaintContext";
import StudentAuthContext from "../../../Context/StudentAuthContext/StudentAuthContext";

const StudentComplaints = () => {
  const { token } = useContext(StudentAuthContext);
  const {
    complaints,
    setComplaints,
    addComplaint,
    updateComplaint,
    deleteComplaint,
  } = useContext(ComplaintContext);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ subject: "", description: "" });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_URL;

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!token) return;

    const fetchComplaints = async () => {
      try {
        const res = await fetch(`${API_URL}/api/complaints/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setComplaints(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchComplaints();
  }, [token]);

  /* ================= MODAL ================= */
  const openCreate = () => {
    setEditing(null);
    setForm({ subject: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ subject: c.subject, description: c.description });
    setShowModal(true);
  };

  /* ================= CREATE / UPDATE ================= */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editing
        ? `${API_URL}/api/complaints/${editing._id}`
        : `${API_URL}/api/complaints`;

      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      editing ? updateComplaint(data) : addComplaint(data);
      toast.success(editing ? "Complaint updated" : "Complaint created");
      setShowModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this complaint?")) return;

    try {
      const res = await fetch(`${API_URL}/api/complaints/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      deleteComplaint(id);
      toast.success("Complaint deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ================= FILTER ================= */
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
    <div className="min-h-screen p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          My Complaints
        </h1>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
        >
          <FiPlus /> New Complaint
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints..."
            className="w-full pl-11 p-3 rounded-xl
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            border border-gray-300 dark:border-gray-600"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-3 rounded-xl w-full sm:w-40
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          border border-gray-300 dark:border-gray-600"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div
            key={c._id}
            className="p-6 rounded-3xl
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            shadow"
          >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {c.subject}
            </h3>

            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {c.description}
            </p>

            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Status:{" "}
              <span
                className={
                  c.status === "Resolved"
                    ? "text-green-600 dark:text-green-400 font-semibold"
                    : "text-yellow-600 dark:text-yellow-400 font-semibold"
                }
              >
                {c.status}
              </span>
            </p>

            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Created: {new Date(c.createdAt).toLocaleDateString()}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-4">
              {c.status === "Pending" && (
                <button
                  onClick={() => openEdit(c)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <FiEdit2 />
                </button>
              )}
              <button
                onClick={() => handleDelete(c._id)}
                className="text-red-500 hover:text-red-600"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={submit}
            className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl w-full max-w-lg"
          >
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">
                {editing ? "Edit Complaint" : "New Complaint"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FiX className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject"
              required
              className="w-full p-3 mb-4 rounded-xl
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              border border-gray-300 dark:border-gray-600"
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              placeholder="Description"
              required
              className="w-full p-3 rounded-xl
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              border border-gray-300 dark:border-gray-600"
            />

            <button
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {loading ? "Saving..." : "Save Complaint"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentComplaints;
