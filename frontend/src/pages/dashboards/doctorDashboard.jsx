


// src/pages/dashboards/doctorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE, useAuthHeaders, getJSON, putJSON, postJSON } from '../../utils/api';
import { Calendar, Users, QrCode, Stethoscope, UserCheck, AlertTriangle, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import BarcodeScanner from '../../components/BarcodeScanner';
import SimpleBarcodeScanner from '../../components/SimpleBarcodeScanner';
import PatientDetails from '../../components/PatientDetails';
import { useAuth } from '../../contexts/AuthContext';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const headers = useAuthHeaders();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const [scannedPatient, setScannedPatient] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');
  const [useSimpleScanner, setUseSimpleScanner] = useState(false);

  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportStatusFilter, setReportStatusFilter] = useState('all');
  const [respondingReportId, setRespondingReportId] = useState(null);
  const [responseText, setResponseText] = useState('');

  // Prescription form state from second code
  const [rxMedicationName, setRxMedicationName] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxQuantity, setRxQuantity] = useState('');
  const [rxInstructions, setRxInstructions] = useState('');
  const [rxRefills, setRxRefills] = useState(0);
  const [rxReason, setRxReason] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getJSON(`${API_BASE}/api/appointments/doctor/day?date=${date}`, headers);
      setList(data.appointments || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [date]);

  const loadReports = async () => {
    setReportsLoading(true);
    try {
      const qs = new URLSearchParams();
      if (reportStatusFilter && reportStatusFilter !== 'all') qs.set('status', reportStatusFilter);
      const data = await getJSON(`${API_BASE}/api/patient-reports/doctor${qs.toString() ? `?${qs.toString()}` : ''}`, headers);
      setReports(data.reports || []);
    } catch (e) {
      toast.error('Failed to load patient reports: ' + e.message);
    } finally {
      setReportsLoading(false);
    }
  };
  useEffect(() => { if (activeTab === 'alerts') loadReports(); }, [activeTab, reportStatusFilter]);

  const handleMarkAsRead = async (reportId) => {
    try {
      await putJSON(`${API_BASE}/api/patient-reports/${reportId}/read`, headers, {});
      loadReports();
    } catch (error) {
      toast.error('Failed to mark as read: ' + error.message);
    }
  };

  const handleRespond = (reportId) => {
    setRespondingReportId(respondingReportId === reportId ? null : reportId);
    setResponseText('');
  };

  const handleSubmitResponse = async (reportId) => {
    if (!responseText.trim()) {
      toast.warn('Please enter a response');
      return;
    }
    try {
      await putJSON(`${API_BASE}/api/patient-reports/${reportId}/respond`, headers, {
        doctorResponse: responseText,
        status: 'responded'
      });
      toast.success('Response sent to patient');
      setRespondingReportId(null);
      setResponseText('');
      loadReports();
    } catch (error) {
      toast.error('Failed to send response: ' + error.message);
    }
  };

  const handleBarcodeScan = async (barcode) => {
    setScanLoading(true);
    try {
      const response = await getJSON(`${API_BASE}/api/patients/barcode/${barcode}`, headers);
      // Normalize to include `user` for downstream components expecting it
      const normalized = { ...response, user: response.user || response.userId };
      setScannedPatient(normalized);
      const firstName = normalized.user?.firstName || normalized.userId?.firstName || '';
      const lastName = normalized.user?.lastName || normalized.userId?.lastName || '';
      toast.success(`Patient found: ${firstName} ${lastName}`.trim());
    } catch (error) {
      toast.error(`Patient not found: ${error.message || 'Error occurred'}`);
      setScannedPatient(null);
    } finally {
      setScanLoading(false);
    }
  };

  const handleScannerError = (error) => {
    const isNotFoundException =
      error.name === 'NotFoundException' ||
      error.name === 'NotFoundException2' ||
      error.message?.includes('No MultiFormat Readers were able to detect') ||
      error.message?.includes('NotFoundException');
    if (!isNotFoundException) {
      toast.error('Scanner error: ' + error.message);
    }
  };

  const clearScannedPatient = () => setScannedPatient(null);

  // General update helper — strip existing surgeries on the client as extra safety
  const handleUpdatePatient = async (patientId, updateData) => {
    try {
      const payload = { ...updateData };
      if (Array.isArray(payload.surgeries)) {
        payload.surgeries = payload.surgeries.filter(s => !s._id && s.name?.trim());
      }

      const response = await putJSON(`${API_BASE}/api/patients/${patientId}`, headers, payload);

      if (scannedPatient && (scannedPatient._id === patientId || scannedPatient.user?._id === patientId)) {
        setScannedPatient({
          ...response.patient,
          scannedAt: scannedPatient.scannedAt ?? undefined
        });
      }
      return response;
    } catch (error) {
      console.error('Doctor Dashboard - Error updating patient:', error);
      throw error;
    }
  };

  // If PatientDetails passes only its "formSurgeries" array, this keeps it append-only
  const handleSaveSurgeries = async (formSurgeries) => {
    if (!scannedPatient?._id) {
      toast.error('No patient selected');
      return;
    }
    const toAdd = (formSurgeries || []).filter(s => !s._id && s.name?.trim());
    if (toAdd.length === 0) {
      toast.info('No new surgeries to save');
      return;
    }
    const resp = await handleUpdatePatient(scannedPatient._id, { surgeries: toAdd });
    // Update local scanned patient surgeries so UI reflects save immediately
    if (resp?.patient?.surgeries) {
      setScannedPatient(prev => ({ ...prev, surgeries: resp.patient.surgeries }));
      toast.success('Surgeries saved');
    }
  };

  // Create prescription for scanned patient from second code
  const handleCreatePrescription = async () => {
    if (!scannedPatient) return;
    if (!rxMedicationName.trim() || !rxDosage.trim()) {
      toast.warn('Medication name and dosage are required');
      return;
    }

    try {
      // Resolve the patient's USER id (not the patient profile id)
      let userId = scannedPatient.user?._id
        || (scannedPatient.userId && typeof scannedPatient.userId === 'object' ? scannedPatient.userId._id : scannedPatient.userId);
      if (!userId) {
        // As a last resort, try if scannedPatient.user is an object/string
        userId = typeof scannedPatient.user === 'object' ? scannedPatient.user?._id : scannedPatient.user;
      }
      if (!userId || typeof userId !== 'string') {
        throw new Error('Unable to determine patient user id for prescription');
      }
      const now = new Date();
      const doctorName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Doctor';
      const prescriptionId = `RX-${now.getTime()}`;

      await postJSON(
        `${API_BASE}/api/medical-history/patient/${userId}/prescriptions`,
        headers,
        {
          prescriptionId,
          medicationName: rxMedicationName.trim(),
          dosage: rxDosage.trim(),
          quantity: rxQuantity || undefined,
          instructions: rxInstructions || undefined,
          prescribedBy: doctorName,
          prescribedDate: now.toISOString(),
          startDate: now.toISOString(),
          refills: Number(rxRefills) || 0,
          refillsUsed: 0,
          status: 'prescribed',
          reason: rxReason || undefined,
        }
      );

      toast.success('Prescription added to medical history');
      setRxMedicationName('');
      setRxDosage('');
      setRxQuantity('');
      setRxInstructions('');
      setRxRefills(0);
      setRxReason('');
    } catch (e) {
      toast.error('Failed to add prescription: ' + e.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-teal-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-600 p-3"><Stethoscope className="h-6 w-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-teal-900">Doctor Dashboard</h1>
              <p className="text-sm text-teal-900/70">Manage appointments and scan patient barcodes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nav Tabs */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'appointments' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Calendar className="h-4 w-4" /> Appointments
          </button>
          <button onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'scanner' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <QrCode className="h-4 w-4" /> Barcode Scanner
          </button>
          <button onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'alerts' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <AlertTriangle className="h-4 w-4" /> Patient Alerts
            {reports.filter(r => r.status === 'new').length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                {reports.filter(r => r.status === 'new').length}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'appointments' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
                <Users className="h-5 w-5" /> Today's Appointments
              </h2>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal-700" />
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}
                  className="rounded-lg border border-teal-200 px-3 py-2 text-sm" />
              </div>
            </div>

            {loading ? (
              <div className="text-teal-700">Loading appointments...</div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-teal-50 text-teal-900">
                    <tr>
                      <th className="text-left px-4 py-3">Time</th>
                      <th className="text-left px-4 py-3">Patient</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-6 text-center text-teal-900/60">No appointments for this date.</td></tr>
                    )}
                    {list.map((a) => (
                      <tr key={a._id} className="border-t border-teal-50">
                        <td className="px-4 py-3">
                          {new Date(a.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(a.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3">{a.patientId?.firstName} {a.patientId?.lastName}</td>
                        <td className="px-4 py-3 capitalize">{a.status}</td>
                        <td className="px-4 py-3">{a.reason || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
                <QrCode className="h-5 w-5" /> Patient Barcode Scanner
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Scanner Mode:</span>
                  <button onClick={() => setUseSimpleScanner(!useSimpleScanner)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${useSimpleScanner ? 'bg-gray-200 text-gray-700' : 'bg-teal-100 text-teal-700'}`}>
                    {useSimpleScanner ? 'Manual Input' : 'Camera Scanner'}
                  </button>
                </div>
                {scannedPatient && (
                  <button onClick={clearScannedPatient}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                    Clear Results
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {useSimpleScanner ? (
                  <SimpleBarcodeScanner onScan={handleBarcodeScan} onError={handleScannerError} isActive={activeTab === 'scanner'} />
                ) : (
                  <BarcodeScanner onScan={handleBarcodeScan} onError={handleScannerError} isActive={activeTab === 'scanner'} />
                )}
              </div>

              <div>
                {scanLoading ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4" />
                      <p className="text-teal-600">Looking up patient...</p>
                    </div>
                  </div>
                ) : scannedPatient ? (
                  <>
                    <PatientDetails
                      patient={scannedPatient}
                      scannedAt={scannedPatient.scannedAt}
                      onClose={clearScannedPatient}
                      userRole={user?.role}
                      onUpdatePatient={handleUpdatePatient}
                      onSaveSurgeries={handleSaveSurgeries}
                    />
                    
                    {/* Prescription form from second code */}
                    <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-md font-semibold text-teal-900 mb-3">Add Prescription</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Medication Name*</label>
                          <input
                            type="text"
                            value={rxMedicationName}
                            onChange={(e) => setRxMedicationName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="e.g., Amoxicillin"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Dosage*</label>
                          <input
                            type="text"
                            value={rxDosage}
                            onChange={(e) => setRxDosage(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="e.g., 500mg twice daily"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                          <input
                            type="text"
                            value={rxQuantity}
                            onChange={(e) => setRxQuantity(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="e.g., 30 tablets"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Refills</label>
                          <input
                            type="number"
                            min={0}
                            value={rxRefills}
                            onChange={(e) => setRxRefills(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Instructions</label>
                          <input
                            type="text"
                            value={rxInstructions}
                            onChange={(e) => setRxInstructions(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="e.g., Take after meals"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Reason</label>
                          <input
                            type="text"
                            value={rxReason}
                            onChange={(e) => setRxReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="e.g., Bacterial infection"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={handleCreatePrescription}
                          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm"
                        >
                          Save Prescription
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="text-center">
                      <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Scanned</h3>
                      <p className="text-sm text-gray-500">Scan a patient's barcode to view their details here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Patient Reports & Alerts
              </h2>
              <div className="flex items-center gap-2">
                <select value={reportStatusFilter} onChange={(e) => setReportStatusFilter(e.target.value)}
                  className="text-sm border border-teal-200 rounded-lg px-2 py-1">
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="responded">Responded</option>
                </select>
                <button onClick={loadReports}
                  className="px-4 py-2 text-sm text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors">
                  Refresh
                </button>
              </div>
            </div>

            {reportsLoading ? (
              <div className="text-teal-700">Loading patient reports...</div>
            ) : (
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Reports</h3>
                      <p className="text-sm text-gray-500">No patient reports have been submitted yet</p>
                    </div>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div key={report._id}
                      className={`bg-white rounded-lg border p-6 shadow-sm ${
                        report.status === 'new' ? 'border-red-200 bg-red-50' :
                        report.status === 'read' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full p-2 ${
                            report.priority === 'high' ? 'bg-red-100 text-red-600' :
                            report.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {report.patient.firstName} {report.patient.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {report.patient.email} • {report.patient.barcode}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                report.priority === 'high' ? 'bg-red-100 text-red-700' :
                                report.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>{report.priority.toUpperCase()}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                report.status === 'new' ? 'bg-red-100 text-red-700' :
                                report.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>{report.status.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString()} at{' '}
                          {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="mb-4"><p className="text-gray-800 whitespace-pre-wrap">{report.reportContent}</p></div>

                      {report.doctorResponse && (
                        <div className="mt-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-blue-900">Doctor Response</h4>
                            {report.respondedAt && (
                              <span className="text-xs text-blue-700">
                                {new Date(report.respondedAt).toLocaleDateString()} {new Date(report.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-blue-800 whitespace-pre-wrap mt-1">{report.doctorResponse}</p>
                          {report.respondedBy && (
                            <p className="text-xs text-blue-700 mt-2">By Dr. {report.respondedBy.firstName} {report.respondedBy.lastName}</p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {report.status === 'new' && (
                          <button onClick={() => handleMarkAsRead(report._id)}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors">
                            Mark as Read
                          </button>
                        )}
                        <button onClick={() => handleRespond(report._id)}
                          className="px-3 py-1 text-sm bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg transition-colors">
                          {respondingReportId === report._id ? 'Cancel' : 'Respond'}
                        </button>
                      </div>

                      {respondingReportId === report._id && (
                        <div className="mt-3">
                          <textarea className="w-full border border-teal-200 rounded-lg px-3 py-2 text-sm" rows={3}
                            placeholder="Type your response to the patient..." value={responseText}
                            onChange={(e) => setResponseText(e.target.value)} />
                          <div className="mt-2 flex items-center gap-2">
                            <button onClick={() => handleSubmitResponse(report._id)}
                              className="px-3 py-1 text-sm bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors">Send Response</button>
                            <button onClick={() => { setRespondingReportId(null); setResponseText(''); }}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}