import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';
import { assets } from '../assets/assets';
import axiosInstance from '../config/axiosInstance';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  const [state, setState] = useState<'Login' | 'Sign Up'>('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!context) return null;

  const {
    backendUrl,
    setIsLoggedIn,
    setUserData,
    globalLoading,
    setGlobalLoading,
  } = context;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setGlobalLoading(true);

      if (state === 'Sign Up') {
        const { data } = await axiosInstance.post('/api/auth/register', {
          name,
          email,
          password,
          roleId: 2,
        });

        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setUserData(data.user);
        toast.success(data.message || 'Registration successful!');
        navigate('/user/items');
      } else {
        const { data } = await axiosInstance.post('/api/auth/login', {
          email,
          password,
        });

        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setUserData(data.user);
        toast.success(data.message || 'Login successful!');

        if (data.user.role === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/items');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 px-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
        </h2>

        <p className="text-center text-gray-600 mb-6">
          {state === 'Sign Up'
            ? 'Register for Commerce App'
            : 'Login to continue'}
        </p>

        <form onSubmit={handleSubmit}>
          {state === 'Sign Up' && (
            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={globalLoading}
            className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {globalLoading ? 'Loading...' : state}
          </button>

          <div className="flex items-center my-4">
            <hr className="grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <hr className="grow border-gray-300" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) {
                  toast.error('No Google credential received');
                  return;
                }

                try {
                  setGlobalLoading(true);

                  const { data } = await axiosInstance.post(
                    '/api/auth/google-login',
                    { googleToken: credentialResponse.credential }
                  );

                  localStorage.setItem('token', data.token);
                  setIsLoggedIn(true);
                  setUserData(data.user);

                  toast.success(data.message);
                  navigate('/user/items');
                } catch (err: any) {
                  toast.error(
                    err.response?.data?.message || 'Google login failed'
                  );
                } finally {
                  setGlobalLoading(false);
                }
              }}
              onError={() => toast.error('Google login failed')}
            />
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {state === 'Sign Up' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className="text-blue-600 cursor-pointer hover:underline font-medium"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className="text-blue-600 cursor-pointer hover:underline font-medium"
              >
                Sign up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
