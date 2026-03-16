import { useReducer } from "react";
import NoticeContext from "./NoticeContext";
import noticeReducer from "./NoticeReducer";

const NoticeState = ({ children }) => {
  const initialState = {
    notices: [],
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(noticeReducer, initialState);

  const API_URL = "http://localhost:3000/api/notice";

  // 🔹 helper
  const authHeader = (token) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  // ================= GET =================
  const getNotices = async (token) => {
    if (!token) return;

    try {
      dispatch({ type: "SET_LOADING" });

      const res = await fetch(API_URL, {
        headers: authHeader(token),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch notices");
      }

      const data = await res.json();
      dispatch({ type: "GET_NOTICES", payload: data.notices || [] });
    } catch (err) {
      dispatch({
        type: "NOTICE_ERROR",
        payload: err.message || "Fetch failed",
      });
    }
  };

  // ================= CREATE =================
  const createNotice = async (form, token) => {
    if (!token) return;

    try {
      dispatch({ type: "SET_LOADING" });

      const res = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

      const data = await res.json();
      dispatch({ type: "CREATE_NOTICE", payload: data.notice });
    } catch (err) {
      dispatch({
        type: "NOTICE_ERROR",
        payload: err.message || "Create failed",
      });
    }
  };

  // ================= UPDATE =================
  const updateNotice = async (id, form, token) => {
    if (!token) return;

    try {
      dispatch({ type: "SET_LOADING" });

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeader(token),
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Update failed");
      }

      const data = await res.json();
      dispatch({ type: "UPDATE_NOTICE", payload: data.notice });
    } catch (err) {
      dispatch({
        type: "NOTICE_ERROR",
        payload: err.message || "Update failed",
      });
    }
  };

  // ================= DELETE =================
  const deleteNotice = async (id, token) => {
    if (!token) return;

    try {
      dispatch({ type: "SET_LOADING" });

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeader(token),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Delete failed");
      }

      dispatch({ type: "DELETE_NOTICE", payload: id });
    } catch (err) {
      dispatch({
        type: "NOTICE_ERROR",
        payload: err.message || "Delete failed",
      });
    }
  };

  return (
    <NoticeContext.Provider
      value={{
        notices: state.notices,
        loading: state.loading,
        error: state.error,
        getNotices,
        createNotice,
        updateNotice,
        deleteNotice,
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
};

export default NoticeState;
