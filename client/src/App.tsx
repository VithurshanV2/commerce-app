import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import { Route, Routes } from 'react-router-dom';

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
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </div>
  );
};

export default App;
