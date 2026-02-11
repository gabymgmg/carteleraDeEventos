import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import OwnerDashboard from './pages/OwnerDashboard';
import CreateEvent from './pages/CreateEvent';

function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password/" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/"
          element={<div className="p-10 text-center text-2xl">Home Page</div>}
        />
        {/* PRIVATE ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          {user?.role === 'admin' && (
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          )}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
