import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
// import logoLogin from "../assets/logo-login.png"
import api from '../utils/axios';
import logo from "../assets/logo.png"
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', formData);

      if (response.data.requires2FA) {
        setTempToken(response.data.tempToken);
        setShow2FA(true);
        toast.info('Please enter your 2FA code', {
          style: { fontFamily: 'Inter, sans-serif' }
        });
      } else {
        const { user, token } = response.data;
        dispatch(setCredentials({ user, token }));
        localStorage.setItem('token', token);
        toast.success("Login successful!", {
          style: { fontFamily: 'Inter, sans-serif' }
        });
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      toast.error(error.response?.data?.message || 'Login failed', {
        style: { fontFamily: 'Inter, sans-serif' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login/verify-2fa', {
        tempToken,
        code: twoFactorCode
      });

      const { user, token } = response.data;
      dispatch(setCredentials({ user, token }));
      localStorage.setItem('token', token);
      toast.success("Login successful!", {
        style: { fontFamily: 'Inter, sans-serif' }
      });
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || '2FA verification failed');
      toast.error(error.response?.data?.message || '2FA verification failed', {
        style: { fontFamily: 'Inter, sans-serif' }
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    alert('Google login clicked');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>

        <div className="space-y-4">
          {!show2FA ? (
            <>
              {error && (
                <div className="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">Continue with Google</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-400">or</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                  />
                </div>

                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              {error && (
                <div className="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Authentication Code
                </label>
                <input
                  id="twoFactorCode"
                  type="text"
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShow2FA(false);
                  setTempToken('');
                  setTwoFactorCode('');
                  setError('');
                }}
                className="w-full text-sm text-gray-600 hover:text-black transition-colors"
              >
                Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 