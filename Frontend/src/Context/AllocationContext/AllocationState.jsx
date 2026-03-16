import React, { useReducer } from "react";
import AllocationContext from "./AllocationContext";

const HOST = import.meta.env.VITE_URL;

const initialState = {
  allocations: [],
  loading: false,
  error: null,
};

const allocationReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "GET_ALLOCATIONS":
      return {
        ...state,
        allocations: Array.isArray(action.payload) ? action.payload : [], // ✅ GUARANTEED ARRAY
        loading: false,
        error: null,
      };

    case "ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

const AllocationState = ({ children }) => {
  const [state, dispatch] = useReducer(allocationReducer, initialState);

  /* =====================
   * GET ALL ALLOCATIONS
   * ===================== */
  const getAllAllocations = async (token) => {
    try {
      dispatch({ type: "SET_LOADING" });

      const res = await fetch(`${HOST}/api/allocations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch allocations");
      }

      // ✅ BACKEND RETURNS { success, data }
      dispatch({
        type: "GET_ALLOCATIONS",
        payload: data.data || [],
      });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.message || "Server error",
      });
    }
  };

  /* =====================
   * ALLOCATE ROOM
   * ===================== */
  const allocateRoom = async ({ studentId, roomId }, token) => {
    try {
      const res = await fetch(`${HOST}/api/allocations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId, roomId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Allocation failed");
      }

      return true;
    } catch (err) {
      console.error("Allocate error:", err.message);
      return false;
    }
  };

  /* =====================
   * REALLOCATE ROOM
   * ===================== */
  const reallocateRoom = async ({ studentId, newRoomId }, token) => {
    try {
      const res = await fetch(`${HOST}/api/allocations/reallocate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId, newRoomId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Reallocation failed");
      }

      return true;
    } catch (err) {
      console.error("Reallocate error:", err.message);
      return false;
    }
  };

  /* =====================
   * DEALLOCATE ROOM
   * ===================== */
  const deallocateRoom = async (studentId, token) => {
    try {
      const res = await fetch(`${HOST}/api/allocations/${studentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Deallocation failed");
      }

      return true;
    } catch (err) {
      console.error("Deallocate error:", err.message);
      return false;
    }
  };

  return (
    <AllocationContext.Provider
      value={{
        allocations: state.allocations, // ✅ ALWAYS ARRAY
        loading: state.loading,
        error: state.error,
        getAllAllocations,
        allocateRoom,
        reallocateRoom,
        deallocateRoom,
      }}
    >
      {children}
    </AllocationContext.Provider>
  );
};

export default AllocationState;
