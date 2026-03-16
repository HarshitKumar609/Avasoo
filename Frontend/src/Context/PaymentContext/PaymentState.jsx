import React, { useState, useCallback } from "react";
import PaymentContext from "./PaymentContext";

const API_BASE = import.meta.env.VITE_URL;

const PaymentState = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [history, setHistory] = useState([]); // <-- new state for history
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * ============================
   * GET STUDENT PAYMENTS
   * ============================
   */
  const getStudentPayments = useCallback(async (studentId) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/payments/student/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch payments");
      }

      if (data.success) {
        setPayments(data.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ============================
   * GET STUDENT PAYMENT HISTORY
   * ============================
   */
  const getStudentPaymentHistory = useCallback(async (studentId) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_BASE}/api/payments/student/history/${studentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch payment history");
      }

      if (data.success) {
        setHistory(data.data); // <-- save the history
      }
    } catch (err) {
      setError(err.message || "Failed to fetch payment history");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ============================
   * CREATE STRIPE PAYMENT INTENT
   * ============================
   */
  const createStripePaymentIntent = async ({ studentId, month, year }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/payments/stripe/intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, month, year }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment initialization failed");
      }

      return {
        clientSecret: data.clientSecret,
        paymentId: data.paymentId,
      };
    } catch (err) {
      setError(err.message || "Payment initialization failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        loading,
        error,
        getStudentPayments,
        getStudentPaymentHistory,
        createStripePaymentIntent,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentState;
