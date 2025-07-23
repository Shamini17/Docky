import { useState } from 'react';

export default function SubmittedFilesList({ uploads, filters, onDelete, onEdit }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  // Filtering logic
  const filtered = uploads.filter(u => {
    const matchesType = !filters.docType || (u.docType && u.docType === filters.docType);
    const matchesSearch = !filters.search || (u.fileName && u.fileName.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesFrom = !filters.from || (u.uploadedAt && new Date(u.uploadedAt) >= new Date(filters.from));
    const matchesTo = !filters.to || (u.uploadedAt && new Date(u.uploadedAt) <= new Date(filters.to));
    return matchesType && matchesSearch && matchesFrom && matchesTo;
  });

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

  const handleView = (fileUrl, fileType, fileName) => {
    setPreviewError(false);
    const ext = fileName ? fileName.split('.').pop().toLowerCase() : '';
    if (ext === 'docx') {
      // Open in Google Docs Viewer
      window.open(`https://docs.google.com/gview?url=${window.location.origin}${fileUrl}&embedded=true`, '_blank');
      return;
    }
    if (ext === 'pptx') {
      // Open in Google Slides Viewer
      window.open(`https://docs.google.com/gview?url=${window.location.origin}${fileUrl}&embedded=true`, '_blank');
      return;
    }
    setPreviewUrl(fileUrl);
    setPreviewType(fileType || ext);
  };

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
              <tr key={i} className="border-b border-gray-200">
                <td className="py-2 px-4 text-black">{u.fileName}</td>
                <td className="py-2 px-4 text-black">{getTypeLabel(u.fileType, u.fileName)}</td>
                <td className="py-2 px-4 text-black">{new Date(u.uploadedAt).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <a href={`/api/download/${u.fileUrl.split('/').pop()}`} download={u.fileName} className="text-green-600 hover:underline">Download</a>
                </td>
                <td className="py-2 px-4">
                  {onDelete && (
                    <button onClick={() => onDelete(u)} className="text-red-600 hover:text-red-800 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                  {onEdit && <button onClick={() => onEdit(u)} className="text-blue-600 hover:underline ml-2">Edit</button>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 