import { useState, useEffect } from 'react';
import axios from 'axios';
import SubmissionsTable from '../components/SubmissionsTable';
import AdminFiltersBar from '../components/AdminFiltersBar';
import DeadlineManager from '../components/DeadlineManager';
import Toast from '../components/Toast';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState({ docType: '', from: '', to: '', search: '' });
  const [deadline, setDeadline] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
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

  const fetchDeadline = async () => {
    // Simulate fetching deadline from backend (replace with real API if available)
    setDeadline(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
  };

  const handleDelete = async (submission) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    setLoading(true);
    try {
      // Replace with real API call
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
      // Replace with real API call
      setDeadline(newDeadline);
      setToast({ message: 'Deadline updated.', type: 'success' });
    } catch (err) {
      setToast({ message: 'Deadline update failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#4f46e5] via-[#a21caf] to-[#18181b] py-10 px-2 font-sans">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center mb-8">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 font-poppins">Admin Dashboard</h1>
        <DeadlineManager deadline={deadline} onUpdate={handleDeadlineUpdate} loading={loading} />
        <AdminFiltersBar onFilterChange={setFilters} />
        <SubmissionsTable submissions={submissions} filters={filters} onDelete={handleDelete} />
      </div>
    </div>
  );
} 