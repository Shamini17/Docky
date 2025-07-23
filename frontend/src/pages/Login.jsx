import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ role }) {
  console.log('Login component rendered with role:', role);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted with:', form, 'role:', role);
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login/${role}`, form);
      if (res.data && res.data.user) {
        localStorage.setItem('token', res.data.token || '');
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        console.log('Login response user:', res.data.user);
        if (role === 'admin') {
          window.location.href = '/admin';
        } else {
          console.log('Redirecting to /dashboard after login');
          window.location.href = '/dashboard';
        }
      } else {
        setError('Login failed. No user data returned.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
      if (role !== 'admin') {
        setTimeout(() => navigate('/signup'), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative font-sans">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80)' }} />
      <div className="absolute inset-0 z-10 bg-black/50" />
      {/* Centered card */}
      <div className="relative z-20 w-full max-w-md p-8 md:p-10 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-md flex flex-col gap-6">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-2">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 shadow-md">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#3B82F6"/><path d="M7 17V7h10v10H7z" fill="#fff"/></svg>
          </span>
        </div>
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-2" style={{ fontFamily: 'Inter, Roboto, sans-serif' }}>
          {role === 'admin' ? 'Admin Login' : 'User Login'}
        </h2>
        <p className="text-center text-gray-600 mb-2">Welcome back! Please sign in to continue.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1 text-gray-700 font-medium">
            Email
          <input
            type="email"
            name="email"
              placeholder="you@email.com"
            value={form.email}
            onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            autoComplete="username"
          />
          </label>
          <label className="flex flex-col gap-1 text-gray-700 font-medium relative">
            Password
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 p-0 m-0 border-none bg-transparent focus:outline-none focus:ring-0"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{ top: '50%' }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.657 0 3.21.41 4.5 1.125M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </label>
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
            disabled={loading}
            aria-busy={loading}
            onClick={() => console.log('Login button clicked')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="text-red-600 text-center font-medium">{error}</p>}
        {role !== 'admin' && (
          <p className="text-center text-sm mt-2 text-blue-700">
            New user? <a href="/signup" className="underline hover:text-blue-900">Sign up here</a>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login; 