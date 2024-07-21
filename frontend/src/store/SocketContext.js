import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('https://task-manager-v4zl.onrender.com/');

const initialState = {
    socket,
    connected: false,
};

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socketState, setSocketState] = useState(initialState);

    useEffect(() => {
        socket.on('connect', () => {
            setSocketState({ ...socketState, connected: true });
        });

        socket.on('disconnect', () => {
            setSocketState({ ...socketState, connected: false });
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socketState]);

    return (
        <SocketContext.Provider value={{ socketState, socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, SocketContext };