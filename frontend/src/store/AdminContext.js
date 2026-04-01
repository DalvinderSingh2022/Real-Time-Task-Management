import { createContext, useReducer } from "react";

const initialState = {
  members: [],
  loaded: false,
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_DATA":
      return {
        members: action.payload.members,
        loaded: true,
      };

    case "RESET_DATA":
      return initialState;

    default:
      return state;
  }
};

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [adminState, dispatch] = useReducer(adminReducer, initialState);

  const loadData = (members) => {
    dispatch({
      type: "INITIALIZE_DATA",
      payload: { members },
    });
  };

  const resetData = () => {
    dispatch({ type: "RESET_DATA" });
  };

  return (
    <AdminContext.Provider
      value={{
        adminState,
        loadData,
        resetData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminProvider, AdminContext };
