import React, { useContext, useMemo } from "react";
import AuthResolverContext from "./AuthResolverContext";
import StudentAuthContext from "./StudentAuthContext/StudentAuthContext";
import AdminAuthContext from "./AdminAuthContext/AdminAuthContext";

const AuthResolverState = ({ children }) => {
  const { user: studentUser, isAuthenticated: studentAuth } =
    useContext(StudentAuthContext);

  const { user: adminUser, isAuthenticated: adminAuth } =
    useContext(AdminAuthContext);

  const value = useMemo(() => {
    if (adminAuth && adminUser) {
      return {
        user: adminUser,
        role: "admin",
        isAuthenticated: true,
      };
    }

    if (studentAuth && studentUser) {
      return {
        user: studentUser,
        role: "student",
        isAuthenticated: true,
      };
    }

    return {
      user: null,
      role: null,
      isAuthenticated: false,
    };
  }, [adminAuth, adminUser, studentAuth, studentUser]);

  return (
    <AuthResolverContext.Provider value={value}>
      {children}
    </AuthResolverContext.Provider>
  );
};

export default AuthResolverState;
