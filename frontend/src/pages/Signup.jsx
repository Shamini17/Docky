import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup({ role }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const signupRes = await axios.post(`/api/auth/signup/${role}`, form);
      console.log('Signup response:', signupRes.data);
      // Only attempt login if signup succeeded
      const loginRes = await axios.post(`/api/auth/login/${role}`, { email: form.email, password: form.password });
      console.log('Login response:', loginRes.data);
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      setMessage('Signup successful! Redirecting...');
      setTimeout(() => {
        navigate(role === 'admin' ? '/admin' : '/user');
      }, 800);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('Email already in use. Please log in.');
      } else {
      setError(err.response?.data?.message || 'Signup failed.');
      }
      // Do NOT attempt login if signup failed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100/80 to-purple-100/80 font-sans px-2">
      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-md flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-2" style={{ fontFamily: 'Inter, Roboto, sans-serif' }}>
          {role === 'admin' ? 'Sign Up as Admin' : 'Sign Up as User'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1 text-gray-700 font-medium">
            Name
          <input
            type="text"
            name="name"
              placeholder="Your name"
            value={form.name}
            onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            autoComplete="name"
          />
          </label>
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
            autoComplete="new-password"
          />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 p-0 m-0 border-none bg-transparent focus:outline-none focus:ring-0"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
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
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        {message && <p className="text-green-600 dark:text-green-400 text-center font-medium">{message}</p>}
        {error && <p className="text-red-500 text-center font-medium">{error}</p>}
      </div>
    </div>
  );
}

export default Signup; 