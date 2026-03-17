// FeePayment.jsx
import React, { useContext, useEffect, useState } from "react";
import PaymentContext from "../../../Context/PaymentContext/PaymentContext";
import StudentAuthContext from "../../../Context/StudentAuthContext/StudentAuthContext";
import CheckoutForm from "./CheckoutForm";

const FeePayment = () => {
  const {
    payments,
    history, // <-- added history state
    loading,
    error,
    getStudentPayments,
    getStudentPaymentHistory, // <-- added history function
    createStripePaymentIntent,
  } = useContext(PaymentContext);

  const { user } = useContext(StudentAuthContext);

  const [clientSecret, setClientSecret] = useState(null);
  const [activePayment, setActivePayment] = useState(null);
  const [success, setSuccess] = useState("");
  const [showHistory, setShowHistory] = useState(false); // <-- toggle history

  const studentId = user?._id;

  useEffect(() => {
    if (studentId) getStudentPayments(studentId);
  }, [studentId, getStudentPayments]);

  const startPayment = async (payment) => {
    const res = await createStripePaymentIntent({
      studentId,
      month: payment.month,
      year: payment.year,
    });

    setClientSecret(res.clientSecret);
    setActivePayment(payment._id);
  };

  const fetchHistory = async () => {
    if (studentId) {
      await getStudentPaymentHistory(studentId);
      setShowHistory(true);
    }
  };

  const duePayments = payments.filter((p) => p.status === "due");

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-10
                    text-gray-900 dark:text-gray-100"
    >
      <h2 className="text-3xl font-bold mb-6">Hostel Fee Payments</h2>

      {success && (
        <div
          className="mb-4 p-4 rounded
                        bg-green-100 text-green-700
                        dark:bg-green-900 dark:text-green-200"
        >
          {success}
        </div>
      )}

      {/* Due Payments */}
      {duePayments.map((payment) => (
        <div
          key={payment._id}
          className="border rounded-xl p-6 mb-6
                     bg-white border-gray-200
                     dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">
              {payment.month}/{payment.year}
            </span>
            <span className="font-bold">₹{payment.amount}</span>
          </div>

          {activePayment === payment._id ? (
            <CheckoutForm
              clientSecret={clientSecret}
              onSuccess={() => {
                setSuccess("Payment successful 🎉");
                setClientSecret(null);
                setActivePayment(null);
                getStudentPayments(studentId);
              }}
            />
          ) : (
            <button
              onClick={() => startPayment(payment)}
              className="w-full py-2 rounded font-medium
                         bg-indigo-600 text-white
                         hover:bg-indigo-700
                         dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Pay Now
            </button>
          )}
        </div>
      ))}

      {/* History Button */}
      <button
        onClick={fetchHistory}
        className="w-full py-2 rounded font-medium
                   bg-gray-300 text-gray-800
                   hover:bg-gray-400 mt-4
                   dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      >
        Show Payment History
      </button>

      {/* Payment History */}
      {showHistory && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Payment History</h3>
          {(history?.length || 0) > 0 ? (
            history.map((p) => (
              <div
                key={p._id}
                className="border rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex justify-between">
                  <span>
                    {p.month}/{p.year} - {p.room?.name || "Room"}
                  </span>
                  <span>₹{p.amount}</span>
                </div>
                <div className="text-sm mt-1">
                  Status:{" "}
                  <span
                    className={
                      p.status === "paid"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {p.status.toUpperCase()}
                  </span>
                </div>
                {p.paidAt && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Paid At: {new Date(p.paidAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              No payment history found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeePayment;
