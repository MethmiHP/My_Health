import React, { useState, useEffect, useMemo } from 'react';
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
  Info,
  Download,
  X,
  PlayCircle,
  ChevronRight,
} from 'lucide-react';
import hospitalBg from '../../assets/steth.jpg';
import { useAuth } from '../../contexts/AuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function SavedReports() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  // details panel
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const active = useMemo(
    () => reports.find((r) => r._id === activeId) || null,
    [activeId, reports]
  );

  // comments input
  const [commentText, setCommentText] = useState('');
  const [commentBusy, setCommentBusy] = useState(false);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token?.replace(/^"|"$/g, '')}`,
  };

  useEffect(() => {
    fetchSavedReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterType]);

  const fetchSavedReports = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filterStatus) queryParams.append('status', filterStatus);
      if (filterType) queryParams.append('type', filterType);

      const res = await fetch(`${API}/api/reports/saved?${queryParams.toString()}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch saved reports');

      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      const res = await fetch(`${API}/api/reports/${reportId}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Failed to delete report');

      setReports((prev) => prev.filter((r) => r._id !== reportId));
      if (reportId === activeId) {
        setOpen(false);
        setActiveId(null);
      }
      toast.success('Report deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddComment = async (reportId) => {
    const text = commentText.trim();
    if (!text) {
      toast.error('Please enter a comment');
      return;
    }
    setCommentBusy(true);
    try {
      const res = await fetch(`${API}/api/reports/${reportId}/comment`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ comment: text }),
      });
      if (!res.ok) throw new Error('Failed to add comment');

      const data = await res.json();
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, comments: data.comments } : r))
      );
      setCommentText('');
      toast.success('Comment added');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCommentBusy(false);
    }
  };

  const openDetails = (id) => {
    setActiveId(id);
    setOpen(true);
  };

  const download = (report, fmt) => {
    // Compose query using saved filters (startDate, endDate, etc.)
    const qp = new URLSearchParams({ format: fmt });
    const f = report?.filters || {};
    if (f.startDate) qp.append('startDate', f.startDate);
    if (f.endDate) qp.append('endDate', f.endDate);
    if (f.department) qp.append('department', f.department);
    if (f.doctorId) qp.append('doctorId', f.doctorId);
    // Open in new tab
    const url = `${API}/api/reports/download?${qp.toString()}`;
    window.open(url, '_blank', 'noopener');
  };

  const reRun = (report) => {
    // Navigate back to dashboard and let it re-fetch using saved filters/type via search params
    const params = new URLSearchParams();
    params.set('fromSaved', '1');
    if (report.reportType) params.set('reportType', report.reportType);
    Object.entries(report.filters || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.set(k, v);
    });
    navigate(`/reports?${params.toString()}`);
  };

  const DataPreview = ({ report }) => {
    const data = report?.data || {};
    const appts = Array.isArray(data.appointments) ? data.appointments.slice(0, 8) : [];
    const pays = Array.isArray(data.payments) ? data.payments.slice(0, 8) : [];

    const hasAny = appts.length > 0 || pays.length > 0;

    if (!hasAny) {
      return (
        <div className="rounded-xl border border-teal-100 p-4 text-sm text-teal-900/70">
          No preview data saved with this report.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {appts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-teal-700" />
              <h4 className="text-sm font-semibold text-teal-900">Appointments (preview)</h4>
            </div>
            <div className="overflow-x-auto rounded-xl border border-teal-100">
              <table className="min-w-full text-sm">
                <thead className="bg-teal-50 text-teal-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Patient</th>
                    <th className="px-3 py-2 text-left">Doctor</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Channel</th>
                  </tr>
                </thead>
                <tbody>
                  {appts.map((r, i) => (
                    <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2">
                        {r.slotStart ? new Date(r.slotStart).toLocaleString() : '—'}
                      </td>
                      <td className="px-3 py-2">
                        {r.patientName || r.patient || '—'}
                      </td>
                      <td className="px-3 py-2">
                        {r.doctorName || r.doctor || '—'}
                      </td>
                      <td className="px-3 py-2">{r.status || '—'}</td>
                      <td className="px-3 py-2">{r.channel || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pays.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-teal-700" />
              <h4 className="text-sm font-semibold text-teal-900">Payments (preview)</h4>
            </div>
            <div className="overflow-x-auto rounded-xl border border-teal-100">
              <table className="min-w-full text-sm">
                <thead className="bg-teal-50 text-teal-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Receipt</th>
                    <th className="px-3 py-2 text-left">Patient</th>
                    <th className="px-3 py-2 text-left">Method</th>
                    <th className="px-3 py-2 text-left">Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {pays.map((r, i) => (
                    <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
                      </td>
                      <td className="px-3 py-2">{r.receiptNumber || '—'}</td>
                      <td className="px-3 py-2">{r.patientName || r.patient || '—'}</td>
                      <td className="px-3 py-2">{r.paymentMethod || '—'}</td>
                      <td className="px-3 py-2">
                        {(r.totalAmount ?? 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const KPI = ({ label, value }) => (
    <div className="rounded-xl border border-teal-100 p-4">
      <p className="text-xs text-teal-900/70">{label}</p>
      <p className="text-xl font-semibold text-teal-900 mt-1">{value}</p>
    </div>
  );

  const money = (n) =>
    (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
    <div className="min-h-screen">
      {/* Background Image - positioned to not cover navbar */}
      <div 
        className="fixed top-16 left-0 right-0 bottom-0 bg-cover bg-center bg-no-repeat opacity-75"
        style={{ backgroundImage: `url(${hospitalBg})` }}
        aria-hidden="true"
      />
      {/* Main content */}
      <main className="relative z-10">
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
                  View, explore and export your saved report configurations
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
              <label className="block text-sm font-medium text-teal-900 mb-1">Status</label>
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
              <label className="block text-sm font-medium text-teal-900 mb-1">Type</label>
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
            <h3 className="mt-4 text-lg font-semibold text-teal-900">No Saved Reports</h3>
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
            {reports.map((report) => (
              <div
                key={report._id}
                className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={(e) => {
                  // only open details if click is not on a button inside the card
                  if (!(e.target.closest('button') || e.target.closest('a') || e.target.closest('input'))) {
                    openDetails(report._id);
                  }
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-teal-900">{report.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          report.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : report.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {report.status}
                      </span>
                      {report.reportType && (
                        <span className="px-2 py-1 rounded-lg text-xs bg-teal-50 text-teal-800 border border-teal-200">
                          {report.reportType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-teal-900/70">
                      {report.description || 'No description'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetails(report._id);
                      }}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-teal-800 border border-teal-200 hover:bg-teal-50 flex items-center gap-1"
                    >
                      View <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(report._id);
                      }}
                      className="rounded-xl p-2 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Meta */}
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

                {/* Filters quick row */}
                {report.filters && Object.keys(report.filters).some((k) => report.filters[k]) && (
                  <div className="flex flex-wrap gap-2">
                    {report.filters.startDate && (
                      <span className="px-2 py-1 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900">
                        From: {new Date(report.filters.startDate).toLocaleDateString()}
                      </span>
                    )}
                    {report.filters.endDate && (
                      <span className="px-2 py-1 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900">
                        To: {new Date(report.filters.endDate).toLocaleDateString()}
                      </span>
                    )}
                    {report.filters.department && (
                      <span className="px-2 py-1 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900">
                        Dept: {report.filters.department}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-over details panel */}
      <div
        className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        {/* panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-full sm:w-[560px] bg-white shadow-xl transition-transform ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-teal-100">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-teal-600 p-2">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-teal-900/70">Saved Report</p>
                <h3 className="text-lg font-semibold text-teal-900">
                  {active?.title || '—'}
                </h3>
              </div>
            </div>
            <button
              className="rounded-xl p-2 hover:bg-teal-50"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5 text-teal-700" />
            </button>
          </div>

          <div className="h-[calc(100vh-64px)] overflow-y-auto p-5 space-y-6">
            {!active ? (
              <p className="text-sm text-teal-900/70">Select a report…</p>
            ) : (
              <>
                {/* meta row */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                    {active.reportType || 'custom'}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg border ${
                      active.status === 'published'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : active.status === 'draft'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {active.status}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
                    Created: {new Date(active.createdAt).toLocaleString()}
                  </span>
                  {active.updatedAt && (
                    <span className="px-2 py-1 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
                      Updated: {new Date(active.updatedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* description */}
                {active.description && (
                  <p className="text-sm text-teal-900/80">{active.description}</p>
                )}

                {/* KPIs if present on saved data */}
                {active.data?.summary && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <KPI
                      label="Appointments"
                      value={active.data.summary.appointments?.total ?? 0}
                    />
                    <KPI
                      label="Transactions"
                      value={active.data.summary.revenue?.transactions ?? 0}
                    />
                    <KPI
                      label="Revenue (LKR)"
                      value={money(active.data.summary.revenue?.total)}
                    />
                  </div>
                )}

                {/* filters */}
                {(active.filters && Object.keys(active.filters).length > 0) && (
                  <div className="rounded-2xl border border-teal-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Filter className="h-4 w-4 text-teal-700" />
                      <h4 className="text-sm font-semibold text-teal-900">Filters</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {active.filters.startDate && (
                        <span className="px-2 py-1 bg-white rounded-lg text-xs border border-teal-200 text-teal-900">
                          From: {new Date(active.filters.startDate).toLocaleDateString()}
                        </span>
                      )}
                      {active.filters.endDate && (
                        <span className="px-2 py-1 bg-white rounded-lg text-xs border border-teal-200 text-teal-900">
                          To: {new Date(active.filters.endDate).toLocaleDateString()}
                        </span>
                      )}
                      {active.filters.department && (
                        <span className="px-2 py-1 bg-white rounded-lg text-xs border border-teal-200 text-teal-900">
                          Department: {active.filters.department}
                        </span>
                      )}
                      {active.filters.doctorId && (
                        <span className="px-2 py-1 bg-white rounded-lg text-xs border border-teal-200 text-teal-900">
                          Doctor: {active.filters.doctorId}
                        </span>
                      )}
                      {active.filters.paymentMethod && (
                        <span className="px-2 py-1 bg-white rounded-lg text-xs border border-teal-200 text-teal-900">
                          Method: {active.filters.paymentMethod}
                        </span>
                      )}
                      {active.filters.status && (
                        <span className="px-2 py-1 bg-white rounded-lg text-xs border border-teal-200 text-teal-900">
                          Status: {active.filters.status}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* preview */}
                <DataPreview report={active} />

                {/* actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => reRun(active)}
                    className="rounded-xl px-4 py-2 bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 flex items-center gap-2"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Re-run
                  </button>
                  <button
                    onClick={() => download(active, 'pdf')}
                    className="rounded-xl px-4 py-2 border border-teal-200 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </button>
                  <button
                    onClick={() => download(active, 'csv')}
                    className="rounded-xl px-4 py-2 border border-teal-200 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    CSV
                  </button>
                  <button
                    onClick={() => handleDelete(active._id)}
                    className="rounded-xl px-4 py-2 border border-red-200 text-sm font-semibold text-red-700 hover:bg-red-50 flex items-center gap-2 ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>

                {/* comments */}
                <div className="border-t border-teal-100 pt-4">
                  <h4 className="text-sm font-semibold text-teal-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments ({active.comments?.length || 0})
                  </h4>

                  {active.comments && active.comments.length > 0 ? (
                    <div className="space-y-2 mb-3 max-h-56 overflow-y-auto pr-1">
                      {active.comments.map((c, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs font-medium text-teal-900">{c.userName}</p>
                          <p className="text-sm text-teal-900/80 mt-1">{c.comment}</p>
                          <p className="text-xs text-teal-900/60 mt-1">
                            {new Date(c.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-teal-900/70 mb-3">No comments yet.</p>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(active._id);
                      }}
                      className="flex-1 rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400"
                    />
                    <button
                      disabled={commentBusy}
                      onClick={() => handleAddComment(active._id)}
                      className="rounded-xl bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
      </main>
    </div>
  );
}
