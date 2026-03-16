import React, { useContext } from "react";
import AuthResolverContext from "../Context/AuthResolverContext";
import AdminDashboard from "../components/AdminDashboard";
import StudentDashboard from "../components/StudentDashboard";
import DashBoardStatusState from "../Context/DashBoardStatus/DashBoardStatusState";
import StudentDashboardState from "../Context/DashBoardStatus/StudentDashboardState";

const Dashboard = () => {
  const { user, role } = useContext(AuthResolverContext);

  if (!user) return null;

  return (
    <>
      {role === "admin" && (
        <DashBoardStatusState>
          <AdminDashboard />
        </DashBoardStatusState>
      )}
      {role === "student" && (
        <StudentDashboardState>
          <StudentDashboard />
        </StudentDashboardState>
      )}
    </>
  );
};

export default Dashboard;
