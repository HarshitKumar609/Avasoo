// components/Sidebar.jsx
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import DASHBOARD_CONFIG from "./DashboardConfig.js";
import AuthResolverContext from "../../Context/AuthResolverContext.jsx";

const Sidebar = () => {
  const { user } = useContext(AuthResolverContext);

  const dashboard = user?.role ? DASHBOARD_CONFIG[user.role] : null;

  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  if (!user || !dashboard) {
    return null;
  }

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <>
      {/* Mobile Burger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-5 left-5 z-50 p-2 rounded-lg bg-slate-900 text-white"
      >
        <FaBars size={20} />
      </button>

      {/* Overlay (mobile only) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50 h-screen w-64 flex flex-col
          bg-slate-900 text-white transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Top */}
        <a
          href="/"
          className="flex items-center justify-between gap-3 px-6 py-5 border-b border-slate-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src="/Logo.jpeg"
                alt="Logo"
                className="w-full h-full object-cover scale-125"
              />
            </div>
            <h1 className="text-lg font-bold tracking-wide">Avasoo</h1>
          </div>

          {/* Close button (mobile only) */}
          <button onClick={() => setMobileOpen(false)} className="md:hidden">
            <FaTimes />
          </button>
        </a>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-3">
            {dashboard.menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition"
                >
                  <span className="text-lg">
                    <item.icon />
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-slate-700">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.profilepic || "/Logo.png"}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 transition"
          >
            <span className="text-sm">
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>
            {darkMode ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
