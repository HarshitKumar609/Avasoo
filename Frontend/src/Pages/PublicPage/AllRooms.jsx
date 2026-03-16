import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoomContext from "../../Context/RoomContext/RoomContext";

const AllRooms = () => {
  const { getAvailableRooms, availableRooms, loading } =
    useContext(RoomContext);

  const navigate = useNavigate();

  useEffect(() => {
    getAvailableRooms();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600 dark:text-gray-300">
        Loading rooms...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-20">
      {/* Page Header */}
      <div className="px-6 md:px-20 pt-10 pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
          Available Rooms
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          Browse through available hostel rooms and view complete details before
          applying.
        </p>
      </div>

      {/* Rooms Grid */}
      <div className="px-6 md:px-20 pb-16">
        {availableRooms.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-20">
            No rooms available at the moment.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {availableRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onView={() => navigate(`/rooms/${room._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= ROOM CARD ================= */

const RoomCard = ({ room, onView }) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden transition hover:shadow-xl">
      {/* Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={room.coverImage?.url || "/room-placeholder.jpg"}
          alt={room.roomNumber}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Room {room.roomNumber}
          </h3>
          <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Available
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Block {room.block} • Floor {room.floor}
        </p>

        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-4">
          <span>Capacity: {room.capacity}</span>
          <span>Occupied: {room.occupied}</span>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ₹{room.price}
          </p>

          <button
            onClick={onView}
            className="rounded-lg bg-blue-600 dark:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
