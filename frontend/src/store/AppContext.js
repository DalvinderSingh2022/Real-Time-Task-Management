import { AuthProvider } from './AuthContext';
import { TasksProvider } from './TasksContext';

const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <TasksProvider>
                {children}
            </TasksProvider>
        </AuthProvider>
    );
};

export default AppProvider;