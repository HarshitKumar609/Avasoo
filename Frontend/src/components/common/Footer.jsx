import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 dark:bg-black text-gray-700 dark:text-gray-400 py-6 text-center border-t border-gray-300 dark:border-gray-800 transition-colors duration-300  Invert-cursor-text">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left */}
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()} Avasoo Hostel Management System
        </p>

        {/* Right - Optional links */}
        <div className="flex gap-4 text-sm md:text-base">
          <a
            href="#privacy"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#contact"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
