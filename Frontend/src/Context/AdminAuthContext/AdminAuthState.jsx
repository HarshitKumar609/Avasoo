import React, { useState, useEffect, useCallback } from "react";
import AdminAuthContext from "./AdminAuthContext";
import toast from "react-hot-toast";

const HOST = import.meta.env.VITE_URL;
const TOKEN_KEY = "admin_token";

const AdminAuthState = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =====================
   * LOGOUT
   * ===================== */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    toast.success("Logged out successfully");
  }, []);

  /* =====================
   * LOAD ADMIN ON REFRESH
   * ===================== */
  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${HOST}/api/admin/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.admin) {
        setUser(data.admin);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  /* =====================
   * ADMIN LOGIN
   * ===================== */
  const adminLogin = async ({ email, password }) => {
    try {
      const res = await fetch(`${HOST}/api/admin/auth/login`, {
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
      setUser(data.admin);
      setIsAuthenticated(true);

      toast.success("Login successful");
    } catch {
      toast.error("Server error");
    }
  };

  /* =====================
   * CREATE STUDENT
   * ===================== */
  const createStudent = async (studentData) => {
    try {
      const res = await fetch(`${HOST}/api/student/auth/createstudent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create student");
        return null;
      }

      toast.success("Student created successfully");
      return data.student;
    } catch {
      toast.error("Server error");
      return null;
    }
  };

  /* =====================
   * GET ALL STUDENTS (ADMIN)
   * ===================== */
  const getAllStudents = async ({
    search = "",
    status = "all",
    page = 1,
    limit = 10,
  } = {}) => {
    try {
      const query = new URLSearchParams({
        search,
        status,
        page,
        limit,
      }).toString();

      const res = await fetch(`${HOST}/api/student/auth/allstudents?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch students");
        return null;
      }

      return data;
      /*
        expected backend response:
        {
          success,
          count,
          totalPages,
          currentPage,
          students
        }
      */
    } catch {
      toast.error("Server error");
      return null;
    }
  };

  /* =====================
   * INIT
   * ===================== */
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        adminLogin,
        logout,
        createStudent,
        getAllStudents,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthState;
