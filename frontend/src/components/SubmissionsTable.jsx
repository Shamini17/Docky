export default function SubmissionsTable({ submissions, filters, onDelete }) {
  let filtered = submissions.filter(s => {
    const matchesType = !filters.docType || (s.docType && s.docType === filters.docType);
    const matchesSearch = !filters.search || (s.fileName && s.fileName.toLowerCase().includes(filters.search.toLowerCase())) || (s.userName && s.userName.toLowerCase().includes(filters.search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Sort by latest or oldest
  if (filters.sortOrder === 'oldest') {
    filtered = filtered.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
  } else {
    filtered = filtered.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }

  // Helper to map MIME type to label
  const getTypeLabel = (fileType, fileName) => {
    if (!fileType && fileName) {
      if (fileName.endsWith('.pptx')) return 'PPT';
      if (fileName.endsWith('.pdf')) return 'PDF';
      if (fileName.endsWith('.docx')) return 'DOCX';
      if (fileName.endsWith('.txt')) return 'TXT';
      if (fileName.endsWith('.jpeg') || fileName.endsWith('.jpg')) return 'JPEG';
      if (fileName.endsWith('.png')) return 'PNG';
    }
    switch (fileType) {
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': return 'PPT';
      case 'application/pdf': return 'PDF';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'DOCX';
      case 'text/plain': return 'TXT';
      case 'image/jpeg': return 'JPEG';
      case 'image/png': return 'PNG';
      default: return fileType || '-';
    }
  };

  return (
    <div className="overflow-x-auto w-full mt-6">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-indigo-900 text-white">
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
              <tr key={i} className="border-b border-gray-200">
                <td className="py-2 px-4 text-black">{s.userName || s.name || '-'}</td>
                <td className="py-2 px-4 text-black">{s.fileName}</td>
                <td className="py-2 px-4 text-black">{getTypeLabel(s.fileType, s.fileName)}</td>
                <td className="py-2 px-4 text-black">{new Date(s.uploadedAt).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <a href={`/api/download/${s.fileUrl.split('/').pop()}`} className="text-green-600 hover:underline">Download</a>
                </td>
                <td className="py-2 px-4">
                  {onDelete && (
                    <button onClick={() => onDelete(s)} className="text-red-600 hover:text-red-800 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 