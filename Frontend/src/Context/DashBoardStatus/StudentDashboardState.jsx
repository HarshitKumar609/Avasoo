import { useEffect, useState } from "react";
import StudentDashboardContext from "./StudentDashboardContext";
const HOST = import.meta.env.VITE_URL;

const StudentDashboardState = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const getStudentDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("student_token");
      if (!token) {
        throw new Error("Student token missing");
      }

      const response = await fetch(
        `${HOST}/api/dashboardStatus/student/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ use the same token
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch student dashboard");
      }

      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error("Student dashboard error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentDashboard();
  }, []);

  return (
    <StudentDashboardContext.Provider
      value={{
        dashboardData,
        loading,
        getStudentDashboard,
      }}
    >
      {children}
    </StudentDashboardContext.Provider>
  );
};

export default StudentDashboardState;
