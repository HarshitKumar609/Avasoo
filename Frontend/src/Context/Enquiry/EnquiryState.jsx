import { useState } from "react";
import EnquiryContext from "../Enquiry/EnquiryContext";

const EnquiryState = ({ children }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Backend base URL from env
  const BASE_URL = import.meta.env.VITE_URL;
  const API_URL = `${BASE_URL}/api/enquiry`;

  // =========================
  // 1️⃣ Submit Enquiry (Public)
  // =========================
  const submitEnquiry = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // =========================
  // 2️⃣ Get All Enquiries (Admin)
  // =========================
  const fetchEnquiries = async (token) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔐 protect middleware
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setEnquiries(data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  // =========================
  // 3️⃣ Update Enquiry Status (Admin)
  // =========================
  const updateEnquiryStatus = async (id, status, token, adminNote = "") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔐 admin only
        },
        body: JSON.stringify({ status, adminNote }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry._id === data.data._id ? data.data : enquiry,
        ),
      );

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <EnquiryContext.Provider
      value={{
        enquiries,
        loading,
        error,
        submitEnquiry,
        fetchEnquiries,
        updateEnquiryStatus,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};

export default EnquiryState;
