import {
  FaHotel,
  FaUser,
  FaBed,
  FaClipboardList,
  FaMoneyBill,
} from "react-icons/fa";

const DASHBOARD_CONFIG = {
  admin: {
    label: "Admin Dashboard",
    menuItems: [
      { label: "Dashboard", icon: FaHotel, link: "/dashboard" },
      {
        label: "New Requests",
        icon: FaMoneyBill,
        link: "/dashboard/admin/Requests",
      },

      {
        label: "Manage Students",
        icon: FaUser,
        link: "/dashboard/admin/Allstudents",
      },
      {
        label: "Notices",
        icon: FaClipboardList,
        link: "/dashboard/admin/Notices",
      },
      { label: "Manage Rooms", icon: FaBed, link: "/dashboard/admin/rooms" },
      // ADMIN
      {
        label: "Complaints",
        icon: FaClipboardList,
        link: "/dashboard/admin/complaints",
      },
      {
        label: "Allocation",
        icon: FaClipboardList,
        link: "/dashboard/admin/bookings",
      },
      {
        label: "Payments",
        icon: FaMoneyBill,
        link: "/dashboard/admin/payments",
      },
    ],
  },

  student: {
    label: "Student Dashboard",
    menuItems: [
      { label: "Dashboard", icon: FaHotel, link: "/dashboard" },
      { label: "My Profile", icon: FaUser, link: "/dashboard/profile" },
      // { label: "My Room", icon: FaBed, link: "/student/room" },
      // {
      //   label: "My Bookings",
      //   icon: FaClipboardList,
      //   link: "/student/bookings",
      // },

      {
        label: "Notices",
        icon: FaMoneyBill,
        link: "/dashboard/student/notices",
      },
      // STUDENT
      {
        label: "Complaints",
        icon: FaClipboardList,
        link: "/dashboard/student/complaints",
      },
      { label: "Fees", icon: FaMoneyBill, link: "/dashboard/student/fees" },
    ],
  },
};

export default DASHBOARD_CONFIG;
