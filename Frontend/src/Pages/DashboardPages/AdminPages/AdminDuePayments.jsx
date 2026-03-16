import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_URL;
const AdminDuePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/payments/due-soon?daysAhead=7`,
        );
        const data = await res.json();
        if (data.success) setPayments(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-700 dark:text-gray-200">
        Loading...
      </div>
    );

  const today = new Date();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Upcoming / Overdue Payments
      </h2>

      {payments.length === 0 ? (
        <div className="text-gray-700 dark:text-gray-300">
          No upcoming payments.
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => {
            const dueDate = new Date(p.dueDate || `${p.year}-${p.month}-01`);
            const isOverdue = dueDate < today;

            return (
              <div
                key={p._id}
                className={`border rounded p-4 flex justify-between items-center
                           ${
                             isOverdue
                               ? "bg-red-100 dark:bg-red-800 border-red-300 dark:border-red-700"
                               : "bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700"
                           }`}
              >
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {p.student.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {p.student.email}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    ₹{p.amount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {p.month}/{p.year}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDuePayments;
