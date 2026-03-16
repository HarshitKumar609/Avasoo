import React, { useContext, useEffect, useState } from "react";
import AdminAuthContext from "../../Context/AdminAuthContext/AdminAuthContext";
import { useNavigate } from "react-router-dom";
const AdminAuth = () => {
  const { adminLogin, isAuthenticated } = useContext(AdminAuthContext);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    adminLogin({ email, password });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">
          Admin Access
        </h2>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Authorized personnel only
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            label="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <PrimaryButton color="red">Login as Admin</PrimaryButton>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Restricted area
          </p>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, type = "text", placeholder = "", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const PrimaryButton = ({ children, color }) => {
  const colors = {
    red: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      className={`w-full py-2 rounded-lg text-white font-semibold transition ${colors[color]}`}
    >
      {children}
    </button>
  );
};

export default AdminAuth;
