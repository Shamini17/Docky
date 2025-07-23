import { useState, useEffect } from 'react';
import axios from 'axios';
import SubmissionsTable from '../components/SubmissionsTable';
import AdminFiltersBar from '../components/AdminFiltersBar';
import DeadlineManager from '../components/DeadlineManager';
import Toast from '../components/Toast';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ docType: '', from: '', to: '', search: '' });
  const [deadline, setDeadline] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (e) {
    user = null;
  }
  if (!user || !user.name) {
    return (
      <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#4f46e5] via-[#a21caf] to-[#18181b] font-sans">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-indigo-700">You are not logged in or admin info is missing/corrupted.</h1>
          <a href="/" className="text-indigo-600 hover:underline font-medium">Go to Login</a>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchSubmissions();
    fetchUsers();
    fetchDeadline();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get('/api/uploads');
      setSubmissions(res.data);
    } catch (err) {
      setSubmissions([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const fetchDeadline = async () => {
    setDeadline(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
  };

  const handleDelete = async (submission) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/uploads/${submission.id}`);
      setToast({ message: 'Submission deleted.', type: 'success' });
      fetchSubmissions();
    } catch (err) {
      setToast({ message: 'Delete failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeadlineUpdate = async (newDeadline) => {
    setLoading(true);
    try {
      setDeadline(newDeadline);
      setToast({ message: 'Deadline updated.', type: 'success' });
    } catch (err) {
      setToast({ message: 'Deadline update failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Map user_email to user name for each submission
  const submissionsWithNames = submissions.map(sub => {
    const foundUser = users.find(u => u.email === sub.user_email);
    return { ...sub, userName: foundUser ? foundUser.name : '-' };
  });

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#4f46e5] via-[#a21caf] to-[#18181b] py-10 px-2 font-sans">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center mb-8">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-2 font-poppins">Admin Dashboard</h1>
        {user && user.name && <h2 className="text-xl font-semibold text-center text-indigo-900 mb-4">Welcome, {user.name}!</h2>}
        <div className="w-full border-t border-gray-200 my-4" />
        <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">Document Submission</h2>
        <DeadlineManager deadline={deadline} onUpdate={handleDeadlineUpdate} loading={loading} />
        <AdminFiltersBar onFilterChange={setFilters} />
        <SubmissionsTable submissions={submissionsWithNames} filters={filters} onDelete={handleDelete} />
      </div>
    </div>
  );
} 