import { AuthProvider } from './AuthContext';
import { TasksProvider } from './TasksContext';
import { UsersProvider } from './UsersContext';

const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <UsersProvider>
                <TasksProvider>
                    {children}
                </TasksProvider>
            </UsersProvider>
        </AuthProvider>
    );
};

export default AppProvider;