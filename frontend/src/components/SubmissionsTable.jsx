export default function SubmissionsTable({ submissions, filters, onDelete }) {
  const filtered = submissions.filter(s => {
    const matchesType = !filters.docType || (s.docType && s.docType === filters.docType);
    const matchesSearch = !filters.search || (s.fileName && s.fileName.toLowerCase().includes(filters.search.toLowerCase())) || (s.userName && s.userName.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesFrom = !filters.from || (s.uploadedAt && new Date(s.uploadedAt) >= new Date(filters.from));
    const matchesTo = !filters.to || (s.uploadedAt && new Date(s.uploadedAt) <= new Date(filters.to));
    return matchesType && matchesSearch && matchesFrom && matchesTo;
  });

  return (
    <div className="overflow-x-auto w-full mt-6">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-indigo-100 text-indigo-800">
            <th className="py-2 px-4">User Name</th>
            <th className="py-2 px-4">File Name</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Uploaded At</th>
            <th className="py-2 px-4">Preview</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-4 text-gray-500">No submissions found.</td></tr>
          ) : (
            filtered.map((s, i) => (
              <tr key={i} className="even:bg-indigo-50 dark:even:bg-gray-800">
                <td className="py-2 px-4">{s.userName || '-'}</td>
                <td className="py-2 px-4">{s.fileName}</td>
                <td className="py-2 px-4">{s.docType ? s.docType.toUpperCase() : '-'}</td>
                <td className="py-2 px-4">{new Date(s.uploadedAt).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <a href={s.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">View</a>
                </td>
                <td className="py-2 px-4">
                  {onDelete && <button onClick={() => onDelete(s)} className="text-red-600 hover:underline mr-2">Delete</button>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 