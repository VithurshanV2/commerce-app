import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import UserItems from './pages/user/UserItems';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { globalLoading } = context;

  return (
    <div>
      {globalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/user/items"
          element={
            <ProtectedRoute requiredRole="User">
              <UserItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
