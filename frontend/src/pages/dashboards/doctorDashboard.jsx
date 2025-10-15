// // // // // // src/pages/dashboards/doctorDashboard.jsx
// // // // // import React, { useEffect, useState } from 'react';
// // // // // import { API_BASE, useAuthHeaders, getJSON, putJSON } from '../../utils/api';
// // // // // import { Calendar, Users, QrCode, Stethoscope, Clock, UserCheck, AlertTriangle, MessageSquare } from 'lucide-react';
// // // // // import { toast } from 'react-toastify';
// // // // // import BarcodeScanner from '../../components/BarcodeScanner';
// // // // // import SimpleBarcodeScanner from '../../components/SimpleBarcodeScanner';
// // // // // import PatientDetails from '../../components/PatientDetails';
// // // // // import { useAuth } from '../../contexts/AuthContext';

// // // // // export default function DoctorDashboard() {
// // // // //   const { user } = useAuth();
// // // // //   const headers = useAuthHeaders();
// // // // //   const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [list, setList] = useState([]);
  
// // // // //   // Barcode scanning state
// // // // //   const [scannedPatient, setScannedPatient] = useState(null);
// // // // //   const [scanLoading, setScanLoading] = useState(false);
// // // // //   const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'scanner', or 'alerts'
// // // // //   const [useSimpleScanner, setUseSimpleScanner] = useState(false);
  
// // // // //   // Patient reports/alerts state
// // // // //   const [reports, setReports] = useState([]);
// // // // //   const [reportsLoading, setReportsLoading] = useState(false);
// // // // //   const [reportStatusFilter, setReportStatusFilter] = useState('all'); // all | new | read | responded
// // // // //   const [respondingReportId, setRespondingReportId] = useState(null);
// // // // //   const [responseText, setResponseText] = useState('');

// // // // //   const load = async () => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const data = await getJSON(`${API_BASE}/api/appointments/doctor/day?date=${date}`, headers);
// // // // //       setList(data.appointments || []);
// // // // //     } catch (e) {
// // // // //       toast.error(e.message);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => { load(); }, [date]);

// // // // //   // Load patient reports
// // // // //   const loadReports = async () => {
// // // // //     setReportsLoading(true);
// // // // //     try {
// // // // //       const qs = new URLSearchParams();
// // // // //       if (reportStatusFilter && reportStatusFilter !== 'all') qs.set('status', reportStatusFilter);
// // // // //       const data = await getJSON(`${API_BASE}/api/patient-reports/doctor${qs.toString() ? `?${qs.toString()}` : ''}`, headers);
// // // // //       setReports(data.reports || []);
// // // // //     } catch (e) {
// // // // //       toast.error('Failed to load patient reports: ' + e.message);
// // // // //     } finally {
// // // // //       setReportsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // Load reports when alerts tab is active
// // // // //   useEffect(() => {
// // // // //     if (activeTab === 'alerts') {
// // // // //       loadReports();
// // // // //     }
// // // // //   }, [activeTab, reportStatusFilter]);


// // // // //   // Mark report as read
// // // // //   const handleMarkAsRead = async (reportId) => {
// // // // //     try {
// // // // //       await putJSON(`${API_BASE}/api/patient-reports/${reportId}/read`, headers, {});
// // // // //       loadReports(); // Reload reports
// // // // //     } catch (error) {
// // // // //       toast.error('Failed to mark as read: ' + error.message);
// // // // //     }
// // // // //   };

// // // // //   // Respond to report
// // // // //   const handleRespond = (reportId) => {
// // // // //     if (respondingReportId === reportId) {
// // // // //       setRespondingReportId(null);
// // // // //       setResponseText('');
// // // // //     } else {
// // // // //       setRespondingReportId(reportId);
// // // // //       setResponseText('');
// // // // //     }
// // // // //   };

// // // // //   const handleSubmitResponse = async (reportId) => {
// // // // //     if (!responseText.trim()) {
// // // // //       toast.warn('Please enter a response');
// // // // //       return;
// // // // //     }
// // // // //     try {
// // // // //       await putJSON(`${API_BASE}/api/patient-reports/${reportId}/respond`, headers, {
// // // // //         doctorResponse: responseText,
// // // // //         status: 'responded'
// // // // //       });
// // // // //       toast.success('Response sent to patient');
// // // // //       setRespondingReportId(null);
// // // // //       setResponseText('');
// // // // //       loadReports();
// // // // //     } catch (error) {
// // // // //       toast.error('Failed to send response: ' + error.message);
// // // // //     }
// // // // //   };

// // // // //   // Handle barcode scan
// // // // //   const handleBarcodeScan = async (barcode) => {
// // // // //     console.log('Scanning barcode:', barcode);
// // // // //     setScanLoading(true);
// // // // //     try {
// // // // //       const response = await getJSON(`${API_BASE}/api/patients/barcode/${barcode}`, headers);
// // // // //       console.log('Patient response:', response);
// // // // //       setScannedPatient(response);
// // // // //       toast.success(`Patient found: ${response.user?.firstName} ${response.user?.lastName}`);
// // // // //     } catch (error) {
// // // // //       console.error('Error fetching patient:', error);
// // // // //       toast.error(`Patient not found: ${error.message || 'Error occurred'}`);
// // // // //       setScannedPatient(null);
// // // // //     } finally {
// // // // //       setScanLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // Handle scanner error
// // // // //   const handleScannerError = (error) => {
// // // // //     // Check for NotFoundException in multiple ways since the error structure can vary
// // // // //     const isNotFoundException = 
// // // // //       error.name === 'NotFoundException' || 
// // // // //       error.name === 'NotFoundException2' ||
// // // // //       error.message?.includes('No MultiFormat Readers were able to detect') ||
// // // // //       error.message?.includes('NotFoundException');
    
// // // // //     // Don't show error for NotFoundException (normal when no barcode detected)
// // // // //     if (!isNotFoundException) {
// // // // //       console.error('Scanner error:', error);
// // // // //       toast.error('Scanner error: ' + error.message);
// // // // //     }
// // // // //   };

// // // // //   // Clear scanned patient
// // // // //   const clearScannedPatient = () => {
// // // // //     setScannedPatient(null);
// // // // //   };

// // // // //   // Update patient medications
// // // // //   const handleUpdatePatient = async (patientId, updateData) => {
// // // // //     try {
// // // // //       console.log('Doctor Dashboard - Updating patient:', patientId);
// // // // //       console.log('Doctor Dashboard - Update data:', updateData);
// // // // //       console.log('Doctor Dashboard - API URL:', `${API_BASE}/api/patients/${patientId}`);
// // // // //       console.log('Doctor Dashboard - Headers:', headers);
      
// // // // //       const response = await putJSON(`${API_BASE}/api/patients/${patientId}`, headers, updateData);
      
// // // // //       console.log('Doctor Dashboard - Response:', response);
      
// // // // //       // Update the scanned patient data with the response from the server
// // // // //       if (scannedPatient && (scannedPatient._id === patientId || scannedPatient.user?._id === patientId)) {
// // // // //         setScannedPatient({
// // // // //           ...scannedPatient,
// // // // //           ...response.patient // Use the updated patient data from the server response
// // // // //         });
// // // // //       }
      
// // // // //       return response;
// // // // //     } catch (error) {
// // // // //       console.error('Doctor Dashboard - Error updating patient:', error);
// // // // //       console.error('Doctor Dashboard - Error details:', error.message);
// // // // //       throw error;
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <main className="min-h-screen bg-gray-50">
// // // // //       {/* Header */}
// // // // //       <section className="bg-white border-b border-teal-100">
// // // // //         <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
// // // // //           <div className="flex items-center gap-3">
// // // // //             <div className="rounded-xl bg-teal-600 p-3">
// // // // //               <Stethoscope className="h-6 w-6 text-white" />
// // // // //             </div>
// // // // //             <div>
// // // // //               <h1 className="text-2xl font-bold text-teal-900">
// // // // //                 Doctor Dashboard
// // // // //               </h1>
// // // // //               <p className="text-sm text-teal-900/70">
// // // // //                 Manage appointments and scan patient barcodes
// // // // //               </p>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </section>

// // // // //       {/* Navigation Tabs */}
// // // // //       <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
// // // // //         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
// // // // //           <button
// // // // //             onClick={() => setActiveTab('appointments')}
// // // // //             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// // // // //               activeTab === 'appointments'
// // // // //                 ? 'bg-white text-teal-700 shadow-sm'
// // // // //                 : 'text-gray-600 hover:text-gray-900'
// // // // //             }`}
// // // // //           >
// // // // //             <Calendar className="h-4 w-4" />
// // // // //             Appointments
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={() => setActiveTab('scanner')}
// // // // //             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// // // // //               activeTab === 'scanner'
// // // // //                 ? 'bg-white text-teal-700 shadow-sm'
// // // // //                 : 'text-gray-600 hover:text-gray-900'
// // // // //             }`}
// // // // //           >
// // // // //             <QrCode className="h-4 w-4" />
// // // // //             Barcode Scanner
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={() => setActiveTab('alerts')}
// // // // //             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// // // // //               activeTab === 'alerts'
// // // // //                 ? 'bg-white text-teal-700 shadow-sm'
// // // // //                 : 'text-gray-600 hover:text-gray-900'
// // // // //             }`}
// // // // //           >
// // // // //             <AlertTriangle className="h-4 w-4" />
// // // // //             Patient Alerts
// // // // //             {reports.filter(r => r.status === 'new').length > 0 && (
// // // // //               <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
// // // // //                 {reports.filter(r => r.status === 'new').length}
// // // // //               </span>
// // // // //             )}
// // // // //           </button>
// // // // //         </div>
// // // // //       </section>

// // // // //       {/* Content */}
// // // // //       <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
// // // // //         {activeTab === 'appointments' && (
// // // // //           <div>
// // // // //             <div className="flex items-center justify-between mb-6">
// // // // //               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
// // // // //                 <Users className="h-5 w-5" />
// // // // //                 Today's Appointments
// // // // //               </h2>
// // // // //               <div className="flex items-center gap-2">
// // // // //                 <Calendar className="h-4 w-4 text-teal-700" />
// // // // //                 <input
// // // // //                   type="date"
// // // // //                   value={date}
// // // // //                   onChange={(e)=>setDate(e.target.value)}
// // // // //                   className="rounded-lg border border-teal-200 px-3 py-2 text-sm"
// // // // //                 />
// // // // //               </div>
// // // // //             </div>

// // // // //             {loading ? (
// // // // //               <div className="text-teal-700">Loading appointments...</div>
// // // // //             ) : (
// // // // //               <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white">
// // // // //                 <table className="w-full text-sm">
// // // // //                   <thead className="bg-teal-50 text-teal-900">
// // // // //                     <tr>
// // // // //                       <th className="text-left px-4 py-3">Time</th>
// // // // //                       <th className="text-left px-4 py-3">Patient</th>
// // // // //                       <th className="text-left px-4 py-3">Status</th>
// // // // //                       <th className="text-left px-4 py-3">Reason</th>
// // // // //                     </tr>
// // // // //                   </thead>
// // // // //                   <tbody>
// // // // //                     {list.length === 0 && (
// // // // //                       <tr>
// // // // //                         <td colSpan={4} className="px-4 py-6 text-center text-teal-900/60">
// // // // //                           No appointments for this date.
// // // // //                         </td>
// // // // //                       </tr>
// // // // //                     )}
// // // // //                     {list.map((a) => (
// // // // //                       <tr key={a._id} className="border-t border-teal-50">
// // // // //                         <td className="px-4 py-3">
// // // // //                           {new Date(a.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(a.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // // //                         </td>
// // // // //                         <td className="px-4 py-3">
// // // // //                           {a.patientId?.firstName} {a.patientId?.lastName}
// // // // //                         </td>
// // // // //                         <td className="px-4 py-3 capitalize">{a.status}</td>
// // // // //                         <td className="px-4 py-3">{a.reason || '-'}</td>
// // // // //                       </tr>
// // // // //                     ))}
// // // // //                   </tbody>
// // // // //                 </table>
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         )}

// // // // //         {activeTab === 'scanner' && (
// // // // //           <div className="space-y-6">
// // // // //             <div className="flex items-center justify-between">
// // // // //               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
// // // // //                 <QrCode className="h-5 w-5" />
// // // // //                 Patient Barcode Scanner
// // // // //               </h2>
// // // // //               <div className="flex items-center gap-3">
// // // // //                 <div className="flex items-center gap-2">
// // // // //                   <span className="text-sm text-gray-600">Scanner Mode:</span>
// // // // //                   <button
// // // // //                     onClick={() => setUseSimpleScanner(!useSimpleScanner)}
// // // // //                     className={`px-3 py-1 text-xs rounded-lg transition-colors ${
// // // // //                       useSimpleScanner
// // // // //                         ? 'bg-gray-200 text-gray-700'
// // // // //                         : 'bg-teal-100 text-teal-700'
// // // // //                     }`}
// // // // //                   >
// // // // //                     {useSimpleScanner ? 'Manual Input' : 'Camera Scanner'}
// // // // //                   </button>
// // // // //                 </div>
// // // // //                 {scannedPatient && (
// // // // //                   <button
// // // // //                     onClick={clearScannedPatient}
// // // // //                     className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
// // // // //                   >
// // // // //                     Clear Results
// // // // //                   </button>
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>

// // // // //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // // // //               {/* Scanner */}
// // // // //               <div>
// // // // //                 {useSimpleScanner ? (
// // // // //                   <SimpleBarcodeScanner
// // // // //                     onScan={handleBarcodeScan}
// // // // //                     onError={handleScannerError}
// // // // //                     isActive={activeTab === 'scanner'}
// // // // //                   />
// // // // //                 ) : (
// // // // //                   <BarcodeScanner
// // // // //                     onScan={handleBarcodeScan}
// // // // //                     onError={handleScannerError}
// // // // //                     isActive={activeTab === 'scanner'}
// // // // //                   />
// // // // //                 )}
// // // // //               </div>

// // // // //               {/* Patient Details */}
// // // // //               <div>
// // // // //                 {scanLoading ? (
// // // // //                   <div className="bg-white rounded-lg border border-gray-200 p-8">
// // // // //                     <div className="text-center">
// // // // //                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
// // // // //                       <p className="text-teal-600">Looking up patient...</p>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ) : scannedPatient ? (
// // // // //                   <PatientDetails
// // // // //                     patient={scannedPatient}
// // // // //                     scannedAt={scannedPatient.scannedAt}
// // // // //                     onClose={clearScannedPatient}
// // // // //                     userRole={user?.role}
// // // // //                     onUpdatePatient={handleUpdatePatient}
// // // // //                   />
// // // // //                 ) : (
// // // // //                   <div className="bg-white rounded-lg border border-gray-200 p-8">
// // // // //                     <div className="text-center">
// // // // //                       <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// // // // //                       <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Scanned</h3>
// // // // //                       <p className="text-sm text-gray-500">
// // // // //                         Scan a patient's barcode to view their details here
// // // // //                       </p>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {activeTab === 'alerts' && (
// // // // //           <div className="space-y-6">
// // // // //             <div className="flex items-center justify-between">
// // // // //               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
// // // // //                 <AlertTriangle className="h-5 w-5" />
// // // // //                 Patient Reports & Alerts
// // // // //               </h2>
// // // // //               <div className="flex items-center gap-2">
// // // // //                 <select
// // // // //                   value={reportStatusFilter}
// // // // //                   onChange={(e) => setReportStatusFilter(e.target.value)}
// // // // //                   className="text-sm border border-teal-200 rounded-lg px-2 py-1"
// // // // //                 >
// // // // //                   <option value="all">All</option>
// // // // //                   <option value="new">New</option>
// // // // //                   <option value="read">Read</option>
// // // // //                   <option value="responded">Responded</option>
// // // // //                 </select>
// // // // //                 <button
// // // // //                   onClick={loadReports}
// // // // //                   className="px-4 py-2 text-sm text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors"
// // // // //                 >
// // // // //                   Refresh
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>

// // // // //             {reportsLoading ? (
// // // // //               <div className="text-teal-700">Loading patient reports...</div>
// // // // //             ) : (
// // // // //               <div className="space-y-4">
// // // // //                 {reports.length === 0 ? (
// // // // //                   <div className="bg-white rounded-lg border border-gray-200 p-8">
// // // // //                     <div className="text-center">
// // // // //                       <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// // // // //                       <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Reports</h3>
// // // // //                       <p className="text-sm text-gray-500">
// // // // //                         No patient reports have been submitted yet
// // // // //                       </p>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ) : (
// // // // //                   reports.map((report) => (
// // // // //                     <div
// // // // //                       key={report._id}
// // // // //                       className={`bg-white rounded-lg border p-6 shadow-sm ${
// // // // //                         report.status === 'new' ? 'border-red-200 bg-red-50' : 
// // // // //                         report.status === 'read' ? 'border-yellow-200 bg-yellow-50' : 
// // // // //                         'border-green-200 bg-green-50'
// // // // //                       }`}
// // // // //                     >
// // // // //                       <div className="flex items-start justify-between mb-4">
// // // // //                         <div className="flex items-center gap-3">
// // // // //                           <div className={`rounded-full p-2 ${
// // // // //                             report.priority === 'high' ? 'bg-red-100 text-red-600' :
// // // // //                             report.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
// // // // //                             'bg-green-100 text-green-600'
// // // // //                           }`}>
// // // // //                             <AlertTriangle className="h-4 w-4" />
// // // // //                           </div>
// // // // //                           <div>
// // // // //                             <h3 className="font-semibold text-gray-900">
// // // // //                               {report.patient.firstName} {report.patient.lastName}
// // // // //                             </h3>
// // // // //                             <p className="text-sm text-gray-600">
// // // // //                               {report.patient.email} • {report.patient.barcode}
// // // // //                             </p>
// // // // //                             <div className="flex items-center gap-2 mt-1">
// // // // //                               <span className={`text-xs px-2 py-1 rounded-full ${
// // // // //                                 report.priority === 'high' ? 'bg-red-100 text-red-700' :
// // // // //                                 report.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
// // // // //                                 'bg-green-100 text-green-700'
// // // // //                               }`}>
// // // // //                                 {report.priority.toUpperCase()}
// // // // //                               </span>
// // // // //                               <span className={`text-xs px-2 py-1 rounded-full ${
// // // // //                                 report.status === 'new' ? 'bg-red-100 text-red-700' :
// // // // //                                 report.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
// // // // //                                 'bg-green-100 text-green-700'
// // // // //                               }`}>
// // // // //                                 {report.status.toUpperCase()}
// // // // //                               </span>
// // // // //                             </div>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                         <div className="text-right text-sm text-gray-500">
// // // // //                           {new Date(report.createdAt).toLocaleDateString()} at{' '}
// // // // //                           {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // // //                         </div>
// // // // //                       </div>

// // // // //                       <div className="mb-4">
// // // // //                         <p className="text-gray-800 whitespace-pre-wrap">{report.reportContent}</p>
// // // // //                       </div>

// // // // //                       {report.doctorResponse && (
// // // // //                         <div className="mt-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
// // // // //                           <div className="flex items-center justify-between">
// // // // //                             <h4 className="font-medium text-blue-900">Doctor Response</h4>
// // // // //                             {report.respondedAt && (
// // // // //                               <span className="text-xs text-blue-700">
// // // // //                                 {new Date(report.respondedAt).toLocaleDateString()} {new Date(report.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // // //                               </span>
// // // // //                             )}
// // // // //                           </div>
// // // // //                           <p className="text-blue-800 whitespace-pre-wrap mt-1">{report.doctorResponse}</p>
// // // // //                           {report.respondedBy && (
// // // // //                             <p className="text-xs text-blue-700 mt-2">By Dr. {report.respondedBy.firstName} {report.respondedBy.lastName}</p>
// // // // //                           )}
// // // // //                         </div>
// // // // //                       )}

// // // // //                       <div className="flex items-center gap-3">
// // // // //                         {report.status === 'new' && (
// // // // //                           <button
// // // // //                             onClick={() => handleMarkAsRead(report._id)}
// // // // //                             className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors"
// // // // //                           >
// // // // //                             Mark as Read
// // // // //                           </button>
// // // // //                         )}
// // // // //                         <button
// // // // //                           onClick={() => handleRespond(report._id)}
// // // // //                           className="px-3 py-1 text-sm bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg transition-colors"
// // // // //                         >
// // // // //                           {respondingReportId === report._id ? 'Cancel' : 'Respond'}
// // // // //                         </button>
// // // // //                       </div>

// // // // //                       {respondingReportId === report._id && (
// // // // //                         <div className="mt-3">
// // // // //                           <textarea
// // // // //                             className="w-full border border-teal-200 rounded-lg px-3 py-2 text-sm"
// // // // //                             rows={3}
// // // // //                             placeholder="Type your response to the patient..."
// // // // //                             value={responseText}
// // // // //                             onChange={(e) => setResponseText(e.target.value)}
// // // // //                           />
// // // // //                           <div className="mt-2 flex items-center gap-2">
// // // // //                             <button
// // // // //                               onClick={() => handleSubmitResponse(report._id)}
// // // // //                               className="px-3 py-1 text-sm bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors"
// // // // //                             >
// // // // //                               Send Response
// // // // //                             </button>
// // // // //                             <button
// // // // //                               onClick={() => { setRespondingReportId(null); setResponseText(''); }}
// // // // //                               className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
// // // // //                             >
// // // // //                               Cancel
// // // // //                             </button>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                       )}
// // // // //                     </div>
// // // // //                   ))
// // // // //                 )}
// // // // //               </div>
// // // // //             )}

// // // // //           </div>
// // // // //         )}
// // // // //       </section>
// // // // //     </main>
// // // // //   );
// // // // // }

// // // // // src/pages/dashboards/doctorDashboard.jsx
// // // // import React, { useEffect, useState } from 'react';
// // // // import { API_BASE, useAuthHeaders, getJSON, putJSON } from '../../utils/api';
// // // // import { Calendar, Users, QrCode, Stethoscope, Clock, UserCheck, AlertTriangle, MessageSquare } from 'lucide-react';
// // // // import { toast } from 'react-toastify';
// // // // import BarcodeScanner from '../../components/BarcodeScanner';
// // // // import SimpleBarcodeScanner from '../../components/SimpleBarcodeScanner';
// // // // import PatientDetails from '../../components/PatientDetails';
// // // // import { useAuth } from '../../contexts/AuthContext';

// // // // export default function DoctorDashboard() {
// // // //   const { user } = useAuth();
// // // //   const headers = useAuthHeaders();
// // // //   const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [list, setList] = useState([]);
  
// // // //   // Barcode scanning state
// // // //   const [scannedPatient, setScannedPatient] = useState(null);
// // // //   const [scanLoading, setScanLoading] = useState(false);
// // // //   const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'scanner', or 'alerts'
// // // //   const [useSimpleScanner, setUseSimpleScanner] = useState(false);
  
// // // //   // Patient reports/alerts state
// // // //   const [reports, setReports] = useState([]);
// // // //   const [reportsLoading, setReportsLoading] = useState(false);
// // // //   const [reportStatusFilter, setReportStatusFilter] = useState('all'); // all | new | read | responded
// // // //   const [respondingReportId, setRespondingReportId] = useState(null);
// // // //   const [responseText, setResponseText] = useState('');

// // // //   const load = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const data = await getJSON(`${API_BASE}/api/appointments/doctor/day?date=${date}`, headers);
// // // //       setList(data.appointments || []);
// // // //     } catch (e) {
// // // //       toast.error(e.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => { load(); }, [date]);

// // // //   // Load patient reports
// // // //   const loadReports = async () => {
// // // //     setReportsLoading(true);
// // // //     try {
// // // //       const qs = new URLSearchParams();
// // // //       if (reportStatusFilter && reportStatusFilter !== 'all') qs.set('status', reportStatusFilter);
// // // //       const data = await getJSON(`${API_BASE}/api/patient-reports/doctor${qs.toString() ? `?${qs.toString()}` : ''}`, headers);
// // // //       setReports(data.reports || []);
// // // //     } catch (e) {
// // // //       toast.error('Failed to load patient reports: ' + e.message);
// // // //     } finally {
// // // //       setReportsLoading(false);
// // // //     }
// // // //   };

// // // //   // Load reports when alerts tab is active
// // // //   useEffect(() => {
// // // //     if (activeTab === 'alerts') {
// // // //       loadReports();
// // // //     }
// // // //   }, [activeTab, reportStatusFilter]);


// // // //   // Mark report as read
// // // //   const handleMarkAsRead = async (reportId) => {
// // // //     try {
// // // //       await putJSON(`${API_BASE}/api/patient-reports/${reportId}/read`, headers, {});
// // // //       loadReports(); // Reload reports
// // // //     } catch (error) {
// // // //       toast.error('Failed to mark as read: ' + error.message);
// // // //     }
// // // //   };

// // // //   // Respond to report
// // // //   const handleRespond = (reportId) => {
// // // //     if (respondingReportId === reportId) {
// // // //       setRespondingReportId(null);
// // // //       setResponseText('');
// // // //     } else {
// // // //       setRespondingReportId(reportId);
// // // //       setResponseText('');
// // // //     }
// // // //   };

// // // //   const handleSubmitResponse = async (reportId) => {
// // // //     if (!responseText.trim()) {
// // // //       toast.warn('Please enter a response');
// // // //       return;
// // // //     }
// // // //     try {
// // // //       await putJSON(`${API_BASE}/api/patient-reports/${reportId}/respond`, headers, {
// // // //         doctorResponse: responseText,
// // // //         status: 'responded'
// // // //       });
// // // //       toast.success('Response sent to patient');
// // // //       setRespondingReportId(null);
// // // //       setResponseText('');
// // // //       loadReports();
// // // //     } catch (error) {
// // // //       toast.error('Failed to send response: ' + error.message);
// // // //     }
// // // //   };

// // // //   // Handle barcode scan
// // // //   const handleBarcodeScan = async (barcode) => {
// // // //     console.log('Scanning barcode:', barcode);
// // // //     setScanLoading(true);
// // // //     try {
// // // //       const response = await getJSON(`${API_BASE}/api/patients/barcode/${barcode}`, headers);
// // // //       console.log('Patient response:', response);
// // // //       setScannedPatient(response);
// // // //       toast.success(`Patient found: ${response.user?.firstName} ${response.user?.lastName}`);
// // // //     } catch (error) {
// // // //       console.error('Error fetching patient:', error);
// // // //       toast.error(`Patient not found: ${error.message || 'Error occurred'}`);
// // // //       setScannedPatient(null);
// // // //     } finally {
// // // //       setScanLoading(false);
// // // //     }
// // // //   };

// // // //   // Handle scanner error
// // // //   const handleScannerError = (error) => {
// // // //     // Check for NotFoundException in multiple ways since the error structure can vary
// // // //     const isNotFoundException = 
// // // //       error.name === 'NotFoundException' || 
// // // //       error.name === 'NotFoundException2' ||
// // // //       error.message?.includes('No MultiFormat Readers were able to detect') ||
// // // //       error.message?.includes('NotFoundException');
    
// // // //     // Don't show error for NotFoundException (normal when no barcode detected)
// // // //     if (!isNotFoundException) {
// // // //       console.error('Scanner error:', error);
// // // //       toast.error('Scanner error: ' + error.message);
// // // //     }
// // // //   };

// // // //   // Clear scanned patient
// // // //   const clearScannedPatient = () => {
// // // //     setScannedPatient(null);
// // // //   };

// // // //   // Update patient (e.g., add surgery, meds, etc.)
// // // //   const handleUpdatePatient = async (patientId, updateData) => {
// // // //     try {
// // // //       console.log('Doctor Dashboard - Updating patient:', patientId);
// // // //       console.log('Doctor Dashboard - Update data:', updateData);
// // // //       console.log('Doctor Dashboard - API URL:', `${API_BASE}/api/patients/${patientId}`);
// // // //       console.log('Doctor Dashboard - Headers:', headers);
      
// // // //       const response = await putJSON(`${API_BASE}/api/patients/${patientId}`, headers, updateData);
      
// // // //       console.log('Doctor Dashboard - Response:', response);
      
// // // //       // 🔑 Always replace with the server’s version to avoid client-side duplication,
// // // //       // while keeping scannedAt if you show it in the card.
// // // //       if (scannedPatient && (scannedPatient._id === patientId || scannedPatient.user?._id === patientId)) {
// // // //         setScannedPatient({
// // // //           ...response.patient,
// // // //           scannedAt: scannedPatient.scannedAt ?? undefined
// // // //         });
// // // //       }
      
// // // //       return response;
// // // //     } catch (error) {
// // // //       console.error('Doctor Dashboard - Error updating patient:', error);
// // // //       console.error('Doctor Dashboard - Error details:', error.message);
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   return (
// // // //     <main className="min-h-screen bg-gray-50">
// // // //       {/* Header */}
// // // //       <section className="bg-white border-b border-teal-100">
// // // //         <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
// // // //           <div className="flex items-center gap-3">
// // // //             <div className="rounded-xl bg-teal-600 p-3">
// // // //               <Stethoscope className="h-6 w-6 text-white" />
// // // //             </div>
// // // //             <div>
// // // //               <h1 className="text-2xl font-bold text-teal-900">
// // // //                 Doctor Dashboard
// // // //               </h1>
// // // //               <p className="text-sm text-teal-900/70">
// // // //                 Manage appointments and scan patient barcodes
// // // //               </p>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </section>

// // // //       {/* Navigation Tabs */}
// // // //       <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
// // // //         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
// // // //           <button
// // // //             onClick={() => setActiveTab('appointments')}
// // // //             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// // // //               activeTab === 'appointments'
// // // //                 ? 'bg-white text-teal-700 shadow-sm'
// // // //                 : 'text-gray-600 hover:text-gray-900'
// // // //             }`}
// // // //           >
// // // //             <Calendar className="h-4 w-4" />
// // // //             Appointments
// // // //           </button>
// // // //           <button
// // // //             onClick={() => setActiveTab('scanner')}
// // // //             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// // // //               activeTab === 'scanner'
// // // //                 ? 'bg-white text-teal-700 shadow-sm'
// // // //                 : 'text-gray-600 hover:text-gray-900'
// // // //             }`}
// // // //           >
// // // //             <QrCode className="h-4 w-4" />
// // // //             Barcode Scanner
// // // //           </button>
// // // //           <button
// // // //             onClick={() => setActiveTab('alerts')}
// // // //             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// // // //               activeTab === 'alerts'
// // // //                 ? 'bg-white text-teal-700 shadow-sm'
// // // //                 : 'text-gray-600 hover:text-gray-900'
// // // //             }`}
// // // //           >
// // // //             <AlertTriangle className="h-4 w-4" />
// // // //             Patient Alerts
// // // //             {reports.filter(r => r.status === 'new').length > 0 && (
// // // //               <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
// // // //                 {reports.filter(r => r.status === 'new').length}
// // // //               </span>
// // // //             )}
// // // //           </button>
// // // //         </div>
// // // //       </section>

// // // //       {/* Content */}
// // // //       <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
// // // //         {activeTab === 'appointments' && (
// // // //           <div>
// // // //             <div className="flex items-center justify-between mb-6">
// // // //               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
// // // //                 <Users className="h-5 w-5" />
// // // //                 Today's Appointments
// // // //               </h2>
// // // //               <div className="flex items-center gap-2">
// // // //                 <Calendar className="h-4 w-4 text-teal-700" />
// // // //                 <input
// // // //                   type="date"
// // // //                   value={date}
// // // //                   onChange={(e)=>setDate(e.target.value)}
// // // //                   className="rounded-lg border border-teal-200 px-3 py-2 text-sm"
// // // //                 />
// // // //               </div>
// // // //             </div>

// // // //             {loading ? (
// // // //               <div className="text-teal-700">Loading appointments...</div>
// // // //             ) : (
// // // //               <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white">
// // // //                 <table className="w-full text-sm">
// // // //                   <thead className="bg-teal-50 text-teal-900">
// // // //                     <tr>
// // // //                       <th className="text-left px-4 py-3">Time</th>
// // // //                       <th className="text-left px-4 py-3">Patient</th>
// // // //                       <th className="text-left px-4 py-3">Status</th>
// // // //                       <th className="text-left px-4 py-3">Reason</th>
// // // //                     </tr>
// // // //                   </thead>
// // // //                   <tbody>
// // // //                     {list.length === 0 && (
// // // //                       <tr>
// // // //                         <td colSpan={4} className="px-4 py-6 text-center text-teal-900/60">
// // // //                           No appointments for this date.
// // // //                         </td>
// // // //                       </tr>
// // // //                     )}
// // // //                     {list.map((a) => (
// // // //                       <tr key={a._id} className="border-t border-teal-50">
// // // //                         <td className="px-4 py-3">
// // // //                           {new Date(a.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(a.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // //                         </td>
// // // //                         <td className="px-4 py-3">
// // // //                           {a.patientId?.firstName} {a.patientId?.lastName}
// // // //                         </td>
// // // //                         <td className="px-4 py-3 capitalize">{a.status}</td>
// // // //                         <td className="px-4 py-3">{a.reason || '-'}</td>
// // // //                       </tr>
// // // //                     ))}
// // // //                   </tbody>
// // // //                 </table>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {activeTab === 'scanner' && (
// // // //           <div className="space-y-6">
// // // //             <div className="flex items-center justify-between">
// // // //               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
// // // //                 <QrCode className="h-5 w-5" />
// // // //                 Patient Barcode Scanner
// // // //               </h2>
// // // //               <div className="flex items-center gap-3">
// // // //                 <div className="flex items-center gap-2">
// // // //                   <span className="text-sm text-gray-600">Scanner Mode:</span>
// // // //                   <button
// // // //                     onClick={() => setUseSimpleScanner(!useSimpleScanner)}
// // // //                     className={`px-3 py-1 text-xs rounded-lg transition-colors ${
// // // //                       useSimpleScanner
// // // //                         ? 'bg-gray-200 text-gray-700'
// // // //                         : 'bg-teal-100 text-teal-700'
// // // //                     }`}
// // // //                   >
// // // //                     {useSimpleScanner ? 'Manual Input' : 'Camera Scanner'}
// // // //                   </button>
// // // //                 </div>
// // // //                 {scannedPatient && (
// // // //                   <button
// // // //                     onClick={clearScannedPatient}
// // // //                     className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
// // // //                   >
// // // //                     Clear Results
// // // //                   </button>
// // // //                 )}
// // // //               </div>
// // // //             </div>

// // // //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // // //               {/* Scanner */}
// // // //               <div>
// // // //                 {useSimpleScanner ? (
// // // //                   <SimpleBarcodeScanner
// // // //                     onScan={handleBarcodeScan}
// // // //                     onError={handleScannerError}
// // // //                     isActive={activeTab === 'scanner'}
// // // //                   />
// // // //                 ) : (
// // // //                   <BarcodeScanner
// // // //                     onScan={handleBarcodeScan}
// // // //                     onError={handleScannerError}
// // // //                     isActive={activeTab === 'scanner'}
// // // //                   />
// // // //                 )}
// // // //               </div>

// // // //               {/* Patient Details */}
// // // //               <div>
// // // //                 {scanLoading ? (
// // // //                   <div className="bg-white rounded-lg border border-gray-200 p-8">
// // // //                     <div className="text-center">
// // // //                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
// // // //                       <p className="text-teal-600">Looking up patient...</p>
// // // //                     </div>
// // // //                   </div>
// // // //                 ) : scannedPatient ? (
// // // //                   <PatientDetails
// // // //                     patient={scannedPatient}
// // // //                     scannedAt={scannedPatient.scannedAt}
// // // //                     onClose={clearScannedPatient}
// // // //                     userRole={user?.role}
// // // //                     onUpdatePatient={handleUpdatePatient}
// // // //                   />
// // // //                 ) : (
// // // //                   <div className="bg-white rounded-lg border border-gray-200 p-8">
// // // //                     <div className="text-center">
// // // //                       <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// // // //                       <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Scanned</h3>
// // // //                       <p className="text-sm text-gray-500">
// // // //                         Scan a patient's barcode to view their details here
// // // //                       </p>
// // // //                     </div>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {activeTab === 'alerts' && (
// // // //           <div className="space-y-6">
// // // //             <div className="flex items-center justify-between">
// // // //               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
// // // //                 <AlertTriangle className="h-5 w-5" />
// // // //                 Patient Reports & Alerts
// // // //               </h2>
// // // //               <div className="flex items-center gap-2">
// // // //                 <select
// // // //                   value={reportStatusFilter}
// // // //                   onChange={(e) => setReportStatusFilter(e.target.value)}
// // // //                   className="text-sm border border-teal-200 rounded-lg px-2 py-1"
// // // //                 >
// // // //                   <option value="all">All</option>
// // // //                   <option value="new">New</option>
// // // //                   <option value="read">Read</option>
// // // //                   <option value="responded">Responded</option>
// // // //                 </select>
// // // //                 <button
// // // //                   onClick={loadReports}
// // // //                   className="px-4 py-2 text-sm text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors"
// // // //                 >
// // // //                   Refresh
// // // //                 </button>
// // // //               </div>
// // // //             </div>

// // // //             {reportsLoading ? (
// // // //               <div className="text-teal-700">Loading patient reports...</div>
// // // //             ) : (
// // // //               <div className="space-y-4">
// // // //                 {reports.length === 0 ? (
// // // //                   <div className="bg-white rounded-lg border border-gray-200 p-8">
// // // //                     <div className="text-center">
// // // //                       <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// // // //                       <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Reports</h3>
// // // //                       <p className="text-sm text-gray-500">
// // // //                         No patient reports have been submitted yet
// // // //                       </p>
// // // //                     </div>
// // // //                   </div>
// // // //                 ) : (
// // // //                   reports.map((report) => (
// // // //                     <div
// // // //                       key={report._id}
// // // //                       className={`bg-white rounded-lg border p-6 shadow-sm ${
// // // //                         report.status === 'new' ? 'border-red-200 bg-red-50' : 
// // // //                         report.status === 'read' ? 'border-yellow-200 bg-yellow-50' : 
// // // //                         'border-green-200 bg-green-50'
// // // //                       }`}
// // // //                     >
// // // //                       <div className="flex items-start justify-between mb-4">
// // // //                         <div className="flex items-center gap-3">
// // // //                           <div className={`rounded-full p-2 ${
// // // //                             report.priority === 'high' ? 'bg-red-100 text-red-600' :
// // // //                             report.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
// // // //                             'bg-green-100 text-green-600'
// // // //                           }`}>
// // // //                             <AlertTriangle className="h-4 w-4" />
// // // //                           </div>
// // // //                           <div>
// // // //                             <h3 className="font-semibold text-gray-900">
// // // //                               {report.patient.firstName} {report.patient.lastName}
// // // //                             </h3>
// // // //                             <p className="text-sm text-gray-600">
// // // //                               {report.patient.email} • {report.patient.barcode}
// // // //                             </p>
// // // //                             <div className="flex items-center gap-2 mt-1">
// // // //                               <span className={`text-xs px-2 py-1 rounded-full ${
// // // //                                 report.priority === 'high' ? 'bg-red-100 text-red-700' :
// // // //                                 report.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
// // // //                                 'bg-green-100 text-green-700'
// // // //                               }`}>
// // // //                                 {report.priority.toUpperCase()}
// // // //                               </span>
// // // //                               <span className={`text-xs px-2 py-1 rounded-full ${
// // // //                                 report.status === 'new' ? 'bg-red-100 text-red-700' :
// // // //                                 report.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
// // // //                                 'bg-green-100 text-green-700'
// // // //                               }`}>
// // // //                                 {report.status.toUpperCase()}
// // // //                               </span>
// // // //                             </div>
// // // //                           </div>
// // // //                         </div>
// // // //                         <div className="text-right text-sm text-gray-500">
// // // //                           {new Date(report.createdAt).toLocaleDateString()} at{' '}
// // // //                           {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // //                         </div>
// // // //                       </div>

// // // //                       <div className="mb-4">
// // // //                         <p className="text-gray-800 whitespace-pre-wrap">{report.reportContent}</p>
// // // //                       </div>

// // // //                       {report.doctorResponse && (
// // // //                         <div className="mt-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
// // // //                           <div className="flex items-center justify-between">
// // // //                             <h4 className="font-medium text-blue-900">Doctor Response</h4>
// // // //                             {report.respondedAt && (
// // // //                               <span className="text-xs text-blue-700">
// // // //                                 {new Date(report.respondedAt).toLocaleDateString()} {new Date(report.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // //                               </span>
// // // //                             )}
// // // //                           </div>
// // // //                           <p className="text-blue-800 whitespace-pre-wrap mt-1">{report.doctorResponse}</p>
// // // //                           {report.respondedBy && (
// // // //                             <p className="text-xs text-blue-700 mt-2">By Dr. {report.respondedBy.firstName} {report.respondedBy.lastName}</p>
// // // //                           )}
// // // //                         </div>
// // // //                       )}

// // // //                       <div className="flex items-center gap-3">
// // // //                         {report.status === 'new' && (
// // // //                           <button
// // // //                             onClick={() => handleMarkAsRead(report._id)}
// // // //                             className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors"
// // // //                           >
// // // //                             Mark as Read
// // // //                           </button>
// // // //                         )}
// // // //                         <button
// // // //                           onClick={() => handleRespond(report._id)}
// // // //                           className="px-3 py-1 text-sm bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg transition-colors"
// // // //                         >
// // // //                           {respondingReportId === report._id ? 'Cancel' : 'Respond'}
// // // //                         </button>
// // // //                       </div>

// // // //                       {respondingReportId === report._id && (
// // // //                         <div className="mt-3">
// // // //                           <textarea
// // // //                             className="w-full border border-teal-200 rounded-lg px-3 py-2 text-sm"
// // // //                             rows={3}
// // // //                             placeholder="Type your response to the patient..."
// // // //                             value={responseText}
// // // //                             onChange={(e) => setResponseText(e.target.value)}
// // // //                           />
// // // //                           <div className="mt-2 flex items-center gap-2">
// // // //                             <button
// // // //                               onClick={() => handleSubmitResponse(report._id)}
// // // //                               className="px-3 py-1 text-sm bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors"
// // // //                             >
// // // //                               Send Response
// // // //                             </button>
// // // //                             <button
// // // //                               onClick={() => { setRespondingReportId(null); setResponseText(''); }}
// // // //                               className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
// // // //                             >
// // // //                               Cancel
// // // //                             </button>
// // // //                           </div>
// // // //                         </div>
// // // //                       )}
// // // //                     </div>
// // // //                   ))
// // // //                 )}
// // // //               </div>
// // // //             )}

// // // //           </div>
// // // //         )}
// // // //       </section>
// // // //     </main>
// // // //   );
// // // // }

// // // // src/pages/dashboards/doctorDashboard.jsx
// // // import React, { useEffect, useState } from 'react';
// // // import { API_BASE, useAuthHeaders, getJSON, putJSON } from '../../utils/api';
// // // import { Calendar, Users, QrCode, Stethoscope, Clock, UserCheck, AlertTriangle, MessageSquare } from 'lucide-react';
// // // import { toast } from 'react-toastify';
// // // import BarcodeScanner from '../../components/BarcodeScanner';
// // // import SimpleBarcodeScanner from '../../components/SimpleBarcodeScanner';
// // // import PatientDetails from '../../components/PatientDetails';
// // // import { useAuth } from '../../contexts/AuthContext';

// // // export default function DoctorDashboard() {
// // //   const { user } = useAuth();
// // //   const headers = useAuthHeaders();
// // //   const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
// // //   const [loading, setLoading] = useState(false);
// // //   const [list, setList] = useState([]);
  
// // //   // Barcode scanning state
// // //   const [scannedPatient, setScannedPatient] = useState(null);
// // //   const [scanLoading, setScanLoading] = useState(false);
// // //   const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'scanner', or 'alerts'
// // //   const [useSimpleScanner, setUseSimpleScanner] = useState(false);
  
// // //   // Patient reports/alerts state
// // //   const [reports, setReports] = useState([]);
// // //   const [reportsLoading, setReportsLoading] = useState(false);
// // //   const [reportStatusFilter, setReportStatusFilter] = useState('all'); // all | new | read | responded
// // //   const [respondingReportId, setRespondingReportId] = useState(null);
// // //   const [responseText, setResponseText] = useState('');

// // //   const load = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const data = await getJSON(`${API_BASE}/api/appointments/doctor/day?date=${date}`, headers);
// // //       setList(data.appointments || []);
// // //     } catch (e) {
// // //       toast.error(e.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => { load(); }, [date]);

// // //   // Load patient reports
// // //   const loadReports = async () => {
// // //     setReportsLoading(true);
// // //     try {
// // //       const qs = new URLSearchParams();
// // //       if (reportStatusFilter && reportStatusFilter !== 'all') qs.set('status', reportStatusFilter);
// // //       const data = await getJSON(`${API_BASE}/api/patient-reports/doctor${qs.toString() ? `?${qs.toString()}` : ''}`, headers);
// // //       setReports(data.reports || []);
// // //     } catch (e) {
// // //       toast.error('Failed to load patient reports: ' + e.message);
// // //     } finally {
// // //       setReportsLoading(false);
// // //     }
// // //   };

// // //   // Load reports when alerts tab is active
// // //   useEffect(() => {
// // //     if (activeTab === 'alerts') {
// // //       loadReports();
// // //     }
// // //   }, [activeTab, reportStatusFilter]);

// // //   // Mark report as read
// // //   const handleMarkAsRead = async (reportId) => {
// // //     try {
// // //       await putJSON(`${API_BASE}/api/patient-reports/${reportId}/read`, headers, {});
// // //       loadReports(); // Reload reports
// // //     } catch (error) {
// // //       toast.error('Failed to mark as read: ' + error.message);
// // //     }
// // //   };

// // //   // Respond to report
// // //   const handleRespond = (reportId) => {
// // //     if (respondingReportId === reportId) {
// // //       setRespondingReportId(null);
// // //       setResponseText('');
// // //     } else {
// // //       setRespondingReportId(reportId);
// // //       setResponseText('');
// // //     }
// // //   };

// // //   const handleSubmitResponse = async (reportId) => {
// // //     if (!responseText.trim()) {
// // //       toast.warn('Please enter a response');
// // //       return;
// // //     }
// // //     try {
// // //       await putJSON(`${API_BASE}/api/patient-reports/${reportId}/respond`, headers, {
// // //         doctorResponse: responseText,
// // //         status: 'responded'
// // //       });
// // //       toast.success('Response sent to patient');
// // //       setRespondingReportId(null);
// // //       setResponseText('');
// // //       loadReports();
// // //     } catch (error) {
// // //       toast.error('Failed to send response: ' + error.message);
// // //     }
// // //   };

// // //   // Handle barcode scan
// // //   const handleBarcodeScan = async (barcode) => {
// // //     console.log('Scanning barcode:', barcode);
// // //     setScanLoading(true);
// // //     try {
// // //       const response = await getJSON(`${API_BASE}/api/patients/barcode/${barcode}`, headers);
// // //       console.log('Patient response:', response);
// // //       setScannedPatient(response);
// // //       toast.success(`Patient found: ${response.user?.firstName} ${response.user?.lastName}`);
// // //     } catch (error) {
// // //       console.error('Error fetching patient:', error);
// // //       toast.error(`Patient not found: ${error.message || 'Error occurred'}`);
// // //       setScannedPatient(null);
// // //     } finally {
// // //       setScanLoading(false);
// // //     }
// // //   };

// // //   // Handle scanner error
// // //   const handleScannerError = (error) => {
// // //     const isNotFoundException = 
// // //       error.name === 'NotFoundException' || 
// // //       error.name === 'NotFoundException2' ||
// // //       error.message?.includes('No MultiFormat Readers were able to detect') ||
// // //       error.message?.includes('NotFoundException');
// // //     if (!isNotFoundException) {
// // //       console.error('Scanner error:', error);
// // //       toast.error('Scanner error: ' + error.message);
// // //     }
// // //   };

// // //   // Clear scanned patient
// // //   const clearScannedPatient = () => {
// // //     setScannedPatient(null);
// // //   };

// // //   // Update patient (e.g., add surgery, meds, etc.)
// // //   const handleUpdatePatient = async (patientId, updateData) => {
// // //     try {
// // //       console.log('Doctor Dashboard - Updating patient:', patientId);
// // //       console.log('Doctor Dashboard - Update data:', updateData);
// // //       console.log('Doctor Dashboard - API URL:', `${API_BASE}/api/patients/${patientId}`);
// // //       console.log('Doctor Dashboard - Headers:', headers);
      
// // //       const response = await putJSON(`${API_BASE}/api/patients/${patientId}`, headers, updateData);
      
// // //       console.log('Doctor Dashboard - Response:', response);
      
// // //       // Replace with server’s version to avoid client-side duplication
// // //       if (scannedPatient && (scannedPatient._id === patientId || scannedPatient.user?._id === patientId)) {
// // //         setScannedPatient({
// // //           ...response.patient,
// // //           scannedAt: scannedPatient.scannedAt ?? undefined
// // //         });
// // //       }
      
// // //       return response;
// // //     } catch (error) {
// // //       console.error('Doctor Dashboard - Error updating patient:', error);
// // //       console.error('Doctor Dashboard - Error details:', error.message);
// // //       throw error;
// // //     }
// // //   };

// // //   // ⬇️ NEW: save only newly added surgeries (no _id) and append on server
// // //   const handleSaveSurgeries = async (formSurgeries) => {
// // //     if (!scannedPatient?._id) {
// // //       toast.error('No patient selected');
// // //       return;
// // //     }

// // //     // send ONLY newly added forms (those without _id)
// // //     const toAdd = (formSurgeries || []).filter(s => !s._id && s.name?.trim());

// // //     if (toAdd.length === 0) {
// // //       toast.info('No new surgeries to save');
// // //       return;
// // //     }

// // //     await handleUpdatePatient(scannedPatient._id, { surgeries: toAdd }); // append-only
// // //   };

// // //   return (
// // //     <main className="min-h-screen bg-gray-50">
// // //       {/* Header */}
// // //       <section className="bg-white border-b border-teal-100">
// // //         <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
// // //           <div className="flex items-center gap-3">
// // //             <div className="rounded-xl bg-teal-600 p-3">
// // //               <Stethoscope className="h-6 w-6 text-white" />
// // //             </div>
// // //             <div>
// // //               <h1 className="text-2xl font-bold text-teal-900">
// // //                 Doctor Dashboard
// // //               </h1>
// // //               <p className="text-sm text-teal-900/70">
// // //                 Manage appointments and scan patient barcodes
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* Navigation Tabs */}
// // //       <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
// // //         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
// // //           <button
// // //             onClick={() => setActiveTab('appointments')}
// // //             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// // //               activeTab === 'appointments'
// // //                 ? 'bg-white text-teal-700 shadow-sm'
// // //                 : 'text-gray-600 hover:text-gray-900'
// // //             }`}
// // //           >
// // //             <Calendar className="h-4 w-4" />
// // //             Appointments
// // //           </button>
// // //           <button
// // //             onClick={() => setActiveTab('scanner')}
// // //             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// // //               activeTab === 'scanner'
// // //                 ? 'bg-white text-teal-700 shadow-sm'
// // //                 : 'text-gray-600 hover:text-gray-900'
// // //             }`}
// // //           >
// // //             <QrCode className="h-4 w-4" />
// // //             Barcode Scanner
// // //           </button>
// // //           <button
// // //             onClick={() => setActiveTab('alerts')}
// // //             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// // //               activeTab === 'alerts'
// // //                 ? 'bg-white text-teal-700 shadow-sm'
// // //                 : 'text-gray-600 hover:text-gray-900'
// // //             }`}
// // //           >
// // //             <AlertTriangle className="h-4 w-4" />
// // //             Patient Alerts
// // //             {reports.filter(r => r.status === 'new').length > 0 && (
// // //               <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
// // //                 {reports.filter(r => r.status === 'new').length}
// // //               </span>
// // //             )}
// // //           </button>
// // //         </div>
// // //       </section>

// // //       {/* Content */}
// // //       <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
// // //         {activeTab === 'appointments' && (
// // //           <div>
// // //             <div className="flex items-center justify-between mb-6">
// // //               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
// // //                 <Users className="h-5 w-5" />
// // //                 Today's Appointments
// // //               </h2>
// // //               <div className="flex items-center gap-2">
// // //                 <Calendar className="h-4 w-4 text-teal-700" />
// // //                 <input
// // //                   type="date"
// // //                   value={date}
// // //                   onChange={(e)=>setDate(e.target.value)}
// // //                   className="rounded-lg border border-teal-200 px-3 py-2 text-sm"
// // //                 />
// // //               </div>
// // //             </div>

// // //             {loading ? (
// // //               <div className="text-teal-700">Loading appointments...</div>
// // //             ) : (
// // //               <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white">
// // //                 <table className="w-full text-sm">
// // //                   <thead className="bg-teal-50 text-teal-900">
// // //                     <tr>
// // //                       <th className="text-left px-4 py-3">Time</th>
// // //                       <th className="text-left px-4 py-3">Patient</th>
// // //                       <th className="text-left px-4 py-3">Status</th>
// // //                       <th className="text-left px-4 py-3">Reason</th>
// // //                     </tr>
// // //                   </thead>
// // //                   <tbody>
// // //                     {list.length === 0 && (
// // //                       <tr>
// // //                         <td colSpan={4} className="px-4 py-6 text-center text-teal-900/60">
// // //                           No appointments for this date.
// // //                         </td>
// // //                       </tr>
// // //                     )}
// // //                     {list.map((a) => (
// // //                       <tr key={a._id} className="border-t border-teal-50">
// // //                         <td className="px-4 py-3">
// // //                           {new Date(a.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(a.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // //                         </td>
// // //                         <td className="px-4 py-3">
// // //                           {a.patientId?.firstName} {a.patientId?.lastName}
// // //                         </td>
// // //                         <td className="px-4 py-3 capitalize">{a.status}</td>
// // //                         <td className="px-4 py-3">{a.reason || '-'}</td>
// // //                       </tr>
// // //                     ))}
// // //                   </tbody>
// // //                 </table>
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}

// // //         {activeTab === 'scanner' && (
// // //           <div className="space-y-6">
// // //             <div className="flex items-center justify-between">
// // //               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
// // //                 <QrCode className="h-5 w-5" />
// // //                 Patient Barcode Scanner
// // //               </h2>
// // //               <div className="flex items-center gap-3">
// // //                 <div className="flex items-center gap-2">
// // //                   <span className="text-sm text-gray-600">Scanner Mode:</span>
// // //                   <button
// // //                     onClick={() => setUseSimpleScanner(!useSimpleScanner)}
// // //                     className={`px-3 py-1 text-xs rounded-lg transition-colors ${
// // //                       useSimpleScanner
// // //                         ? 'bg-gray-200 text-gray-700'
// // //                         : 'bg-teal-100 text-teal-700'
// // //                     }`}
// // //                   >
// // //                     {useSimpleScanner ? 'Manual Input' : 'Camera Scanner'}
// // //                   </button>
// // //                 </div>
// // //                 {scannedPatient && (
// // //                   <button
// // //                     onClick={clearScannedPatient}
// // //                     className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
// // //                   >
// // //                     Clear Results
// // //                   </button>
// // //                 )}
// // //               </div>
// // //             </div>

// // //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //               {/* Scanner */}
// // //               <div>
// // //                 {useSimpleScanner ? (
// // //                   <SimpleBarcodeScanner
// // //                     onScan={handleBarcodeScan}
// // //                     onError={handleScannerError}
// // //                     isActive={activeTab === 'scanner'}
// // //                   />
// // //                 ) : (
// // //                   <BarcodeScanner
// // //                     onScan={handleBarcodeScan}
// // //                     onError={handleScannerError}
// // //                     isActive={activeTab === 'scanner'}
// // //                   />
// // //                 )}
// // //               </div>

// // //               {/* Patient Details */}
// // //               <div>
// // //                 {scanLoading ? (
// // //                   <div className="bg-white rounded-lg border border-gray-200 p-8">
// // //                     <div className="text-center">
// // //                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
// // //                       <p className="text-teal-600">Looking up patient...</p>
// // //                     </div>
// // //                   </div>
// // //                 ) : scannedPatient ? (
// // //                   <PatientDetails
// // //                     patient={scannedPatient}
// // //                     scannedAt={scannedPatient.scannedAt}
// // //                     onClose={clearScannedPatient}
// // //                     userRole={user?.role}
// // //                     onUpdatePatient={handleUpdatePatient}
// // //                     // ⬇️ NEW: pass a callback that expects the current form surgeries array.
// // //                     onSaveSurgeries={handleSaveSurgeries}
// // //                   />
// // //                 ) : (
// // //                   <div className="bg-white rounded-lg border border-gray-200 p-8">
// // //                     <div className="text-center">
// // //                       <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// // //                       <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Scanned</h3>
// // //                       <p className="text-sm text-gray-500">
// // //                         Scan a patient's barcode to view their details here
// // //                       </p>
// // //                     </div>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {activeTab === 'alerts' && (
// // //           <div className="space-y-6">
// // //             <div className="flex items-center justify-between">
// // //               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
// // //                 <AlertTriangle className="h-5 w-5" />
// // //                 Patient Reports & Alerts
// // //               </h2>
// // //               <div className="flex items-center gap-2">
// // //                 <select
// // //                   value={reportStatusFilter}
// // //                   onChange={(e) => setReportStatusFilter(e.target.value)}
// // //                   className="text-sm border border-teal-200 rounded-lg px-2 py-1"
// // //                 >
// // //                   <option value="all">All</option>
// // //                   <option value="new">New</option>
// // //                   <option value="read">Read</option>
// // //                   <option value="responded">Responded</option>
// // //                 </select>
// // //                 <button
// // //                   onClick={loadReports}
// // //                   className="px-4 py-2 text-sm text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors"
// // //                 >
// // //                   Refresh
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             {reportsLoading ? (
// // //               <div className="text-teal-700">Loading patient reports...</div>
// // //             ) : (
// // //               <div className="space-y-4">
// // //                 {reports.length === 0 ? (
// // //                   <div className="bg-white rounded-lg border border-gray-200 p-8">
// // //                     <div className="text-center">
// // //                       <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// // //                       <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Reports</h3>
// // //                       <p className="text-sm text-gray-500">
// // //                         No patient reports have been submitted yet
// // //                       </p>
// // //                     </div>
// // //                   </div>
// // //                 ) : (
// // //                   reports.map((report) => (
// // //                     <div
// // //                       key={report._id}
// // //                       className={`bg-white rounded-lg border p-6 shadow-sm ${
// // //                         report.status === 'new' ? 'border-red-200 bg-red-50' : 
// // //                         report.status === 'read' ? 'border-yellow-200 bg-yellow-50' : 
// // //                         'border-green-200 bg-green-50'
// // //                       }`}
// // //                     >
// // //                       <div className="flex items-start justify-between mb-4">
// // //                         <div className="flex items-center gap-3">
// // //                           <div className={`rounded-full p-2 ${
// // //                             report.priority === 'high' ? 'bg-red-100 text-red-600' :
// // //                             report.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
// // //                             'bg-green-100 text-green-600'
// // //                           }`}>
// // //                             <AlertTriangle className="h-4 w-4" />
// // //                           </div>
// // //                           <div>
// // //                             <h3 className="font-semibold text-gray-900">
// // //                               {report.patient.firstName} {report.patient.lastName}
// // //                             </h3>
// // //                             <p className="text-sm text-gray-600">
// // //                               {report.patient.email} • {report.patient.barcode}
// // //                             </p>
// // //                             <div className="flex items-center gap-2 mt-1">
// // //                               <span className={`text-xs px-2 py-1 rounded-full ${
// // //                                 report.priority === 'high' ? 'bg-red-100 text-red-700' :
// // //                                 report.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
// // //                                 'bg-green-100 text-green-700'
// // //                               }`}>
// // //                                 {report.priority.toUpperCase()}
// // //                               </span>
// // //                               <span className={`text-xs px-2 py-1 rounded-full ${
// // //                                 report.status === 'new' ? 'bg-red-100 text-red-700' :
// // //                                 report.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
// // //                                 'bg-green-100 text-green-700'
// // //                               }`}>
// // //                                 {report.status.toUpperCase()}
// // //                               </span>
// // //                             </div>
// // //                           </div>
// // //                         </div>
// // //                         <div className="text-right text-sm text-gray-500">
// // //                           {new Date(report.createdAt).toLocaleDateString()} at{' '}
// // //                           {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // //                         </div>
// // //                       </div>

// // //                       <div className="mb-4">
// // //                         <p className="text-gray-800 whitespace-pre-wrap">{report.reportContent}</p>
// // //                       </div>

// // //                       {report.doctorResponse && (
// // //                         <div className="mt-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
// // //                           <div className="flex items-center justify-between">
// // //                             <h4 className="font-medium text-blue-900">Doctor Response</h4>
// // //                             {report.respondedAt && (
// // //                               <span className="text-xs text-blue-700">
// // //                                 {new Date(report.respondedAt).toLocaleDateString()} {new Date(report.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // //                               </span>
// // //                             )}
// // //                           </div>
// // //                           <p className="text-blue-800 whitespace-pre-wrap mt-1">{report.doctorResponse}</p>
// // //                           {report.respondedBy && (
// // //                             <p className="text-xs text-blue-700 mt-2">By Dr. {report.respondedBy.firstName} {report.respondedBy.lastName}</p>
// // //                           )}
// // //                         </div>
// // //                       )}

// // //                       <div className="flex items-center gap-3">
// // //                         {report.status === 'new' && (
// // //                           <button
// // //                             onClick={() => handleMarkAsRead(report._id)}
// // //                             className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors"
// // //                           >
// // //                             Mark as Read
// // //                           </button>
// // //                         )}
// // //                         <button
// // //                           onClick={() => handleRespond(report._id)}
// // //                           className="px-3 py-1 text-sm bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg transition-colors"
// // //                         >
// // //                           {respondingReportId === report._id ? 'Cancel' : 'Respond'}
// // //                         </button>
// // //                       </div>

// // //                       {respondingReportId === report._id && (
// // //                         <div className="mt-3">
// // //                           <textarea
// // //                             className="w-full border border-teal-200 rounded-lg px-3 py-2 text-sm"
// // //                             rows={3}
// // //                             placeholder="Type your response to the patient..."
// // //                             value={responseText}
// // //                             onChange={(e) => setResponseText(e.target.value)}
// // //                           />
// // //                           <div className="mt-2 flex items-center gap-2">
// // //                             <button
// // //                               onClick={() => handleSubmitResponse(report._id)}
// // //                               className="px-3 py-1 text-sm bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors"
// // //                             >
// // //                               Send Response
// // //                             </button>
// // //                             <button
// // //                               onClick={() => { setRespondingReportId(null); setResponseText(''); }}
// // //                               className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
// // //                             >
// // //                               Cancel
// // //                             </button>
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   ))
// // //                 )}
// // //               </div>
// // //             )}

// // //           </div>
// // //         )}
// // //       </section>
// // //     </main>
// // //   );
// // // }

// // // routes/patient.routes.js
// // const express = require('express');
// // const router = express.Router();
// // const auth = require('../middleware/authMiddleware');
// // const PatientProfile = require('../models/patientProfileModel');
// // const User = require('../models/userModel');

// // // Helper function to get hospital ID from request
// // const getHospitalId = (req) => {
// //   return req.user?.hospitalId || req.user?.hospital?._id;
// // };

// // // -------------------- Patient Routes -------------------- //

// // // Get patient profile by user ID (for patient dashboard)
// // router.get('/user/:userId', auth(['patient']), async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     const userId = req.params.userId;

// //     if (req.user.sub !== userId) {
// //       return res.status(403).json({ message: 'Access denied' });
// //     }

// //     const userIdObjectId = require('mongoose').Types.ObjectId.isValid(userId)
// //       ? new (require('mongoose')).Types.ObjectId(userId)
// //       : userId;

// //     const query = { userId: userIdObjectId };
// //     if (hospitalId) query.hospitalId = hospitalId;

// //     const patient = await PatientProfile.findOne(query)
// //       .populate('userId', 'firstName lastName email phone userStatus');

// //     if (!patient) {
// //       return res.status(404).json({ message: 'Patient profile not found' });
// //     }

// //     res.json({
// //       _id: patient._id,
// //       user: patient.userId,
// //       firstName: patient.firstName,
// //       lastName: patient.lastName,
// //       nic: patient.nic,
// //       dob: patient.dob,
// //       gender: patient.gender,
// //       bloodGroup: patient.bloodGroup,
// //       allergies: patient.allergies,
// //       chronicConditions: patient.chronicConditions,
// //       familyConditions: patient.familyConditions,
// //       medications: patient.medications,
// //       surgeries: patient.surgeries,
// //       heightCm: patient.heightCm,
// //       weightKg: patient.weightKg,
// //       emergencyContact: patient.emergencyContact,
// //       insurance: patient.insurance,
// //       guardian: patient.guardian,
// //       consent: patient.consent,
// //       barcode: patient.barcode,
// //       createdAt: patient.createdAt,
// //       updatedAt: patient.updatedAt
// //     });
// //   } catch (error) {
// //     console.error('Get patient by user ID error:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Get all patients for the hospital
// // router.get('/', auth(['admin', 'reception', 'doctor']), async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     if (!hospitalId) {
// //       return res.status(400).json({ message: 'Hospital context required' });
// //     }

// //     const patients = await PatientProfile.find({ hospitalId })
// //       .populate('userId', 'firstName lastName email phone userStatus')
// //       .sort({ createdAt: -1 });

// //     res.json({
// //       count: patients.length,
// //       patients: patients.map(p => ({
// //         _id: p._id,
// //         user: p.userId,
// //         dob: p.dob,
// //         gender: p.gender,
// //         bloodGroup: p.bloodGroup,
// //         barcode: p.barcode,
// //         guardian: p.guardian,
// //         consent: p.consent,
// //         createdAt: p.createdAt
// //       }))
// //     });
// //   } catch (error) {
// //     console.error('Get patients error:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Get a patient by ID
// // router.get('/:id', auth(['admin', 'reception', 'doctor', 'patient']), async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     const patientId = req.params.id;

// //     if (req.user.role === 'patient' && req.user.sub !== patientId) {
// //       return res.status(403).json({ message: 'Access denied' });
// //     }

// //     const patient = await PatientProfile.findOne({
// //       _id: patientId,
// //       hospitalId
// //     }).populate('userId', 'firstName lastName email phone userStatus');

// //     if (!patient) {
// //       return res.status(404).json({ message: 'Patient not found' });
// //     }

// //     res.json({
// //       _id: patient._id,
// //       user: patient.userId,
// //       dob: patient.dob,
// //       gender: patient.gender,
// //       bloodGroup: patient.bloodGroup,
// //       allergies: patient.allergies,
// //       chronicConditions: patient.chronicConditions,
// //       medications: patient.medications,
// //       heightCm: patient.heightCm,
// //       weightKg: patient.weightKg,
// //       emergencyContact: patient.emergencyContact,
// //       insurance: patient.insurance,
// //       guardian: patient.guardian,
// //       consent: patient.consent,
// //       barcode: patient.barcode,
// //       createdAt: patient.createdAt,
// //       updatedAt: patient.updatedAt
// //     });
// //   } catch (error) {
// //     console.error('Get patient error:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Update patient profile (append surgeries with server-side de-dupe)
// // router.put('/:id', auth(['admin', 'reception', 'patient', 'doctor']), async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     const patientId = req.params.id;

// //     const existing = await PatientProfile.findOne({ _id: patientId, hospitalId });
// //     if (!existing) {
// //       return res.status(404).json({ message: 'Patient not found' });
// //     }

// //     if (req.user.role === 'patient' && String(existing.userId) !== String(req.user.sub)) {
// //       return res.status(403).json({ message: 'Access denied' });
// //     }

// //     // Pull fields from body (may be undefined)
// //     let {
// //       dob, gender, bloodGroup, allergies, chronicConditions, familyConditions, medications, surgeries,
// //       heightCm, weightKg, emergencyContact, insurance, guardian, consent
// //     } = req.body || {};

// //     // Normalize comma-separated list fields
// //     const normalizeList = (val) =>
// //       Array.isArray(val)
// //         ? val
// //         : typeof val === 'string'
// //           ? val.split(',').map((s) => s.trim()).filter(Boolean)
// //           : undefined;

// //     const normAllergies         = normalizeList(allergies);
// //     const normChronicConditions = normalizeList(chronicConditions);
// //     const normFamilyConditions  = normalizeList(familyConditions);

// //     // Surgeries: normalize and append-only with de-dupe
// //     let mergedSurgeries;
// //     if (Array.isArray(surgeries)) {
// //       const incoming = surgeries
// //         .filter(s => s && s.name && String(s.name).trim())
// //         .map(s => ({
// //           type: s.type || 'surgery',
// //           name: String(s.name).trim(),
// //           description: s.description || undefined,
// //           date: s.date ? new Date(s.date) : undefined,
// //           hospital: s.hospital || undefined,
// //           surgeon: s.surgeon || undefined,
// //           results: s.results || undefined,
// //           followUpRequired: !!s.followUpRequired,
// //           followUpDate: s.followUpDate ? new Date(s.followUpDate) : undefined,
// //         }));

// //       // Build a key to detect duplicates ignoring cosmetic differences
// //       const keyOf = (s) =>
// //         `${(s.name||'').trim().toLowerCase()}|${s.date ? new Date(s.date).toISOString().slice(0,10) : ''}|${(s.hospital||'').trim().toLowerCase()}|${(s.surgeon||'').trim().toLowerCase()}`;

// //       const existingKeys = new Set((existing.surgeries || []).map(keyOf));
// //       const uniques = incoming.filter(s => !existingKeys.has(keyOf(s)));

// //       mergedSurgeries = [ ...(existing.surgeries || []), ...uniques ];
// //     }

// //     // DOB → guardian checks
// //     if (dob) {
// //       const birthDate = new Date(dob);
// //       const today = new Date();
// //       let age = today.getFullYear() - birthDate.getFullYear();
// //       const monthDiff = today.getMonth() - birthDate.getMonth();
// //       const dayDiff = today.getDate() - birthDate.getDate();
// //       if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

// //       if (age <= 16) {
// //         if (!guardian?.name || !guardian?.phone) {
// //           return res.status(400).json({ message: 'Guardian details are required for patients age 16 or under' });
// //         }
// //         if (!consent) {
// //           return res.status(400).json({ message: 'Guardian consent is required for patients age 16 or under' });
// //         }
// //       }
// //     }

// //     // Only set fields provided by the client
// //     const updateData = {
// //       ...(dob !== undefined && { dob }),
// //       ...(gender !== undefined && { gender }),
// //       ...(bloodGroup !== undefined && { bloodGroup }),
// //       ...(normAllergies !== undefined && { allergies: normAllergies }),
// //       ...(normChronicConditions !== undefined && { chronicConditions: normChronicConditions }),
// //       ...(normFamilyConditions !== undefined && { familyConditions: normFamilyConditions }),
// //       ...(medications !== undefined && { medications }),
// //       ...(mergedSurgeries !== undefined && { surgeries: mergedSurgeries }),
// //       ...(heightCm !== undefined && { heightCm }),
// //       ...(weightKg !== undefined && { weightKg }),
// //       ...(emergencyContact !== undefined && { emergencyContact }),
// //       ...(insurance !== undefined && { insurance }),
// //     };

// //     if (dob) {
// //       const birthDate = new Date(dob);
// //       const today = new Date();
// //       let age = today.getFullYear() - birthDate.getFullYear();
// //       const monthDiff = today.getMonth() - birthDate.getMonth();
// //       const dayDiff = today.getDate() - birthDate.getDate();
// //       if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
// //       if (age <= 16) {
// //         updateData.guardian = guardian;
// //         updateData.consent = consent;
// //       }
// //     }

// //     const patient = await PatientProfile.findOneAndUpdate(
// //       { _id: existing._id, hospitalId },
// //       updateData,
// //       { new: true, runValidators: true }
// //     ).populate('userId', 'firstName lastName email phone userStatus');

// //     if (!patient) {
// //       return res.status(404).json({ message: 'Patient not found' });
// //     }

// //     res.json({
// //       message: 'Patient updated successfully',
// //       patient: {
// //         _id: patient._id,
// //         user: patient.userId,
// //         dob: patient.dob,
// //         gender: patient.gender,
// //         bloodGroup: patient.bloodGroup,
// //         allergies: patient.allergies,
// //         chronicConditions: patient.chronicConditions,
// //         familyConditions: patient.familyConditions,
// //         surgeries: patient.surgeries,
// //         medications: patient.medications,
// //         heightCm: patient.heightCm,
// //         weightKg: patient.weightKg,
// //         emergencyContact: patient.emergencyContact,
// //         insurance: patient.insurance,
// //         guardian: patient.guardian,
// //         consent: patient.consent,
// //         barcode: patient.barcode,
// //         updatedAt: patient.updatedAt
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Update patient error:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Delete patient (admin only)
// // router.delete('/:id', auth(['admin']), async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     const patientId = req.params.id;

// //     const patient = await PatientProfile.findOneAndDelete({
// //       _id: patientId,
// //       hospitalId
// //     });

// //     if (!patient) {
// //       return res.status(404).json({ message: 'Patient not found' });
// //     }

// //     await User.findByIdAndUpdate(patient.userId, { userStatus: 'inactive' });

// //     res.json({ message: 'Patient deleted successfully' });
// //   } catch (error) {
// //     console.error('Delete patient error:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Get patient by barcode (for scanning)
// // router.get('/barcode/:barcode', auth(['admin', 'reception', 'doctor']), async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     const barcode = req.params.barcode;

// //     const patient = await PatientProfile.findOne({
// //       barcode,
// //       hospitalId
// //     }).populate('userId', 'firstName lastName email phone userStatus');

// //     if (!patient) {
// //       return res.status(404).json({ message: 'Patient not found' });
// //     }

// //     res.json({
// //       _id: patient._id,
// //       user: patient.userId,
// //       dob: patient.dob,
// //       gender: patient.gender,
// //       bloodGroup: patient.bloodGroup,
// //       allergies: patient.allergies,
// //       chronicConditions: patient.chronicConditions,
// //       familyConditions: patient.familyConditions,
// //       medications: patient.medications,
// //       surgeries: patient.surgeries,
// //       heightCm: patient.heightCm,
// //       weightKg: patient.weightKg,
// //       emergencyContact: patient.emergencyContact,
// //       insurance: patient.insurance,
// //       guardian: patient.guardian,
// //       consent: patient.consent,
// //       barcode: patient.barcode
// //     });
// //   } catch (error) {
// //     console.error('Get patient by barcode error:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // module.exports = router;


//   // src/pages/dashboards/doctorDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { API_BASE, useAuthHeaders, getJSON, putJSON } from '../../utils/api';
// import { Calendar, Users, QrCode, Stethoscope, UserCheck, AlertTriangle, MessageSquare } from 'lucide-react';
// import { toast } from 'react-toastify';
// import BarcodeScanner from '../../components/BarcodeScanner';
// import SimpleBarcodeScanner from '../../components/SimpleBarcodeScanner';
// import PatientDetails from '../../components/PatientDetails';
// import { useAuth } from '../../contexts/AuthContext';

// export default function DoctorDashboard() {
//   const { user } = useAuth();
//   const headers = useAuthHeaders();
//   const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
//   const [loading, setLoading] = useState(false);
//   const [list, setList] = useState([]);

//   const [scannedPatient, setScannedPatient] = useState(null);
//   const [scanLoading, setScanLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('appointments');
//   const [useSimpleScanner, setUseSimpleScanner] = useState(false);

//   const [reports, setReports] = useState([]);
//   const [reportsLoading, setReportsLoading] = useState(false);
//   const [reportStatusFilter, setReportStatusFilter] = useState('all');
//   const [respondingReportId, setRespondingReportId] = useState(null);
//   const [responseText, setResponseText] = useState('');

//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await getJSON(`${API_BASE}/api/appointments/doctor/day?date=${date}`, headers);
//       setList(data.appointments || []);
//     } catch (e) {
//       toast.error(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, [date]);

//   const loadReports = async () => {
//     setReportsLoading(true);
//     try {
//       const qs = new URLSearchParams();
//       if (reportStatusFilter && reportStatusFilter !== 'all') qs.set('status', reportStatusFilter);
//       const data = await getJSON(`${API_BASE}/api/patient-reports/doctor${qs.toString() ? `?${qs.toString()}` : ''}`, headers);
//       setReports(data.reports || []);
//     } catch (e) {
//       toast.error('Failed to load patient reports: ' + e.message);
//     } finally {
//       setReportsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'alerts') {
//       loadReports();
//     }
//   }, [activeTab, reportStatusFilter]);

//   const handleMarkAsRead = async (reportId) => {
//     try {
//       await putJSON(`${API_BASE}/api/patient-reports/${reportId}/read`, headers, {});
//       loadReports();
//     } catch (error) {
//       toast.error('Failed to mark as read: ' + error.message);
//     }
//   };

//   const handleRespond = (reportId) => {
//     if (respondingReportId === reportId) {
//       setRespondingReportId(null);
//       setResponseText('');
//     } else {
//       setRespondingReportId(reportId);
//       setResponseText('');
//     }
//   };

//   const handleSubmitResponse = async (reportId) => {
//     if (!responseText.trim()) {
//       toast.warn('Please enter a response');
//       return;
//     }
//     try {
//       await putJSON(`${API_BASE}/api/patient-reports/${reportId}/respond`, headers, {
//         doctorResponse: responseText,
//         status: 'responded'
//       });
//       toast.success('Response sent to patient');
//       setRespondingReportId(null);
//       setResponseText('');
//       loadReports();
//     } catch (error) {
//       toast.error('Failed to send response: ' + error.message);
//     }
//   };

//   const handleBarcodeScan = async (barcode) => {
//     setScanLoading(true);
//     try {
//       const response = await getJSON(`${API_BASE}/api/patients/barcode/${barcode}`, headers);
//       setScannedPatient(response);
//       toast.success(`Patient found: ${response.user?.firstName} ${response.user?.lastName}`);
//     } catch (error) {
//       toast.error(`Patient not found: ${error.message || 'Error occurred'}`);
//       setScannedPatient(null);
//     } finally {
//       setScanLoading(false);
//     }
//   };

//   const handleScannerError = (error) => {
//     const isNotFoundException =
//       error.name === 'NotFoundException' ||
//       error.name === 'NotFoundException2' ||
//       error.message?.includes('No MultiFormat Readers were able to detect') ||
//       error.message?.includes('NotFoundException');

//     if (!isNotFoundException) {
//       toast.error('Scanner error: ' + error.message);
//     }
//   };

//   const clearScannedPatient = () => {
//     setScannedPatient(null);
//   };

//   // General update helper; always replace local patient with server response
//   const handleUpdatePatient = async (patientId, updateData) => {
//     try {
//       const response = await putJSON(`${API_BASE}/api/patients/${patientId}`, headers, updateData);
//       if (scannedPatient && (scannedPatient._id === patientId || scannedPatient.user?._id === patientId)) {
//         setScannedPatient({
//           ...response.patient,
//           scannedAt: scannedPatient.scannedAt ?? undefined
//         });
//       }
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   };

//   // Optional helper if your PatientDetails calls it and passes only its "formSurgeries"
//   const handleSaveSurgeries = async (formSurgeries) => {
//     if (!scannedPatient?._id) {
//       toast.error('No patient selected');
//       return;
//     }
//     const toAdd = (formSurgeries || []).filter(s => !s._id && s.name?.trim());
//     if (toAdd.length === 0) {
//       toast.info('No new surgeries to save');
//       return;
//     }
//     await handleUpdatePatient(scannedPatient._id, { surgeries: toAdd });
//   };

//   return (
//     <main className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <section className="bg-white border-b border-teal-100">
//         <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex items-center gap-3">
//             <div className="rounded-xl bg-teal-600 p-3">
//               <Stethoscope className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-teal-900">Doctor Dashboard</h1>
//               <p className="text-sm text-teal-900/70">Manage appointments and scan patient barcodes</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Navigation Tabs */}
//       <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
//           <button onClick={() => setActiveTab('appointments')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'appointments' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
//             <Calendar className="h-4 w-4" /> Appointments
//           </button>
//           <button onClick={() => setActiveTab('scanner')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'scanner' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
//             <QrCode className="h-4 w-4" /> Barcode Scanner
//           </button>
//           <button onClick={() => setActiveTab('alerts')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'alerts' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
//             <AlertTriangle className="h-4 w-4" /> Patient Alerts
//             {reports.filter(r => r.status === 'new').length > 0 && (
//               <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
//                 {reports.filter(r => r.status === 'new').length}
//               </span>
//             )}
//           </button>
//         </div>
//       </section>

//       {/* Content */}
//       <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
//         {activeTab === 'appointments' && (
//           <div>
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
//                 <Users className="h-5 w-5" /> Today's Appointments
//               </h2>
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-teal-700" />
//                 <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}
//                   className="rounded-lg border border-teal-200 px-3 py-2 text-sm" />
//               </div>
//             </div>

//             {loading ? (
//               <div className="text-teal-700">Loading appointments...</div>
//             ) : (
//               <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white">
//                 <table className="w-full text-sm">
//                   <thead className="bg-teal-50 text-teal-900">
//                     <tr>
//                       <th className="text-left px-4 py-3">Time</th>
//                       <th className="text-left px-4 py-3">Patient</th>
//                       <th className="text-left px-4 py-3">Status</th>
//                       <th className="text-left px-4 py-3">Reason</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {list.length === 0 && (
//                       <tr>
//                         <td colSpan={4} className="px-4 py-6 text-center text-teal-900/60">
//                           No appointments for this date.
//                         </td>
//                       </tr>
//                     )}
//                     {list.map((a) => (
//                       <tr key={a._id} className="border-t border-teal-50">
//                         <td className="px-4 py-3">
//                           {new Date(a.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(a.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                         </td>
//                         <td className="px-4 py-3">{a.patientId?.firstName} {a.patientId?.lastName}</td>
//                         <td className="px-4 py-3 capitalize">{a.status}</td>
//                         <td className="px-4 py-3">{a.reason || '-'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'scanner' && (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
//                 <QrCode className="h-5 w-5" /> Patient Barcode Scanner
//               </h2>
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-600">Scanner Mode:</span>
//                   <button onClick={() => setUseSimpleScanner(!useSimpleScanner)}
//                     className={`px-3 py-1 text-xs rounded-lg transition-colors ${useSimpleScanner ? 'bg-gray-200 text-gray-700' : 'bg-teal-100 text-teal-700'}`}>
//                     {useSimpleScanner ? 'Manual Input' : 'Camera Scanner'}
//                   </button>
//                 </div>
//                 {scannedPatient && (
//                   <button onClick={clearScannedPatient}
//                     className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
//                     Clear Results
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div>
//                 {useSimpleScanner ? (
//                   <SimpleBarcodeScanner onScan={handleBarcodeScan} onError={handleScannerError} isActive={activeTab === 'scanner'} />
//                 ) : (
//                   <BarcodeScanner onScan={handleBarcodeScan} onError={handleScannerError} isActive={activeTab === 'scanner'} />
//                 )}
//               </div>

//               <div>
//                 {scanLoading ? (
//                   <div className="bg-white rounded-lg border border-gray-200 p-8">
//                     <div className="text-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4" />
//                       <p className="text-teal-600">Looking up patient...</p>
//                     </div>
//                   </div>
//                 ) : scannedPatient ? (
//                   <PatientDetails
//                     patient={scannedPatient}
//                     scannedAt={scannedPatient.scannedAt}
//                     onClose={clearScannedPatient}
//                     userRole={user?.role}
//                     onUpdatePatient={handleUpdatePatient}
//                     onSaveSurgeries={handleSaveSurgeries}  // optional, if your component uses it
//                   />
//                 ) : (
//                   <div className="bg-white rounded-lg border border-gray-200 p-8">
//                     <div className="text-center">
//                       <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Scanned</h3>
//                       <p className="text-sm text-gray-500">Scan a patient's barcode to view their details here</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'alerts' && (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-teal-900 flex items-center gap-2">
//                 <AlertTriangle className="h-5 w-5" /> Patient Reports & Alerts
//               </h2>
//               <div className="flex items-center gap-2">
//                 <select value={reportStatusFilter} onChange={(e) => setReportStatusFilter(e.target.value)}
//                   className="text-sm border border-teal-200 rounded-lg px-2 py-1">
//                   <option value="all">All</option>
//                   <option value="new">New</option>
//                   <option value="read">Read</option>
//                   <option value="responded">Responded</option>
//                 </select>
//                 <button onClick={loadReports}
//                   className="px-4 py-2 text-sm text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors">
//                   Refresh
//                 </button>
//               </div>
//             </div>

//             {reportsLoading ? (
//               <div className="text-teal-700">Loading patient reports...</div>
//             ) : (
//               <div className="space-y-4">
//                 {reports.length === 0 ? (
//                   <div className="bg-white rounded-lg border border-gray-200 p-8">
//                     <div className="text-center">
//                       <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Reports</h3>
//                       <p className="text-sm text-gray-500">No patient reports have been submitted yet</p>
//                     </div>
//                   </div>
//                 ) : (
//                   reports.map((report) => (
//                     <div key={report._id}
//                       className={`bg-white rounded-lg border p-6 shadow-sm ${
//                         report.status === 'new' ? 'border-red-200 bg-red-50' :
//                         report.status === 'read' ? 'border-yellow-200 bg-yellow-50' :
//                         'border-green-200 bg-green-50'
//                       }`}>
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-center gap-3">
//                           <div className={`rounded-full p-2 ${
//                             report.priority === 'high' ? 'bg-red-100 text-red-600' :
//                             report.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
//                             'bg-green-100 text-green-600'
//                           }`}>
//                             <AlertTriangle className="h-4 w-4" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-900">
//                               {report.patient.firstName} {report.patient.lastName}
//                             </h3>
//                             <p className="text-sm text-gray-600">
//                               {report.patient.email} • {report.patient.barcode}
//                             </p>
//                             <div className="flex items-center gap-2 mt-1">
//                               <span className={`text-xs px-2 py-1 rounded-full ${
//                                 report.priority === 'high' ? 'bg-red-100 text-red-700' :
//                                 report.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
//                                 'bg-green-100 text-green-700'
//                               }`}>
//                                 {report.priority.toUpperCase()}
//                               </span>
//                               <span className={`text-xs px-2 py-1 rounded-full ${
//                                 report.status === 'new' ? 'bg-red-100 text-red-700' :
//                                 report.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
//                                 'bg-green-100 text-green-700'
//                               }`}>
//                                 {report.status.toUpperCase()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right text-sm text-gray-500">
//                           {new Date(report.createdAt).toLocaleDateString()} at{' '}
//                           {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                         </div>
//                       </div>

//                       <div className="mb-4">
//                         <p className="text-gray-800 whitespace-pre-wrap">{report.reportContent}</p>
//                       </div>

//                       {report.doctorResponse && (
//                         <div className="mt-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                           <div className="flex items-center justify-between">
//                             <h4 className="font-medium text-blue-900">Doctor Response</h4>
//                             {report.respondedAt && (
//                               <span className="text-xs text-blue-700">
//                                 {new Date(report.respondedAt).toLocaleDateString()} {new Date(report.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-blue-800 whitespace-pre-wrap mt-1">{report.doctorResponse}</p>
//                           {report.respondedBy && (
//                             <p className="text-xs text-blue-700 mt-2">By Dr. {report.respondedBy.firstName} {report.respondedBy.lastName}</p>
//                           )}
//                         </div>
//                       )}

//                       <div className="flex items-center gap-3">
//                         {report.status === 'new' && (
//                           <button onClick={() => handleMarkAsRead(report._id)}
//                             className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors">
//                             Mark as Read
//                           </button>
//                         )}
//                         <button onClick={() => handleRespond(report._id)}
//                           className="px-3 py-1 text-sm bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg transition-colors">
//                           {respondingReportId === report._id ? 'Cancel' : 'Respond'}
//                         </button>
//                       </div>

//                       {respondingReportId === report._id && (
//                         <div className="mt-3">
//                           <textarea
//                             className="w-full border border-teal-200 rounded-lg px-3 py-2 text-sm"
//                             rows={3}
//                             placeholder="Type your response to the patient..."
//                             value={responseText}
//                             onChange={(e) => setResponseText(e.target.value)}
//                           />
//                           <div className="mt-2 flex items-center gap-2">
//                             <button onClick={() => handleSubmitResponse(report._id)}
//                               className="px-3 py-1 text-sm bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors">
//                               Send Response
//                             </button>
//                             <button onClick={() => { setRespondingReportId(null); setResponseText(''); }}
//                               className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// src/pages/dashboards/doctorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE, useAuthHeaders, getJSON, putJSON } from '../../utils/api';
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
      setScannedPatient(response);
      toast.success(`Patient found: ${response.user?.firstName} ${response.user?.lastName}`);
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
    await handleUpdatePatient(scannedPatient._id, { surgeries: toAdd });
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
                  <PatientDetails
                    patient={scannedPatient}
                    scannedAt={scannedPatient.scannedAt}
                    onClose={clearScannedPatient}
                    userRole={user?.role}
                    onUpdatePatient={handleUpdatePatient}
                    onSaveSurgeries={handleSaveSurgeries}
                  />
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
