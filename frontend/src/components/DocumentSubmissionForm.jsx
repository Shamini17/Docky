import { useState, useEffect } from 'react';

const DOC_TYPES = [
  { label: 'Image', value: 'image' },
  { label: 'Audio', value: 'audio' },
  { label: 'Video', value: 'video' },
  { label: 'DOC', value: 'doc' },
  { label: 'TXT', value: 'txt' },
  { label: 'PPT', value: 'ppt' },
];

export default function DocumentSubmissionForm({
  onSubmit,
  deadline,
  disabled,
  loading,
  feedback,
}) {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('image');
  const [error, setError] = useState('');

  useEffect(() => { setError(''); }, [file, docType]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file.');
      return;
    }
    if (!docType) {
      setError('Please select a document type.');
      return;
    }
    onSubmit({ file, docType });
    setFile(null);
    setDocType('image');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 items-center">
      <div className="w-full flex flex-col md:flex-row gap-4">
        <input
          type="file"
          accept="image/*,audio/*,video/*,.doc,.docx,.txt,.ppt,.pptx"
          onChange={handleFileChange}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
          disabled={disabled}
        />
        <select
          value={docType}
          onChange={e => setDocType(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
          disabled={disabled}
        >
          {DOC_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={deadline ? new Date(deadline).toLocaleString() : ''}
          readOnly
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 focus:outline-none text-center"
          placeholder="Deadline"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        disabled={loading || disabled}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}
      {feedback && <p className="text-green-600 text-center mb-2">{feedback}</p>}
      {disabled && <p className="text-yellow-600 text-center mb-2">Submission closed. Please contact admin.</p>}
    </form>
  );
} 