import React from "react";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";

const MainLayout = ({ toggleMode, darkMode }) => {
  return (
    <>
      <Navbar toggleMode={toggleMode} darkMode={darkMode} />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
