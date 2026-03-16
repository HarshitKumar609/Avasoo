import React, { useContext, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import NoticeContext from "../../../Context/Notice/NoticeContext";
import StudentAuthContext from "../../../Context/StudentAuthContext/StudentAuthContext";

const StudentNotices = () => {
  const { token } = useContext(StudentAuthContext);
  const { notices, loading, error, getNotices } = useContext(NoticeContext);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (token) getNotices(token);
  }, [token]);

  // 🔍 SEARCH + SORT
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
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-gray-100">
        Notices
      </h1>

      {/* SEARCH + FILTER */}
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

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Loading notices...
        </p>
      )}

      {/* ERROR */}
      {error && <p className="text-center text-red-500">{error}</p>}

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
              Posted on {new Date(n.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && filteredNotices.length === 0 && (
        <p className="text-center mt-10 text-gray-600 dark:text-gray-400">
          No notices found.
        </p>
      )}
    </div>
  );
};

export default StudentNotices;
