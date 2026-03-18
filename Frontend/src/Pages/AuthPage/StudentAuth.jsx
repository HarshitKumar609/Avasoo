import React, { useContext, useState, useEffect } from "react";
import StudentAuthContext from "../../Context/StudentAuthContext/StudentAuthContext";
import { useNavigate } from "react-router-dom";

const StudentAuth = () => {
  const { studentLogin, activateStudent, resetPassword, isAuthenticated } =
    useContext(StudentAuthContext);

  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); // ✅ new
  const [loading, setLoading] = useState(false);

  // RESET FORM
  useEffect(() => {
    setEmail("");
    setPassword("");
    setNewPassword("");
  }, [mode]);

  // REDIRECT
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    await studentLogin({ email, password });
    setLoading(false);
  };

  // ACTIVATE
  const handleActivate = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    await activateStudent({ email, password });
    alert("Account activated! Please login.");
    setMode("login");
    setLoading(false);
  };

  // RESET PASSWORD ✅
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setLoading(true);
    await resetPassword(email, newPassword);
    setLoading(false);

    setMode("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">
          Student Portal
        </h2>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Login or activate your account
        </p>

        <AuthTabs mode={mode} setMode={setMode} />

        {/* LOGIN */}
        {mode === "login" && (
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode("reset")} // ✅ changed
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <PrimaryButton loading={loading}>Login</PrimaryButton>
          </form>
        )}

        {/* ACTIVATE */}
        {mode === "activate" && (
          <form className="space-y-4" onSubmit={handleActivate}>
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Set Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PrimaryButton loading={loading}>Activate Account</PrimaryButton>
          </form>
        )}

        {/* RESET PASSWORD  */}
        {mode === "reset" && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <PrimaryButton loading={loading}>Reset Password</PrimaryButton>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-sm text-blue-500 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

/* ========================= UI ========================= */

const AuthTabs = ({ mode, setMode }) => (
  <div className="relative flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
    <div
      className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)]
      rounded-lg bg-white dark:bg-gray-900 shadow transition-transform duration-300
      ${mode === "activate" ? "translate-x-full" : "translate-x-0"}`}
    />

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

const Tab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-lg
    ${active ? "text-blue-600" : "text-gray-600"}`}
  >
    {label}
  </button>
);

const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 border rounded-lg"
    />
  </div>
);

const PrimaryButton = ({ children, loading }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full py-2 bg-blue-600 text-white rounded-lg"
  >
    {loading ? "Please wait..." : children}
  </button>
);

export default StudentAuth;
