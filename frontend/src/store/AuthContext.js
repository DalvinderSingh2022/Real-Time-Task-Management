import { createContext, useReducer } from 'react';

const initialState = {
    user: null,
    authenticated: false,
    verified: false,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload.user, authenticated: true, verified: true };
        case 'LOGOUT':
            return { user: null, authenticated: false, verified: true };
        case 'VERIFY':
            return { ...state, verified: true };
        default:
            return state;
    }
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, initialState);

    const login = (user) => {
        dispatch({ type: 'LOGIN', payload: { user } });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const verify = () => {
        dispatch({ type: 'VERIFY' });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, verify }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };