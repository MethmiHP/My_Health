
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, FileText, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getJSON, useAuthHeaders } from '../utils/api';
// Keep functionality the same; only structure/UX below changes

export default function MedicalHistoryPage() {
  const { user } = useAuth();
  const headers = useAuthHeaders();
  const navigate = useNavigate();
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const pdfRef = useRef(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadMedicalHistory = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const data = await getJSON(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/medical-history/patient/${user._id}`,
        headers
      );
      setMedicalHistory(data.medicalHistory);
    } catch (error) {
      console.error('Failed to load medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicalHistory();
  }, [user?._id]);

  const handlePrint = () => {
    window.print();
  };

  

  // Build a flattened read-only records list for display only (no data changes)
  const records = (() => {
    if (!medicalHistory) return [];
    const list = [];

    // Prescriptions
    (medicalHistory.prescriptions || []).forEach(p => {
      list.push({
        _kind: 'prescription',
        typeLabel: 'Prescription',
        date: p.prescribedDate || p.startDate || p.endDate || p.createdAt,
        title: p.medicationName || 'Prescription',
        source: p.prescribedBy || 'Pharmacy',
        raw: p,
      });
    });

    // Lab Results
    (medicalHistory.labResults || []).forEach(l => {
      list.push({
        _kind: 'lab',
        typeLabel: 'Lab Test',
        date: l.testDate || l.createdAt,
        title: l.testName || 'Lab Result',
        source: 'Laboratory',
        raw: l,
      });
    });

    

    // Procedures
    (medicalHistory.procedures || []).forEach(pr => {
      list.push({
        _kind: 'procedure',
        typeLabel: 'Procedure',
        date: pr.procedureDate || pr.createdAt,
        title: pr.procedureName || 'Procedure',
        source: pr.location || pr.performedBy || 'Hospital/Clinic',
        raw: pr,
      });
    });

    // Diagnoses
    (medicalHistory.diagnoses || []).forEach(d => {
      list.push({
        _kind: 'diagnosis',
        typeLabel: 'Diagnosis',
        date: d.diagnosisDate || d.createdAt,
        title: d.condition || 'Diagnosis',
        source: d.diagnosedBy || 'Doctor',
        raw: d,
      });
    });

    // Medications
    (medicalHistory.medications || []).forEach(m => {
      list.push({
        _kind: 'medication',
        typeLabel: 'Medication',
        date: m.startDate || m.endDate || m.createdAt,
        title: m.name || 'Medication',
        source: m.prescribedBy || 'Healthcare Provider',
        status: m.status,
        raw: m,
      });
    });

    return list;
  })();

  const filteredRecords = records
    .filter(r => {
      if (activeTab === 'all') return true;
      if (activeTab === 'consultations') return r._kind === 'diagnosis';
      if (activeTab === 'lab') return r._kind === 'lab';
      if (activeTab === 'imaging') return r._kind === 'imaging';
      if (activeTab === 'procedures') return r._kind === 'procedure';
      if (activeTab === 'medications') return r._kind === 'medication';
      if (activeTab === 'prescriptions') return r._kind === 'prescription';
      return true;
    })
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (r.title || '').toLowerCase().includes(q) ||
        (r.typeLabel || '').toLowerCase().includes(q) ||
        (r.source || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return sortOrder === 'newest' ? db - da : da - db;
    });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-teal-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
                  <p className="text-gray-600">Complete medical records and health information</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadMedicalHistory}
                disabled={loading}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              {/* Download removed as requested */}
              <button
                onClick={handlePrint}
                disabled={loading || !medicalHistory}
                className="px-3 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
          {/* Patient ID line removed as requested */}
        </div>
      </section>

      {/* Records List Structure (tabs, search, sort) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6" ref={pdfRef}>
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {[
            { key: 'all', label: 'All Records' },
            { key: 'imaging', label: 'Imaging' },
            { key: 'procedures', label: 'Procedures' },
            { key: 'medications', label: 'Medications' },
            { key: 'prescriptions', label: 'Prescriptions' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                activeTab === tab.key
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <button
              onClick={() => setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'))}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Table-like list */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-gray-500 border-b bg-gray-50">
            <div className="col-span-3">Type</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Source</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-sm text-gray-600">Loading records...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-600">No records found</div>
          ) : (
            filteredRecords.map((r, idx) => (
              <div key={idx} className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0">
                <div className="col-span-3 flex items-center gap-2">
                  {(r._kind !== 'lab' && r._kind !== 'diagnosis') && (
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      r._kind === 'procedure' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      r._kind === 'medication' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      r._kind === 'prescription' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {r.typeLabel}
                    </span>
                  )}
                  {r.status && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      {r.status}
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-sm text-gray-700">
                  {r.date ? new Date(r.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                </div>
                <div className="col-span-4 text-sm text-gray-900 truncate">
                  {r.title}
                </div>
                <div className="col-span-2 text-sm text-gray-700 truncate">
                  {r.source || '—'}
                </div>
                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    className="text-sm text-teal-700 hover:text-teal-900"
                    onClick={() => setSelectedRecord(r)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedRecord(null)}></div>
          <div className="relative bg-white rounded-lg shadow-lg border w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{selectedRecord.typeLabel}</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedRecord(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">Date</div>
                  <div className="text-gray-900">{formatDate(selectedRecord.date)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Source</div>
                  <div className="text-gray-900">{selectedRecord.source || '—'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500">Title</div>
                  <div className="text-gray-900">{selectedRecord.title}</div>
                </div>
              </div>

              {/* Type-specific quick fields */}
              {selectedRecord._kind === 'medication' && (
                <div className="text-sm">
                  <div className="text-gray-500">Status</div>
                  <div className="text-gray-900 capitalize">{selectedRecord.status || 'active'}</div>
                </div>
              )}

              {/* Raw details preview */}
              <div className="mt-2">
                <div className="text-gray-500 text-sm mb-1">Details</div>
                <pre className="text-xs bg-gray-50 border border-gray-200 rounded-md p-3 overflow-auto max-h-64">
{JSON.stringify(selectedRecord.raw, null, 2)}
                </pre>
              </div>
            </div>
            <div className="px-5 py-4 border-t flex justify-end">
              <button
                className="px-4 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            background: white !important;
          }
          
          .bg-gray-50 {
            background: white !important;
          }
          
          .bg-white {
            background: white !important;
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
          
          .text-gray-600 {
            color: #374151 !important;
          }
          
          .text-gray-900 {
            color: #111827 !important;
          }
        }
      `}</style>
    </main>
  );
}

