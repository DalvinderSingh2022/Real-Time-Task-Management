import { createContext, useReducer, useEffect } from "react";

const initialState = {
  user: null,
  token: null,
  authenticated: false,
  checkingAuth: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticated: true,
        checkingAuth: false,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        authenticated: false,
        checkingAuth: false,
      };

    case "AUTH_CHECK_COMPLETE":
      return {
        ...state,
        checkingAuth: false,
      };

    default:
      return state;
  }
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const login = (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("jwt", token);
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    dispatch({ type: "LOGOUT" });
  };

  const authCheckComplete = () => {
    dispatch({ type: "AUTH_CHECK_COMPLETE" });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      dispatch({
        type: "LOGIN",
        payload: { user: JSON.parse(storedUser) },
      });
    } else {
      dispatch({ type: "AUTH_CHECK_COMPLETE" });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ authState, login, logout, authCheckComplete }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
