import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Frontpage from "./Pages/Frontpage.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard_layout from "./components/Dashboard/Dashboard_layout";
import Dashboard from "./Pages/Dashboard";
import MainLayout from "./Layouts/MainLayout";
import AuthLayout from "./Layouts/AuthLayout";
import ProfilePage from "./Pages/DashboardPages/CommonPages/ProfilePage";
import AdminAuth from "./Pages/AuthPage/AdminAuth";
import StudentAuth from "./Pages/AuthPage/StudentAuth";
import AllRooms from "./Pages/PublicPage/AllRooms";
import RoomDetails from "./Pages/PublicPage/RoomDetails";
import ScrollToHash from "./components/ScrollToHash.jsx";
import AllStudent from "./Pages/DashboardPages/AdminPages/AllStudent.jsx";
import ManageRoom from "./Pages/DashboardPages/AdminPages/ManageRoom.jsx";
import RoomData from "./Pages/DashboardPages/AdminPages/RoomData.jsx";
import CreateNotice from "./Pages/DashboardPages/AdminPages/CreateNotice.jsx";
import StudentNotices from "./Pages/DashboardPages/StudentPages/StudentNotices.jsx";
import StudentComplaints from "./Pages/DashboardPages/StudentPages/StudentComplaints.jsx";
import AdminComplaints from "./Pages/DashboardPages/AdminPages/AdminComplaints.jsx";
import AdminEnquiries from "./Pages/DashboardPages/AdminPages/AdminEnquiries.jsx";
import InvertCursor from "./components/common/InvertCursor.jsx";
import FeePayment from "./Pages/DashboardPages/StudentPages/FeePayment.jsx";
import AdminDuePayments from "./Pages/DashboardPages/AdminPages/AdminDuePayments.jsx";

function App() {
  // State to track dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={darkMode ? "dark" : "light"} // triggers animation on toggle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen transition-colors duration-500 ${
          darkMode
            ? "bg-gray-950 text-white"
            : "bg-linear-to-br from-teal-200 via-white to-purple-200 text-slate-900"
        }`}
      >
        {/* Navbar receives toggle function */}

        <Router>
          <Toaster position="top-right" reverseOrder={false} />
          <ScrollToHash />
          <InvertCursor />
          <Routes>
            {/*-------------- MainLayout --------------*/}
            <Route
              element={
                <MainLayout toggleMode={toggleMode} darkMode={darkMode} />
              }
            >
              <Route path="/" element={<Frontpage />} />
              <Route path="/all-rooms" element={<AllRooms />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
            </Route>

            {/*--------------AuthLayout-------------- */}
            <Route element={<AuthLayout />}>
              <Route path="/dashboard" element={<Dashboard_layout />}>
                {/* Nested routes for dashboard */}
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<ProfilePage />} />

                {/* Pages Routes */}
                {/* Admin Routes */}
                <Route path="admin/Allstudents" element={<AllStudent />} />
                <Route path="admin/Requests" element={<AdminEnquiries />} />
                <Route path="admin/rooms" element={<ManageRoom />} />
                <Route path="admin/Notices" element={<CreateNotice />} />
                <Route path="admin/bookings" element={<RoomData />} />
                <Route path="admin/complaints" element={<AdminComplaints />} />
                <Route path="admin/payments" element={<AdminDuePayments />} />
                {/* STUDENT */}
                <Route path="student/notices" element={<StudentNotices />} />
                <Route
                  path="student/complaints"
                  element={<StudentComplaints />}
                />
                <Route path="student/fees" element={<FeePayment />} />
              </Route>

              <Route path="/auth/admin" element={<AdminAuth />} />
              <Route path="/auth/student" element={<StudentAuth />} />
            </Route>
          </Routes>
        </Router>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
