import { useContext } from 'react';
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

  const { globalLoading, isLoggedIn, userData } = context;

  const getDefaultRoute = () => {
    if (!isLoggedIn || !userData) return '/login';
    return userData.role === 'Admin' ? '/admin/dashboard' : '/user/items';
  };

  return (
    <div>
      {globalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to={getDefaultRoute()} replace /> : <Login />
          }
        />

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
