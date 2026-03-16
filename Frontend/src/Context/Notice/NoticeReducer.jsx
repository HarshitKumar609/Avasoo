const noticeReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true, error: null };

    case "GET_NOTICES":
      return {
        ...state,
        notices: action.payload || [],
        loading: false,
      };

    case "CREATE_NOTICE":
      return {
        ...state,
        notices: [action.payload, ...state.notices],
        loading: false,
      };

    case "UPDATE_NOTICE":
      return {
        ...state,
        notices: state.notices.map((n) =>
          n._id === action.payload._id ? action.payload : n,
        ),
        loading: false,
      };

    case "DELETE_NOTICE":
      return {
        ...state,
        notices: state.notices.filter((n) => n._id !== action.payload),
        loading: false,
      };

    case "NOTICE_ERROR":
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default noticeReducer;
