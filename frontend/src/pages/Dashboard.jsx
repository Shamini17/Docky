import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DocumentSubmissionForm from '../components/DocumentSubmissionForm';
import FiltersBar from '../components/FiltersBar';
import SubmittedFilesList from '../components/SubmittedFilesList';
import Toast from '../components/Toast';

export default function Dashboard() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deadline, setDeadline] = useState('');
  const [filters, setFilters] = useState({ docType: '', from: '', to: '', search: '' });
  const [activeTab, setActiveTab] = useState('files');
  const location = useLocation();
  const navigate = useNavigate();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (e) {
    user = null;
  }

  // Auto-redirect from /user to /dashboard
  useEffect(() => {
    if (location.pathname === '/user') {
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  if (!user || !user.email) {
    return (
      <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#4f46e5] via-[#a21caf] to-[#18181b] font-sans">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-indigo-700">You are not logged in or user info is missing/corrupted.</h1>
          <a href="/" className="text-indigo-600 hover:underline font-medium">Go to Login</a>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchUploads();
    fetchDeadline();
    // eslint-disable-next-line
  }, []);

  const fetchUploads = async () => {
    try {
      const res = await axios.get('/api/user/uploads', {
        params: { email: user.email },
      });
      setUploads(res.data);
    } catch (err) {
      setUploads([]);
    }
  };

  const fetchDeadline = async () => {
    // Simulate fetching deadline from backend (replace with real API if available)
    // For now, set a deadline 1 day from now
    setDeadline(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
  };

  const handleSubmission = async ({ file, docType }) => {
    setLoading(true);
    setToast({ message: '', type: 'success' });
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', user.email);
      formData.append('docType', docType);
      formData.append('deadline', deadline);
      await axios.post('/api/user/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setToast({ message: 'Upload successful!', type: 'success' });
      fetchUploads();
    } catch (err) {
      setToast({ message: 'Upload failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Deadline logic
  const isDeadlinePassed = deadline && new Date() > new Date(deadline);

  // Add a delete handler for user uploads
  const handleDelete = async (upload) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/user/uploads/${upload.fileName}`, { params: { email: user.email } });
      setToast({ message: 'File deleted.', type: 'success' });
      fetchUploads();
    } catch (err) {
      setToast({ message: 'Delete failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Filtered uploads are handled in SubmittedFilesList

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#4f46e5] via-[#a21caf] to-[#18181b] py-10 px-2 font-sans">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center mb-8">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 font-poppins">User Dashboard</h1>
        <div className="flex gap-4 mb-8 w-full justify-center">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${activeTab === 'files' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}
            onClick={() => setActiveTab('files')}
          >
            Submitted Files
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${activeTab === 'upload' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Work
          </button>
        </div>
        {activeTab === 'files' ? (
          <>
            <FiltersBar onFilterChange={setFilters} />
            <SubmittedFilesList uploads={uploads} filters={filters} onDelete={handleDelete} />
          </>
        ) : (
          <DocumentSubmissionForm
            onSubmit={handleSubmission}
            deadline={deadline}
            disabled={isDeadlinePassed}
            loading={loading}
            feedback={isDeadlinePassed ? '' : toast.message}
          />
        )}
      </div>
    </div>
  );
}