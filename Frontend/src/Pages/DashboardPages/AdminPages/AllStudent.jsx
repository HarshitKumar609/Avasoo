import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiPlus,
  FiUsers,
} from "react-icons/fi";
import AdminAuthContext from "../../../Context/AdminAuthContext/AdminAuthContext";

/* ================= Main ================= */

const AllStudent = () => {
  const { getAllStudents } = useContext(AdminAuthContext);

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [openStudentId, setOpenStudentId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH STUDENTS ================= */

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);

      const data = await getAllStudents({
        search,
        status,
        page: 1,
        limit: 50,
      });

      if (data?.students) {
        setStudents(data.students);
      }

      setLoading(false);
    };

    fetchStudents();
  }, [search, status, getAllStudents]);

  /* ================= Local Filter ================= */

  const filteredStudents = useMemo(() => students, [students]);

  const toggleDrawer = (id) => {
    setOpenStudentId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            All Students
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage hostel students and room allocations
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <FiPlus />
          Add Student
        </button>
      </div>

      {/* Search + Filter */}
      <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone"
            className="
              w-full pl-10 pr-4 py-2 rounded-lg
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              border border-gray-200 dark:border-white/10
              focus:outline-none focus:ring-2 focus:ring-indigo-500
            "
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            px-4 py-2 rounded-lg
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            border border-gray-200 dark:border-white/10
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 py-6">
          Loading students...
        </div>
      )}

      {/* Desktop Table */}
      {!loading && (
        <div className="hidden lg:block glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              <tr>
                <Th>Student</Th>
                <Th>Contact</Th>
                <Th>Course</Th>
                <Th>Room</Th>
                <Th>Status</Th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((s) => (
                <React.Fragment key={s._id}>
                  <tr
                    onClick={() => toggleDrawer(s._id)}
                    className="cursor-pointer border-t border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <Td>
                      <div className="flex items-center gap-3">
                        <FiUser />
                        <div>
                          <p className="font-medium">{s.name}</p>
                        </div>
                      </div>
                    </Td>

                    <Td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FiMail className="text-xs" />
                          {s.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <FiPhone className="text-xs" />
                          {s.phone}
                        </div>
                      </div>
                    </Td>

                    <Td>{s.course || "—"}</Td>

                    <Td>
                      {s.room ? (
                        <span className="flex items-center gap-1">
                          <FiHome /> {s.room.roomNumber || s.room}
                        </span>
                      ) : (
                        "Not allocated"
                      )}
                    </Td>

                    <Td>
                      <StatusBadge active={s.isActive} />
                    </Td>
                  </tr>

                  {openStudentId === s._id && (
                    <tr className="bg-gray-50 dark:bg-white/5">
                      <td colSpan={5} className="px-5 py-4">
                        <div className="flex items-center gap-6 text-sm">
                          <FiUsers className="text-indigo-500" />
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Parent Name
                            </p>
                            <p className="font-medium">{s.parentName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Parent Phone
                            </p>
                            <p className="font-medium">{s.parentPhone}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Student Modal */}
      {showModal && <CreateStudentModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AllStudent;

/* ================= Modal (ONLY NEW CODE) ================= */

const CreateStudentModal = ({ onClose }) => {
  const { createStudent } = useContext(AdminAuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    parentName: "",
    parentPhone: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const res = await createStudent(form);
    if (res) onClose();
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-lg rounded-2xl p-6
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100
          shadow-xl border border-gray-200 dark:border-white/10
          animate-scaleIn
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">Add Student</h2>

          <button
            onClick={onClose}
            className="
              p-2 rounded-lg
              text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-200
              hover:bg-gray-100 dark:hover:bg-white/10
              transition
            "
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Student Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <Input
            label="Course"
            name="course"
            value={form.course}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Parent Name"
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
            />
            <Input
              label="Parent Phone"
              name="parentPhone"
              value={form.parentPhone}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 rounded-lg
                border border-gray-300 dark:border-white/10
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-white/10
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="
                px-5 py-2 rounded-lg
                bg-indigo-600 text-white
                hover:bg-indigo-700
                disabled:opacity-60 disabled:cursor-not-allowed
                transition
              "
            >
              {submitting ? "Creating..." : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ================= Helpers ================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
      {label}
    </label>
    <input
      {...props}
      className="
        w-full px-4 py-2 rounded-lg
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-white/10
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
    />
  </div>
);

const Th = ({ children }) => (
  <th className="px-5 py-3 text-left font-medium">{children}</th>
);

const Td = ({ children }) => (
  <td className="px-5 py-4 text-gray-700 dark:text-gray-200">{children}</td>
);

const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
      active
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
        : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
    }`}
  >
    {active ? <FiCheckCircle /> : <FiXCircle />}
    {active ? "Active" : "Inactive"}
  </span>
);
