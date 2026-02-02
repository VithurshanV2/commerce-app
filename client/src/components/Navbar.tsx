import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) return null;

  const { userData, setIsLoggedIn, setUserData } = context;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Commerce App</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-gray-600">{userData?.name}</span>
            <span className="text-gray-600 text-sm">{userData?.email}</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
