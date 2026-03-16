import React, { useContext } from "react";
import {
  FaSignInAlt,
  FaUserShield,
  FaUserGraduate,
  FaBell,
} from "react-icons/fa";
import { MdMeetingRoom, MdPayments, MdReportProblem } from "react-icons/md";
import hostelImg from "../assets/Hostelimg.png";
import { Link } from "react-router-dom";
import AuthResolverContext from "../Context/AuthResolverContext";

const notices = [
  {
    id: 1,
    title: "Room Maintenance",
    content: "Water supply will be off tomorrow from 10AM to 2PM.",
  },
  {
    id: 2,
    title: "Monthly Fee Reminder",
    content: "Please pay hostel fees for February by 28th Jan.",
  },
  {
    id: 3,
    title: "Hostel Event",
    content:
      "Annual hostel cultural event on 15th Feb, participation is mandatory.",
  },
];

const Frontpage = () => {
  const { user, role } = useContext(AuthResolverContext);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero */}
      <section className="relative h-[90vh] w-full " id="home">
        <img
          src={hostelImg}
          alt="Hostel"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 dark:bg-black/70" />

        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Avasoo</h1>
          <p className="mt-4 max-w-xl text-lg text-gray-300">
            A complete hostel management system for students and administration.
          </p>

          {user ? (
            <Link
              to="/dashboard"
              className="mt-6 w-fit inline-flex items-center gap-3 rounded-lg bg-blue-500 dark:bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition"
            >
              {role === "admin" ? <FaUserShield /> : <FaUserGraduate />}
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/auth/student"
              className="mt-6 w-fit inline-flex items-center gap-3 rounded-lg bg-blue-500 dark:bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition"
            >
              <FaSignInAlt />
              Login to Portal
            </Link>
          )}
        </div>
      </section>
      {/* Notices
      <section
        className="py-16 px-6 md:px-20 bg-gray-100 dark:bg-gray-900"
        id="notices"
      >
        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2">
          <FaBell /> Hostel Notices
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} {...notice} />
          ))}
        </div>
      </section> */}
      {/* Features */}
      <section
        className="py-16 px-6 md:px-20 bg-gray-100 dark:bg-gray-900"
        id="facilities"
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Hostel Management Made Easy
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <Feature
            icon={<MdMeetingRoom />}
            title="Room Management"
            desc="Admins can create, update, and allocate hostel rooms efficiently."
          />
          <Feature
            icon={<MdPayments />}
            title="Fee & Payments"
            desc="Students can view fee details and payment status transparently."
          />
          <Feature
            icon={<MdReportProblem />}
            title="Complaints & Notices"
            desc="Raise complaints, view notices, and stay informed at all times."
          />
        </div>
      </section>
      {/* How it works */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="grid gap-8 md:grid-cols-3 text-center">
          <Step number="1" text="Login First" />
          <Step number="2" text="Access your dashboard" />
          <Step number="3" text="Manage hostel services" />
        </div>
      </section>
      {/* Roles */}
      <section className="py-16 px-6 md:px-20 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">User Roles</h2>

        <div className="grid gap-8 md:grid-cols-2">
          <RoleCard
            icon={<FaUserShield />}
            title="Admin"
            points={[
              "Manage rooms & allocations",
              "Publish notices",
              "Handle complaints",
              "Monitor payments",
            ]}
          />
          <RoleCard
            icon={<FaUserGraduate />}
            title="Student"
            points={[
              "View room details",
              "Check fee status",
              "Raise complaints",
              "Access hostel notices",
            ]}
          />
        </div>
      </section>
    </div>
  );
};

/* Components */

const Feature = ({ icon, title, desc }) => (
  <div className="rounded-xl bg-white dark:bg-gray-800 p-6 text-center shadow-md border hover:border-blue-500 transition">
    <div className="text-4xl text-blue-500 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{desc}</p>
  </div>
);

const Step = ({ number, text }) => (
  <div>
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
      {number}
    </div>
    <p className="text-gray-600 dark:text-gray-400">{text}</p>
  </div>
);

const RoleCard = ({ icon, title, points }) => (
  <div className="rounded-xl bg-white dark:bg-gray-800 p-8 shadow-md border">
    <div className="flex items-center gap-4 mb-4">
      <div className="text-3xl text-blue-500">{icon}</div>
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
      {points.map((point, i) => (
        <li key={i}>{point}</li>
      ))}
    </ul>
  </div>
);

// const NoticeCard = ({ title, content }) => (
//   <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md border hover:border-blue-500 transition">
//     <h3 className="text-xl font-semibold mb-2">{title}</h3>
//     <p className="text-gray-600 dark:text-gray-400">{content}</p>
//   </div>
// );

export default Frontpage;
