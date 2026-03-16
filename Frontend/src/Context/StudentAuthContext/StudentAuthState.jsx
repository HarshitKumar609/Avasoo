import React, { useState, useEffect, useCallback } from "react";
import StudentAuthContext from "./StudentAuthContext";
import toast from "react-hot-toast";

const HOST = import.meta.env.VITE_URL;
const TOKEN_KEY = "student_token";

const StudentAuthState = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // =====================
  // LOGOUT
  // =====================
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    toast.success("Logged out successfully");
  }, []);

  // =====================
  // LOAD STUDENT ON REFRESH
  // =====================
  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${HOST}/api/student/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.student) {
        setUser(data.student); // ✅ FIXED
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // STUDENT LOGIN
  // =====================
  const studentLogin = async ({ email, password }) => {
    try {
      const res = await fetch(`${HOST}/api/student/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.student);
      setIsAuthenticated(true);

      toast.success("Login successful");
    } catch {
      toast.error("Server error");
    }
  };

  // =====================
  // STUDENT ACTIVATION
  // =====================
  const activateStudent = async ({ email, password }) => {
    try {
      const res = await fetch(`${HOST}/api/student/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Activation failed");
        return;
      }

      toast.success("Account activated successfully");
    } catch {
      toast.error("Server error");
    }
  };

  const updateStudentProfile = async (formData) => {
    try {
      const res = await fetch(`${HOST}/api/student/auth/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`, // ❗ no Content-Type for FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Profile update failed");
        return;
      }

      setUser(data.data); // updated student from backend
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Server error", error);
    }
  };

  // =====================
  // INIT
  // =====================
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <StudentAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        studentLogin,
        activateStudent,
        updateStudentProfile,
        logout,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
};

export default StudentAuthState;
