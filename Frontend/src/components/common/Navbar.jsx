import {
  FaHome,
  FaBuilding,
  FaBell,
  FaSignInAlt,
  FaMoon,
  FaSun,
  FaBed,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import AuthResolverContext from "../../Context/AuthResolverContext";
import StudentAuthContext from "../../Context/StudentAuthContext/StudentAuthContext";
import AdminAuthContext from "../../Context/AdminAuthContext/AdminAuthContext";

const Navbar = ({ darkMode, toggleMode }) => {
  const { user, role } = useContext(AuthResolverContext);

  const { logout: studentLogout } = useContext(StudentAuthContext);
  const { logout: adminLogout } = useContext(AdminAuthContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (role === "admin") adminLogout();
    if (role === "student") studentLogout();
    setMobileMenuOpen(false);
  };

  const navbarClass = `
    fixed top-5 left-1/2 z-50 w-[90%] max-w-6xl -translate-x-1/2
    rounded-2xl px-6 py-4 flex items-center justify-between
    shadow-xl transition-colors duration-500 backdrop-blur-xl
    ${
      darkMode
        ? "bg-slate-900/80 border border-white/10"
        : "bg-white/70 border border-white/30"
    }
  `;

  const menuItems = [
    { icon: <FaHome />, label: "Home", link: "/#home" },
    { icon: <FaBuilding />, label: "Facilities", link: "/#facilities" },
    // { icon: <FaBell />, label: "Notices", link: "/#notices" },
    { icon: <FaBed />, label: "All Rooms", link: "/all-rooms" },
  ];

  return (
    <motion.nav
      className={navbarClass}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-2 font-bold text-xl  Invert-cursor-text ${
          darkMode ? "text-white" : "text-slate-900"
        }`}
      >
        <img className="h-10 w-10 rounded-full " src="/Logo.jpeg" alt="Logo" />
        Avasoo
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8">
        {menuItems.map((item) => (
          <motion.div
            key={item.label}
            className={`flex items-center gap-2 cursor-pointer transition-all ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
            whileHover={{ scale: 1.1, color: "#14b8a6" }}
          >
            <Link
              to={item.link}
              className="flex items-center gap-1  Invert-cursor-text"
            >
              {item.icon} {item.label}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile Burger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg transition ${
            darkMode
              ? "text-white hover:bg-white/10"
              : "text-slate-800 hover:bg-black/10"
          }`}
        >
          {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Desktop Auth */}
        {!user ? (
          <Link
            to="/auth/student"
            className={`hidden md:flex items-center gap-2 transition-colors  Invert-cursor-text${
              darkMode
                ? "text-gray-200 hover:text-teal-400"
                : "text-gray-700 hover:text-teal-600"
            }`}
          >
            <FaSignInAlt /> Login
          </Link>
        ) : (
          <div className="hidden md:flex gap-3 items-center  Invert-cursor-text">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 transition-colors ${
                darkMode
                  ? "text-gray-200 hover:text-teal-400"
                  : "text-gray-700 hover:text-teal-600"
              }`}
            >
              <FaSignInAlt /> Logout
            </button>

            <Link
              to="/dashboard"
              className="bg-blue-500 dark:bg-blue-600 rounded-md text-white px-4 py-2 hover:bg-blue-600 dark:hover:bg-blue-700 transition  Invert-cursor-text"
            >
              Dashboard
            </Link>
          </div>
        )}

        {/* Desktop Dark Mode */}
        <motion.button
          onClick={toggleMode}
          className={`hidden md:flex ml-2 p-2 rounded-full transition-colors  Invert-cursor-text ${
            darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`md:hidden absolute top-full left-0 mt-4 w-full rounded-2xl p-6 shadow-xl
            ${
              darkMode
                ? "bg-slate-900/95 text-white"
                : "bg-white/95 text-slate-800"
            }
          `}
        >
          <div className="flex flex-col gap-5">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.link}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg hover:text-teal-500 transition"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* Mobile Dark Mode */}
            <button
              onClick={() => {
                toggleMode();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-lg  hover:text-yellow-400 transition"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {/* Mobile Auth */}
            {!user ? (
              <Link
                to="/auth/student"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg hover:text-teal-500 transition"
              >
                <FaSignInAlt /> Login
              </Link>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-lg hover:text-teal-500 transition"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-lg hover:text-red-400 transition"
                >
                  <FaSignInAlt /> Logout
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
