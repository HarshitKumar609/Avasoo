import { useContext, useEffect, useState } from "react";
import EnquiryContext from "../../../Context/Enquiry/EnquiryContext";

const statusOptions = ["new", "contacted", "visited", "confirmed", "rejected"];

const statusColor = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  contacted:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
  visited:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  confirmed:
    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
};

const AdminEnquiries = () => {
  const { enquiries, loading, error, fetchEnquiries, updateEnquiryStatus } =
    useContext(EnquiryContext);

  const [selectedStatus, setSelectedStatus] = useState({});
  const adminToken = localStorage.getItem("admin_token");

  useEffect(() => {
    fetchEnquiries(adminToken);
  }, []);

  const handleUpdate = (id) => {
    updateEnquiryStatus(
      id,
      selectedStatus[id] || enquiries.find((e) => e._id === id)?.status,
      adminToken,
    );
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Enquiry Management
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Total Requests: {enquiries.length}
        </span>
      </div>

      {/* States */}
      {loading && (
        <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-900">
          Loading enquiries...
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/40 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && enquiries.length === 0 && (
        <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-900">
          No enquiries found
        </div>
      )}

      {/* Desktop Table */}
      {!loading && enquiries.length > 0 && (
        <div className="hidden overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-900 md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="px-5 py-3 text-left">Student</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Message</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry._id} className="border-t dark:border-gray-800">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {enquiry.name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    <p>{enquiry.email || "-"}</p>
                    <p>{enquiry.phone || "-"}</p>
                  </td>

                  <td className="px-5 py-4 max-w-xs truncate text-gray-600 dark:text-gray-300">
                    {enquiry.message || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={selectedStatus[enquiry._id] || enquiry.status}
                      onChange={(e) =>
                        setSelectedStatus({
                          ...selectedStatus,
                          [enquiry._id]: e.target.value,
                        })
                      }
                      className={`rounded-lg px-3 py-1 text-sm font-medium ${statusColor[enquiry.status]} bg-transparent border dark:border-gray-700`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleUpdate(enquiry._id)}
                      className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && enquiries.length > 0 && (
        <div className="space-y-4 md:hidden">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry._id}
              className="rounded-xl bg-white p-4 shadow dark:bg-gray-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {enquiry.name}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[enquiry.status]}`}
                >
                  {enquiry.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {enquiry.email || "-"} | {enquiry.phone || "-"}
              </p>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {enquiry.message || "-"}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <select
                  value={selectedStatus[enquiry._id] || enquiry.status}
                  onChange={(e) =>
                    setSelectedStatus({
                      ...selectedStatus,
                      [enquiry._id]: e.target.value,
                    })
                  }
                  className="flex-1 rounded-lg border px-3 py-1.5 dark:bg-gray-800"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleUpdate(enquiry._id)}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-white"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
