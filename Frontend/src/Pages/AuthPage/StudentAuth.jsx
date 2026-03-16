import React, { useContext, useState, useEffect } from "react";
import StudentAuthContext from "../../Context/StudentAuthContext/StudentAuthContext";
import { useNavigate } from "react-router-dom";

const StudentAuth = () => {
  const { token, studentLogin, activateStudent, isAuthenticated } =
    useContext(StudentAuthContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    studentLogin({ email, password });
  };

  const handleActivate = (e) => {
    e.preventDefault();
    activateStudent({ email, password });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">
          Student Portal
        </h2>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Login or activate your account
        </p>

        {/* Tabs */}
        <AuthTabs mode={mode} setMode={setMode} />

        {/* Forms */}
        {mode === "login" && (
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              label="Email"
              placeholder="Eg: student@hostel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PrimaryButton color="blue">Login</PrimaryButton>
          </form>
        )}

        {mode === "activate" && (
          <form className="space-y-4" onSubmit={handleActivate}>
            <Input
              label="Email"
              placeholder="Eg: student@hostel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Set Password"
              type="password"
              placeholder="Set a new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PrimaryButton color="blue">Activate Account</PrimaryButton>
          </form>
        )}
      </div>
    </div>
  );
};

const AuthTabs = ({ mode, setMode }) => {
  return (
    <div className="relative flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 overflow-hidden">
      {/* Sliding Indicator */}
      <div
        className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)]
        rounded-lg bg-white dark:bg-gray-900 shadow transition-transform duration-300 ease-in-out
        ${mode === "activate" ? "translate-x-full" : "translate-x-0"}`}
      />

      {/* Tabs */}
      <Tab
        label="Login"
        active={mode === "login"}
        onClick={() => setMode("login")}
      />
      <Tab
        label="Activate"
        active={mode === "activate"}
        onClick={() => setMode("activate")}
      />
    </div>
  );
};

const Tab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-300
      ${
        active
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400"
      }`}
  >
    {label}
  </button>
);

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
    blue: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <button
      type="submit"
      className={`w-full py-2 rounded-lg text-white font-semibold transition ${colors[color]}`}
    >
      {children}
    </button>
  );
};

export default StudentAuth;
