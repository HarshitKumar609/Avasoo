import React, { useContext, useEffect, useState } from "react";
import { FiRepeat, FiTrash2, FiPlus, FiUser, FiHome } from "react-icons/fi";

import AdminAuthContext from "../../../Context/AdminAuthContext/AdminAuthContext";
import RoomContext from "../../../Context/RoomContext/RoomContext";
import AllocationContext from "../../../Context/AllocationContext/AllocationContext";

const RoomData = () => {
  const { token, getAllStudents } = useContext(AdminAuthContext);
  const { rooms, getAllRooms } = useContext(RoomContext);
  const {
    allocations = [],
    getAllAllocations,
    allocateRoom,
    reallocateRoom,
    deallocateRoom,
  } = useContext(AllocationContext);

  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("allocate");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (!token) return;

    getAllRooms(token);
    getAllAllocations(token);

    getAllStudents({ limit: 1000 }).then((res) => {
      if (res?.students) setStudents(res.students);
    });
  }, [token]);

  const allocationMap = {};
  (Array.isArray(allocations) ? allocations : [])
    .filter((a) => a.active)
    .forEach((a) => {
      allocationMap[a.student._id] = a;
    });

  const openModal = (student, type) => {
    setMode(type);
    setSelectedStudent(student);
    setRoomId("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success =
      mode === "allocate"
        ? await allocateRoom({ studentId: selectedStudent._id, roomId }, token)
        : await reallocateRoom(
            { studentId: selectedStudent._id, newRoomId: roomId },
            token,
          );

    if (success) {
      setShowModal(false);
      getAllAllocations(token);
      getAllRooms(token);
    }
  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-300">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
        Room Allocations
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => {
          const allocation = allocationMap[student._id];

          return (
            <div
              key={student._id}
              className="rounded-3xl bg-white/90 dark:bg-gray-800/90
                         border border-gray-200 dark:border-gray-700
                         shadow-lg p-6 transition-transform duration-300
                         hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100 text-lg">
                <FiUser className="text-indigo-500" /> {student.name}
              </h3>

              {allocation ? (
                <p className="text-sm mt-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FiHome className="text-green-500" /> Room{" "}
                  {allocation.room.roomNumber}
                </p>
              ) : (
                <p className="text-sm mt-3 text-gray-400 dark:text-gray-500">
                  No room allocated
                </p>
              )}

              <div className="flex gap-3 mt-6">
                {!allocation && (
                  <button
                    onClick={() => openModal(student, "allocate")}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    <FiPlus className="inline mr-1" /> Allocate
                  </button>
                )}

                {allocation && (
                  <>
                    <button
                      onClick={() => openModal(student, "reallocate")}
                      className="flex-1 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      <FiRepeat className="inline mr-1" /> Reallocate
                    </button>

                    <button
                      onClick={async () => {
                        await deallocateRoom(student._id, token);
                        getAllAllocations(token);
                      }}
                      className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      <FiTrash2 className="inline mr-1" /> Deallocate
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          />

          <form
            onSubmit={handleSubmit}
            className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md space-y-5 shadow-2xl transition-all duration-300 transform scale-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {mode} Room
            </h2>

            <select
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Select Room</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  Room {room.roomNumber} - Block {room.block}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all transform hover:scale-105"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoomData;
