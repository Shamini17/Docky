import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DeadlineManager({ deadline, onUpdate, loading }) {
  const [editing, setEditing] = useState(false);
  const [newDeadline, setNewDeadline] = useState(deadline ? new Date(deadline) : null);
  const [workTitle, setWorkTitle] = useState('');

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
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <input
            type="text"
            value={workTitle}
            onChange={e => setWorkTitle(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm mb-2 md:mb-0"
            placeholder="Enter work title"
          />
          <DatePicker
            selected={newDeadline}
            onChange={date => setNewDeadline(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="Pp"
            className="px-3 py-2 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            placeholderText="Select deadline"
          />
          <button
            className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition"
            onClick={() => { setEditing(false); onUpdate(newDeadline ? newDeadline.toISOString() : '', workTitle); }}
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
          onClick={() => {
            setNewDeadline(deadline ? new Date(deadline) : null);
            setEditing(true);
          }}
        >Edit Deadline</button>
      )}
    </div>
  );
} 