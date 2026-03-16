import React, { useState, useCallback } from "react";
import RoomContext from "./RoomContext";
import toast from "react-hot-toast";

const HOST = import.meta.env.VITE_URL;

const RoomState = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [singleRoom, setSingleRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= GET ALL ROOMS (ADMIN) ================= */
  const getAllRooms = useCallback(async (token) => {
    setLoading(true);
    try {
      const res = await fetch(`${HOST}/api/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message || "Failed to fetch rooms");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= GET AVAILABLE ROOMS (PUBLIC) ================= */
  const getAvailableRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${HOST}/api/rooms/available`);
      const data = await res.json();

      if (res.ok) {
        setAvailableRooms(data.rooms);
      } else {
        toast.error(data.message || "Failed to load rooms");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= GET ROOM BY ID ================= */
  const getRoomById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${HOST}/api/rooms/${id}`);
      const data = await res.json();

      if (res.ok) {
        setSingleRoom(data.room);
      } else {
        toast.error(data.message || "Room not found");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= CREATE ROOM ================= */
  const createRoom = async (formData, token) => {
    try {
      const res = await fetch(`${HOST}/api/rooms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Room creation failed");
        return false;
      }

      toast.success("Room created successfully");
      setRooms((prev) => [...prev, data.room]);
      return true;
    } catch {
      toast.error("Server error");
      return false;
    }
  };

  /* ================= UPDATE ROOM ================= */
  const updateRoom = async (id, formData, token) => {
    try {
      const res = await fetch(`${HOST}/api/rooms/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Room update failed");
        return false;
      }

      toast.success("Room updated successfully");

      setRooms((prev) =>
        prev.map((room) => (room._id === id ? data.room : room)),
      );

      return true;
    } catch {
      toast.error("Server error");
      return false;
    }
  };

  /* ================= DELETE ROOM ================= */
  const deleteRoom = async (id, token) => {
    try {
      const res = await fetch(`${HOST}/api/rooms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success("Room deleted successfully");
      setRooms((prev) => prev.filter((room) => room._id !== id));
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        availableRooms,
        room: singleRoom,
        loading,
        getAllRooms,
        getAvailableRooms,
        getRoomById,
        createRoom,
        updateRoom,
        deleteRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomState;
