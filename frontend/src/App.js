import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login/Login";
import ChatRoom from "./components/Chat/ChatRoom";


function AppContent() {
  const { user } = useAuth();
  return user ? <ChatRoom /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
