import { createContext, useReducer } from 'react';

const initialState = {
    user: {},
    authenticated: false
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload.user, authenticated: true };
        case 'LOGOUT':
            return { user: null, authenticated: false };
        default:
            return state;
    }
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, initialState);

    const login = (user) => {
        console.log(user);
        dispatch({ type: 'LOGIN', payload: { user } });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };