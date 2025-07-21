import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import AdminDashboard from './pages/AdminDashboard';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  console.log('ProtectedRoute user:', user, 'required role:', role);
  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className={'bg-blue-100 min-h-screen'}>
      {!isLanding && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/user" element={<Login role="user" />} />
        <Route path="/login/admin" element={<Login role="admin" />} />
        <Route path="/signup" element={<Signup role="user" />} />
        <Route path="/signup/user" element={<Signup role="user" />} />
        <Route path="/signup/admin" element={<Signup role="admin" />} />
        <Route path="/user" element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
        <Router>
        <AppContent />
        </Router>
    </AuthProvider>
  );
}

export default App;
