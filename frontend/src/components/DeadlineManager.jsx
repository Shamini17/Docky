import { useState } from 'react';

export default function DeadlineManager({ deadline, onUpdate, loading }) {
  const [editing, setEditing] = useState(false);
  const [newDeadline, setNewDeadline] = useState(deadline);

  const getCountdown = () => {
    if (!deadline) return '';
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return 'Deadline passed';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s left`;
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
      <div>
        <span className="font-bold text-indigo-700">Current Deadline:</span>{' '}
        <span className="text-gray-900">{deadline ? new Date(deadline).toLocaleString() : '-'}</span>
        <span className="ml-4 text-sm text-gray-600">{getCountdown()}</span>
      </div>
      {editing ? (
        <div className="flex gap-2 items-center">
          <input
            type="datetime-local"
            value={newDeadline ? new Date(newDeadline).toISOString().slice(0, 16) : ''}
            onChange={e => setNewDeadline(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          />
          <button
            className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition"
            onClick={() => { setEditing(false); onUpdate(newDeadline); }}
            disabled={loading}
          >Update</button>
          <button
            className="px-4 py-2 rounded bg-gray-400 text-white font-bold hover:bg-gray-500 transition"
            onClick={() => setEditing(false)}
            disabled={loading}
          >Cancel</button>
        </div>
      ) : (
        <button
          className="px-4 py-2 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
          onClick={() => setEditing(true)}
        >Edit Deadline</button>
      )}
    </div>
  );
} 