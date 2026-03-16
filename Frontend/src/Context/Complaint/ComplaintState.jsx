import { useReducer } from "react";
import ComplaintContext from "./ComplaintContext";

// Initial State
const initialState = {
  complaints: [],
  loading: true,
  error: null,
};

// Reducer
const complaintReducer = (state, action) => {
  switch (action.type) {
    case "GET_COMPLAINTS_SUCCESS":
      return { ...state, complaints: action.payload, loading: false };
    case "ADD_COMPLAINT":
      return { ...state, complaints: [action.payload, ...state.complaints] };
    case "UPDATE_COMPLAINT":
      return {
        ...state,
        complaints: state.complaints.map((c) =>
          c._id === action.payload._id ? action.payload : c,
        ),
      };
    case "DELETE_COMPLAINT":
      return {
        ...state,
        complaints: state.complaints.filter((c) => c._id !== action.payload),
      };
    case "COMPLAINT_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Provider
const ComplaintState = ({ children }) => {
  const [state, dispatch] = useReducer(complaintReducer, initialState);

  // Actions (examples)
  const setComplaints = (complaints) => {
    dispatch({ type: "GET_COMPLAINTS_SUCCESS", payload: complaints });
  };

  const addComplaint = (complaint) => {
    dispatch({ type: "ADD_COMPLAINT", payload: complaint });
  };

  const updateComplaint = (complaint) => {
    dispatch({ type: "UPDATE_COMPLAINT", payload: complaint });
  };

  const deleteComplaint = (id) => {
    dispatch({ type: "DELETE_COMPLAINT", payload: id });
  };

  const setError = (error) => {
    dispatch({ type: "COMPLAINT_ERROR", payload: error });
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints: state.complaints,
        loading: state.loading,
        error: state.error,
        setComplaints,
        addComplaint,
        updateComplaint,
        deleteComplaint,
        setError,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export default ComplaintState;
