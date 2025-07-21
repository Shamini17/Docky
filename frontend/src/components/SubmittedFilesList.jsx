export default function SubmittedFilesList({ uploads, filters, onDelete, onEdit }) {
  // Filtering logic
  const filtered = uploads.filter(u => {
    const matchesType = !filters.docType || (u.docType && u.docType === filters.docType);
    const matchesSearch = !filters.search || (u.fileName && u.fileName.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesFrom = !filters.from || (u.uploadedAt && new Date(u.uploadedAt) >= new Date(filters.from));
    const matchesTo = !filters.to || (u.uploadedAt && new Date(u.uploadedAt) <= new Date(filters.to));
    return matchesType && matchesSearch && matchesFrom && matchesTo;
  });

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-indigo-100 text-indigo-800">
            <th className="py-2 px-4">File Name</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Uploaded At</th>
            <th className="py-2 px-4">Preview</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-4 text-gray-500">No uploads yet.</td></tr>
          ) : (
            filtered.map((u, i) => (
              <tr key={i} className="even:bg-indigo-50 dark:even:bg-gray-800">
                <td className="py-2 px-4">{u.fileName}</td>
                <td className="py-2 px-4">{u.docType ? u.docType.toUpperCase() : '-'}</td>
                <td className="py-2 px-4">{new Date(u.uploadedAt).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <a href={u.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">View</a>
                </td>
                <td className="py-2 px-4">
                  {onDelete && <button onClick={() => onDelete(u)} className="text-red-600 hover:underline mr-2">Delete</button>}
                  {onEdit && <button onClick={() => onEdit(u)} className="text-blue-600 hover:underline">Edit</button>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 