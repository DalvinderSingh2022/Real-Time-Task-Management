import { AuthProvider } from './AuthContext';
import { SocketProvider } from './SocketContext';
import { TasksProvider } from './TasksContext';
import { UsersProvider } from './UsersContext';

const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <UsersProvider>
                <TasksProvider>
                    <SocketProvider>
                        {children}
                    </SocketProvider>
                </TasksProvider>
            </UsersProvider>
        </AuthProvider>
    );
};

export default AppProvider;