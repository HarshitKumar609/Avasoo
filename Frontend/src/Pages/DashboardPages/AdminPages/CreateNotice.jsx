import React, { useContext, useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from "react-icons/fi";
import NoticeContext from "../../../Context/Notice/NoticeContext";
import AdminAuthContext from "../../../Context/AdminAuthContext/AdminAuthContext";

const CreateNotice = () => {
  const { token } = useContext(AdminAuthContext);
  const {
    notices,
    loading,
    error,
    getNotices,
    createNotice,
    updateNotice,
    deleteNotice,
  } = useContext(NoticeContext);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", message: "" });

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (token) getNotices(token);
  }, [token]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", message: "" });
    setShowModal(true);
  };

  const openEdit = (n) => {
    setEditing(n);
    setForm({ title: n.title, message: n.message });
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    editing
      ? await updateNotice(editing._id, form, token)
      : await createNotice(form, token);
    setShowModal(false);
  };

  // 🔍 SEARCH + FILTER
  const filteredNotices = notices
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt),
    );

  return (
    <div className="min-h-screen p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Admin Notices
        </h1>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2 rounded-xl
          bg-indigo-600 hover:bg-indigo-700 text-white font-medium
          transition-all hover:scale-105"
        >
          <FiPlus /> New Notice
        </button>
      </div>

      {/* SEARCH + FILTER BAR */}
      <div
        className="mb-8 flex flex-col md:flex-row gap-4
        rounded-3xl p-5 backdrop-blur-xl
        bg-white/70 dark:bg-gray-900/70
        border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        {/* SEARCH */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices..."
            className="w-full pl-11 pr-4 py-3 rounded-xl
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* SORT */}
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

      {/* NOTICE GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotices.map((n) => (
          <div
            key={n._id}
            className="rounded-3xl p-6 backdrop-blur-xl
            bg-white/70 dark:bg-gray-900/70
            border border-gray-200 dark:border-gray-700
            shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {n.title}
            </h3>

            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300">
              {n.message}
            </p>

            <p className="text-xs mt-4 text-gray-500 dark:text-gray-400">
              Created: {new Date(n.createdAt).toLocaleDateString()}
            </p>

            <div className="flex gap-4 mt-5">
              <button
                onClick={() => openEdit(n)}
                className="text-yellow-500 hover:text-yellow-600"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => deleteNotice(n._id, token)}
                className="text-red-500 hover:text-red-600"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL (unchanged, already good) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <form
            onSubmit={submit}
            className="relative w-full max-w-lg p-8 rounded-3xl
            bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
            border border-gray-200 dark:border-gray-700 shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {editing ? "Edit Notice" : "New Notice"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FiX className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Notice title"
              required
              className="w-full p-3 rounded-xl bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-gray-100"
            />

            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              placeholder="Notice message"
              required
              className="w-full p-3 rounded-xl bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-gray-100"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600
              hover:bg-indigo-700 text-white font-semibold transition"
            >
              {loading ? "Saving..." : "Save Notice"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateNotice;
