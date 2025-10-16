// // src/pages/reports/SavedReports.jsx
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import {
//   FileText,
//   Trash2,
//   Eye,
//   MessageSquare,
//   Clock,
//   User,
//   Send
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';

// const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// export default function SavedReports() {
//   const { token } = useAuth();
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [commentText, setCommentText] = useState('');

//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token?.replace(/^"|"$/g, '')}`
//   };

//   useEffect(() => {
//     fetchSavedReports();
//   }, []);

//   const fetchSavedReports = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API}/api/reports/saved`, { headers });
//       if (!response.ok) throw new Error('Failed to fetch saved reports');
      
//       const data = await response.json();
//       setReports(data.reports || []);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (reportId) => {
//     if (!confirm('Are you sure you want to delete this report?')) return;

//     try {
//       const response = await fetch(`${API}/api/reports/${reportId}`, {
//         method: 'DELETE',
//         headers
//       });

//       if (!response.ok) throw new Error('Failed to delete report');

//       toast.success('Report deleted successfully');
//       setReports(prev => prev.filter(r => r._id !== reportId));
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleAddComment = async (reportId) => {
//     if (!commentText.trim()) return;

//     try {
//       const response = await fetch(`${API}/api/reports/${reportId}/comment`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify({ comment: commentText })
//       });

//       if (!response.ok) throw new Error('Failed to add comment');

//       const data = await response.json();
//       toast.success('Comment added successfully');
//       setCommentText('');
      
//       // Update report in list
//       setReports(prev =>
//         prev.map(r => (r._id === reportId ? { ...r, comments: data.comments } : r))
//       );
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-teal-900">Loading saved reports...</p>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50">
//       <section className="bg-white border-b border-teal-100">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex items-center gap-3">
//             <div className="rounded-xl bg-teal-600 p-3">
//               <FileText className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-teal-900">Saved Reports</h1>
//               <p className="text-sm text-teal-900/70">
//                 View and manage your saved report configurations
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
//         {reports.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-2xl border border-teal-100">
//             <FileText className="h-12 w-12 text-teal-400 mx-auto" />
//             <h3 className="mt-4 text-lg font-semibold text-teal-900">
//               No Saved Reports
//             </h3>
//             <p className="mt-2 text-sm text-teal-900/70">
//               Save a report from the dashboard to see it here
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {reports.map(report => (
//               <div
//                 key={report._id}
//                 className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-teal-900">
//                       {report.title}
//                     </h3>
//                     <p className="text-sm text-teal-900/70 mt-1">
//                       {report.description}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleDelete(report._id)}
//                     className="rounded-xl p-2 text-red-600 hover:bg-red-50 transition-colors"
//                   >
//                     <Trash2 className="h-5 w-5" />
//                   </button>
//                 </div>

//                 <div className="flex items-center gap-4 text-sm text-teal-900/70 mb-4">
//                   <div className="flex items-center gap-1">
//                     <User className="h-4 w-4" />
//                     {report.createdBy?.firstName} {report.createdBy?.lastName}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-4 w-4" />
//                     {new Date(report.createdAt).toLocaleDateString()}
//                   </div>
//                 </div>

//                 {/* Filters */}
//                 {report.filters && Object.keys(report.filters).length > 0 && (
//                   <div className="mb-4 p-3 bg-teal-50 rounded-xl">
//                     <p className="text-xs font-medium text-teal-900 mb-2">Filters Applied:</p>
//                     <div className="flex flex-wrap gap-2">
//                       {report.filters.startDate && (
//                         <span className="px-2 py-1 bg-white rounded-lg text-xs text-teal-900">
//                           From: {new Date(report.filters.startDate).toLocaleDateString()}
//                         </span>
//                       )}
//                       {report.filters.endDate && (
//                         <span className="px-2 py-1 bg-white rounded-lg text-xs text-teal-900">
//                           To: {new Date(report.filters.endDate).toLocaleDateString()}
//                         </span>
//                       )}
//                       {report.filters.department && (
//                         <span className="px-2 py-1 bg-white rounded-lg text-xs text-teal-900">
//                           Dept: {report.filters.department}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Comments */}
//                 <div className="border-t border-teal-100 pt-4">
//                   <h4 className="text-sm font-semibold text-teal-900 mb-3 flex items-center gap-2">
//                     <MessageSquare className="h-4 w-4" />
//                     Comments ({report.comments?.length || 0})
//                   </h4>

//                   {report.comments && report.comments.length > 0 && (
//                     <div className="space-y-2 mb-3">
//                       {report.comments.slice(-3).map((comment, idx) => (
//                         <div key={idx} className="p-3 bg-gray-50 rounded-xl">
//                           <p className="text-xs font-medium text-teal-900">
//                             {comment.userName}
//                           </p>
//                           <p className="text-sm text-teal-900/80 mt-1">
//                             {comment.comment}
//                           </p>
//                           <p className="text-xs text-teal-900/60 mt-1">
//                             {new Date(comment.createdAt).toLocaleString()}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       placeholder="Add a comment..."
//                       value={selectedReport === report._id ? commentText : ''}
//                       onFocus={() => setSelectedReport(report._id)}
//                       onChange={(e) => setCommentText(e.target.value)}
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter') handleAddComment(report._id);
//                       }}
//                       className="flex-1 rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400"
//                     />
//                     <button
//                       onClick={() => handleAddComment(report._id)}
//                       className="rounded-xl bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
//                     >
//                       <Send className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// src/pages/reports/SavedReports.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Trash2,
  Eye,
  MessageSquare,
  Clock,
  User,
  Send,
  ArrowLeft,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function SavedReports() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token?.replace(/^"|"$/g, '')}`
  };

  useEffect(() => {
    fetchSavedReports();
  }, [filterStatus, filterType]);

  const fetchSavedReports = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filterStatus) queryParams.append('status', filterStatus);
      if (filterType) queryParams.append('type', filterType);

      const response = await fetch(
        `${API}/api/reports/saved?${queryParams.toString()}`,
        { headers }
      );
      
      if (!response.ok) throw new Error('Failed to fetch saved reports');
      
      const data = await response.json();
      setReports(data.reports || []);
      toast.success('Reports loaded successfully');
    } catch (error) {
      toast.error(error.message);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await fetch(`${API}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) throw new Error('Failed to delete report');

      toast.success('Report deleted successfully');
      setReports(prev => prev.filter(r => r._id !== reportId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddComment = async (reportId) => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const response = await fetch(`${API}/api/reports/${reportId}/comment`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ comment: commentText })
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const data = await response.json();
      toast.success('Comment added successfully');
      setCommentText('');
      
      // Update report in list
      setReports(prev =>
        prev.map(r => (r._id === reportId ? { ...r, comments: data.comments } : r))
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-teal-600 animate-spin mx-auto" />
          <p className="mt-4 text-teal-900">Loading saved reports...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-teal-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/reports')}
                className="rounded-xl p-2 hover:bg-teal-50 transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-teal-700" />
              </button>
              <div className="rounded-xl bg-teal-600 p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-teal-900">Saved Reports</h1>
                <p className="text-sm text-teal-900/70">
                  View and manage your saved report configurations
                </p>
              </div>
            </div>

            <button
              onClick={fetchSavedReports}
              className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filters */}
        <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-teal-700" />
            <h3 className="text-lg font-semibold text-teal-900">Filter Reports</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400"
              >
                <option value="">All Types</option>
                <option value="summary">Summary</option>
                <option value="appointments">Appointments</option>
                <option value="payments">Payments</option>
                <option value="patients">Patients</option>
                <option value="doctors">Doctors</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('');
                  setFilterType('');
                }}
                className="w-full rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-teal-100">
            <FileText className="h-12 w-12 text-teal-400 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-teal-900">
              No Saved Reports
            </h3>
            <p className="mt-2 text-sm text-teal-900/70">
              Save a report from the dashboard to see it here
            </p>
            <button
              onClick={() => navigate('/reports')}
              className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Go to Reports Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.map(report => (
              <div
                key={report._id}
                className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Report Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-teal-900">
                        {report.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        report.status === 'published' 
                          ? 'bg-green-100 text-green-700'
                          : report.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-teal-900/70">
                      {report.description || 'No description'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="rounded-xl p-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Report Metadata */}
                <div className="flex items-center gap-4 text-sm text-teal-900/70 mb-4 pb-4 border-b border-teal-100">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {report.createdBy?.firstName} {report.createdBy?.lastName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {report.views || 0} views
                  </div>
                </div>

                {/* Filters Applied */}
                {report.filters && Object.keys(report.filters).some(key => report.filters[key]) && (
                  <div className="mb-4 p-3 bg-teal-50 rounded-xl">
                    <p className="text-xs font-medium text-teal-900 mb-2">Filters Applied:</p>
                    <div className="flex flex-wrap gap-2">
                      {report.filters.startDate && (
                        <span className="px-2 py-1 bg-white rounded-lg text-xs text-teal-900">
                          From: {new Date(report.filters.startDate).toLocaleDateString()}
                        </span>
                      )}
                      {report.filters.endDate && (
                        <span className="px-2 py-1 bg-white rounded-lg text-xs text-teal-900">
                          To: {new Date(report.filters.endDate).toLocaleDateString()}
                        </span>
                      )}
                      {report.filters.department && (
                        <span className="px-2 py-1 bg-white rounded-lg text-xs text-teal-900">
                          Dept: {report.filters.department}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="border-t border-teal-100 pt-4">
                  <h4 className="text-sm font-semibold text-teal-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments ({report.comments?.length || 0})
                  </h4>

                  {/* Existing Comments */}
                  {report.comments && report.comments.length > 0 && (
                    <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
                      {report.comments.slice(-3).map((comment, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs font-medium text-teal-900">
                            {comment.userName}
                          </p>
                          <p className="text-sm text-teal-900/80 mt-1">
                            {comment.comment}
                          </p>
                          <p className="text-xs text-teal-900/60 mt-1">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={selectedReport === report._id ? commentText : ''}
                      onFocus={() => setSelectedReport(report._id)}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleAddComment(report._id);
                      }}
                      className="flex-1 rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400"
                    />
                    <button
                      onClick={() => handleAddComment(report._id)}
                      className="rounded-xl bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}