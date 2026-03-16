import { useState, useEffect } from "react";
import DashBoardStatusContext from "./DashBoardStatusContext";

const HOST = import.meta.env.VITE_URL;

const DashBoardStatusState = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeComplaints: 0,
    totalNotices: 0,
    rooms: {
      totalCapacity: 0,
      totalOccupied: 0,
      occupancyPercentage: 0,
    },
  });

  const getDashboardStats = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${HOST}/api/dashboardStatus`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard stats");
      }

      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto load on mount
  useEffect(() => {
    getDashboardStats();
  }, []);

  return (
    <DashBoardStatusContext.Provider
      value={{
        dashboardData,
        loading,
        getDashboardStats,
      }}
    >
      {children}
    </DashBoardStatusContext.Provider>
  );
};

export default DashBoardStatusState;
