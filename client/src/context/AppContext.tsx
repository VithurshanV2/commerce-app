import { createContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userData: User | null;
  setUserData: (value: User | null) => void;
  globalLoading: boolean;
  setGlobalLoading: (value: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Initialize state from localStorage directly
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const [userData, setUserData] = useState<User | null>(() => {
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  const [globalLoading, setGlobalLoading] = useState(false);

  // Save user data to localStorage when it changes
  const handleSetUserData = (user: User | null) => {
    setUserData(user);
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      localStorage.removeItem('userData');
    }
  };

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData: handleSetUserData,
    globalLoading,
    setGlobalLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
