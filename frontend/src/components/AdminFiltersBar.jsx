import { useState } from 'react';

const DOC_TYPES = [ '', 'image', 'audio', 'video', 'doc', 'txt', 'ppt' ];

export default function AdminFiltersBar({ onFilterChange }) {
  const [docType, setDocType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');

  const handleChange = () => {
    onFilterChange({ docType, from, to, search });
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 mb-4 w-full items-center mt-6">
      <input
        type="text"
        value={search}
        onChange={e => { setSearch(e.target.value); handleChange(); }}
        className="px-3 py-2 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        placeholder="Search by user or file name"
      />
      <select
        value={docType}
        onChange={e => { setDocType(e.target.value); handleChange(); }}
        className="px-3 py-2 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
      >
        <option value="">All Types</option>
        {DOC_TYPES.filter(Boolean).map(type => (
          <option key={type} value={type}>{type.toUpperCase()}</option>
        ))}
      </select>
      <input
        type="date"
        value={from}
        onChange={e => { setFrom(e.target.value); handleChange(); }}
        className="px-3 py-2 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        placeholder="From"
      />
      <input
        type="date"
        value={to}
        onChange={e => { setTo(e.target.value); handleChange(); }}
        className="px-3 py-2 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        placeholder="To"
      />
    </div>
  );
} 