import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard_layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto px-10 py-8 spacey-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard_layout;
