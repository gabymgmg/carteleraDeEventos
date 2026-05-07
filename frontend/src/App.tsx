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
import EditEvent from './pages/EditEvent';
import PublicDashboard from './pages/PublicDashboard';
import EventDetail from './pages/EventDetail';
import EditUser from './pages/EditUserProfile';
import UserProfile from './pages/UserProfile';
import ChangePassword from './pages/ChangePassword';
import { useState, useEffect, useCallback } from 'react';
import api from './api/axios';
import type { Event } from './types/event';

function App() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch events from the API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      setError(
        'No se pudieron cargar los eventos. Revisa tu conexión o intenta más tarde.'
      );
    } finally {
      setLoading(false);
    }
  }, []);
  // It executes only once
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <PublicDashboard
              allEvents={events}
              loading={loading}
              error={error}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password/" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/event/:id" element={<EventDetail />} />
        {/* PRIVATE ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditUser />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route
            path="/create-event"
            element={<CreateEvent onEventCreated={fetchEvents} />}
          />
          <Route
            path="/edit-event/:id"
            element={<EditEvent onEventUpdated={fetchEvents} />}
          />
          {user?.role === 'admin' && (
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          )}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
