import { createContext, useReducer } from 'react';

const initialState = {
    users: [],
    loaded: false
};

const usersReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_USERS':
            return { users: action.payload.users, loaded: true }
        case 'ADD_USER':
            return { ...state, users: [...state.users, action.payload.user] };
        case 'DELETE_USER':
            return { ...state, users: state.users.filter((user) => user._id !== action.payload.userId) };
        case 'RESET_USERS':
            return initialState
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map((user) => {
                    if (user._id === action.payload.user._id) {
                        return { ...action.payload.user };
                    }
                    return user;
                })
            };
        default:
            return state;
    }
};

const UsersContext = createContext();

const UsersProvider = ({ children }) => {
    const [usersState, dispatch] = useReducer(usersReducer, initialState);

    const loadUsers = (users) => {
        dispatch({ type: 'LOAD_USERS', payload: { users } });
    };

    const addUser = (user) => {
        dispatch({ type: 'ADD_USER', payload: { user } });
    };

    const deleteUser = (userId) => {
        dispatch({ type: 'DELETE_USER', payload: { userId } });
    };

    const updateUser = (user) => {
        dispatch({ type: 'UPDATE_USER', payload: { user } });
    };

    const resetUsers = () => {
        dispatch({ type: 'RESET_USERS' });
    };

    return (
        <UsersContext.Provider value={{ usersState, loadUsers, deleteUser, addUser, updateUser, resetUsers }}>
            {children}
        </UsersContext.Provider>
    );
};

export { UsersProvider, UsersContext };