// // // // src/pages/reports/ReportsDashboard.jsx
// // // import React, { useState, useEffect } from 'react';
// // // import { toast } from 'react-toastify';
// // // import { useNavigate } from 'react-router-dom';
// // // import {
// // //   BarChart3,
// // //   TrendingUp,
// // //   Users,
// // //   DollarSign,
// // //   Calendar,
// // //   Download,
// // //   Save,
// // //   Filter,
// // //   RefreshCw,
// // //   Clock,
// // //   FileText,
// // //   ChevronRight,
// // //   AlertCircle
// // // } from 'lucide-react';
// // // import {
// // //   LineChart,
// // //   Line,
// // //   BarChart,
// // //   Bar,
// // //   PieChart,
// // //   Pie,
// // //   Cell,
// // //   XAxis,
// // //   YAxis,
// // //   CartesianGrid,
// // //   Tooltip,
// // //   Legend,
// // //   ResponsiveContainer
// // // } from 'recharts';
// // // import { useAuth } from '../../contexts/AuthContext';

// // // const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// // // //const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1'];
// // // const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1'];

// // // // Inside your component
// // // //const navigate = useNavigate();

// // // const CardButton = ({ title, onClick }) => (
// // //   <button 
// // //     onClick={onClick}
// // //     className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
// // //   >
// // //     {title}
// // //   </button>
// // // );


// // // // Add Reports Card Button
// // // <CardButton
// // //   icon={BarChart3}
// // //   title="Analytics & Reports"
// // //   desc="View comprehensive hospital insights"
// // //   onClick={() => navigate('/manager/reports')}
// // // />

// // // function Analytics() {
// // //   const navigate = useNavigate();

// // //   return (
// // //     <div className="dashboard-container">
// // //       <div
// // //         className="card bg-white shadow-md rounded-xl p-4 hover:shadow-lg cursor-pointer"
// // //         onClick={() => navigate('/reports-dashboard')}
// // //       >
// // //         <h2 className="text-lg font-semibold">Reports & Analytics</h2>
// // //         <p>View detailed reports and KPIs</p>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // Stat Card Component
// // // const StatCard = ({ icon: Icon, title, value, change, trend, onClick }) => (
// // //   <div
// // //     onClick={onClick}
// // //     className={`rounded-2xl border border-teal-100 bg-white p-6 shadow-sm transition-all hover:shadow-md ${
// // //       onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
// // //     }`}
// // //   >
// // //     <div className="flex items-start justify-between">
// // //       <div>
// // //         <p className="text-sm font-medium text-teal-900/70">{title}</p>
// // //         <h3 className="mt-2 text-3xl font-bold text-teal-900">{value}</h3>
// // //         {change && (
// // //           <p className={`mt-2 text-sm flex items-center gap-1 ${
// // //             trend === 'up' ? 'text-green-600' : 'text-red-600'
// // //           }`}>
// // //             <TrendingUp className={`h-4 w-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
// // //             {change}
// // //           </p>
// // //         )}
// // //       </div>
// // //       <div className="rounded-xl bg-teal-50 p-3">
// // //         <Icon className="h-6 w-6 text-teal-700" />
// // //       </div>
// // //     </div>
// // //   </div>
// // // );

// // // // Filter Panel Component
// // // const FilterPanel = ({ filters, onChange, onApply, onReset }) => {
// // //   return (
// // //     <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// // //       <div className="flex items-center justify-between mb-4">
// // //         <h3 className="text-lg font-semibold text-teal-900 flex items-center gap-2">
// // //           <Filter className="h-5 w-5" />
// // //           Filters
// // //         </h3>
// // //         <button
// // //           onClick={onReset}
// // //           className="text-sm text-teal-700 hover:text-teal-800 flex items-center gap-1"
// // //         >
// // //           <RefreshCw className="h-4 w-4" />
// // //           Reset
// // //         </button>
// // //       </div>

// // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// // //         <div>
// // //           <label className="block text-sm font-medium text-teal-900 mb-1">
// // //             Start Date
// // //           </label>
// // //           <input
// // //             type="date"
// // //             value={filters.startDate}
// // //             onChange={(e) => onChange('startDate', e.target.value)}
// // //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-medium text-teal-900 mb-1">
// // //             End Date
// // //           </label>
// // //           <input
// // //             type="date"
// // //             value={filters.endDate}
// // //             onChange={(e) => onChange('endDate', e.target.value)}
// // //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-medium text-teal-900 mb-1">
// // //             Department
// // //           </label>
// // //           <input
// // //             type="text"
// // //             placeholder="e.g., Cardiology"
// // //             value={filters.department}
// // //             onChange={(e) => onChange('department', e.target.value)}
// // //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-medium text-teal-900 mb-1">
// // //             Compare With
// // //           </label>
// // //           <select
// // //             value={filters.compareWith}
// // //             onChange={(e) => onChange('compareWith', e.target.value)}
// // //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400"
// // //           >
// // //             <option value="">None</option>
// // //             <option value="week">Previous Week</option>
// // //             <option value="month">Previous Month</option>
// // //             <option value="year">Previous Year</option>
// // //           </select>
// // //         </div>
// // //       </div>

// // //       <div className="mt-4 flex gap-3">
// // //         <button
// // //           onClick={onApply}
// // //           className="rounded-xl bg-teal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-400"
// // //         >
// // //           Apply Filters
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Main Dashboard Component
// // // export default function ReportsDashboard() {
// // //   const { token } = useAuth();
// // //   const [loading, setLoading] = useState(true);
// // //   const [reportData, setReportData] = useState(null);
// // //   const [filters, setFilters] = useState({
// // //     startDate: '',
// // //     endDate: '',
// // //     department: '',
// // //     compareWith: ''
// // //   });

// // //   const headers = {
// // //     'Content-Type': 'application/json',
// // //     Authorization: `Bearer ${token?.replace(/^"|"$/g, '')}`
// // //   };

// // //   // Fetch report data
// // //   const fetchReportData = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const queryParams = new URLSearchParams();
// // //       if (filters.startDate) queryParams.append('startDate', filters.startDate);
// // //       if (filters.endDate) queryParams.append('endDate', filters.endDate);
// // //       if (filters.department) queryParams.append('department', filters.department);
// // //       if (filters.compareWith) queryParams.append('compareWith', filters.compareWith);

// // //       const response = await fetch(
// // //         `${API}/api/reports/summary?${queryParams.toString()}`,
// // //         { headers }
// // //       );

// // //       if (!response.ok) throw new Error('Failed to fetch report data');

// // //       const data = await response.json();
// // //       setReportData(data);
// // //     } catch (error) {
// // //       toast.error(error.message);
// // //       console.error('Fetch report error:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchReportData();
// // //   }, []);

// // //   const handleFilterChange = (key, value) => {
// // //     setFilters(prev => ({ ...prev, [key]: value }));
// // //   };

// // //   const handleApplyFilters = () => {
// // //     fetchReportData();
// // //   };

// // //   const handleResetFilters = () => {
// // //     setFilters({
// // //       startDate: '',
// // //       endDate: '',
// // //       department: '',
// // //       compareWith: ''
// // //     });
// // //   };

// // //   const handleDownload = async (format) => {
// // //     try {
// // //       const queryParams = new URLSearchParams({ format, ...filters });
// // //       const response = await fetch(
// // //         `${API}/api/reports/download?${queryParams.toString()}`,
// // //         { headers }
// // //       );

// // //       if (!response.ok) throw new Error('Download failed');

// // //       const blob = await response.blob();
// // //       const url = window.URL.createObjectURL(blob);
// // //       const a = document.createElement('a');
// // //       a.href = url;
// // //       a.download = `report-${Date.now()}.${format}`;
// // //       document.body.appendChild(a);
// // //       a.click();
// // //       a.remove();
// // //       window.URL.revokeObjectURL(url);

// // //       toast.success(`Report downloaded as ${format.toUpperCase()}`);
// // //     } catch (error) {
// // //       toast.error(error.message);
// // //     }
// // //   };

// // //   const handleSaveReport = async () => {
// // //     try {
// // //       const response = await fetch(`${API}/api/reports/save`, {
// // //         method: 'POST',
// // //         headers,
// // //         body: JSON.stringify({
// // //           reportType: 'summary',
// // //           title: `Report ${new Date().toLocaleDateString()}`,
// // //           description: 'Auto-saved summary report',
// // //           filters,
// // //           data: reportData
// // //         })
// // //       });

// // //       if (!response.ok) throw new Error('Failed to save report');

// // //       const data = await response.json();
// // //       toast.success('Report saved successfully');
// // //     } catch (error) {
// // //       toast.error(error.message);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // //         <div className="text-center">
// // //           <RefreshCw className="h-12 w-12 text-teal-600 animate-spin mx-auto" />
// // //           <p className="mt-4 text-teal-900">Loading report data...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!reportData) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // //         <div className="text-center max-w-md">
// // //           <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />
// // //           <h2 className="mt-4 text-xl font-semibold text-teal-900">No Data Available</h2>
// // //           <p className="mt-2 text-sm text-teal-900/70">
// // //             Unable to load report data. Please try again later.
// // //           </p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   const { summary, charts, comparison } = reportData;

// // //   // Prepare chart data
// // //   const appointmentStatusData = charts.appointmentsByStatus.map(item => ({
// // //     name: item._id,
// // //     value: item.count
// // //   }));

// // //   const dailyRevenueData = charts.dailyRevenue.map(item => ({
// // //     date: item._id,
// // //     revenue: item.revenue,
// // //     transactions: item.transactions
// // //   }));

// // //   const paymentMethodData = charts.paymentsByMethod.map(item => ({
// // //     name: item._id,
// // //     value: item.total,
// // //     count: item.count
// // //   }));

// // //   return (
// // //     <main className="min-h-screen bg-gray-50">
// // //       {/* Header */}
// // //       <section className="bg-white border-b border-teal-100">
// // //         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
// // //           <div className="flex items-center justify-between">
// // //             <div className="flex items-center gap-3">
// // //               <div className="rounded-xl bg-teal-600 p-3">
// // //                 <BarChart3 className="h-6 w-6 text-white" />
// // //               </div>
// // //               <div>
// // //                 <h1 className="text-2xl font-bold text-teal-900">Analytics & Reports</h1>
// // //                 <p className="text-sm text-teal-900/70">
// // //                   Comprehensive insights into hospital operations
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <div className="flex gap-3">
// // //               <button
// // //                 onClick={() => handleDownload('csv')}
// // //                 className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2"
// // //               >
// // //                 <Download className="h-4 w-4" />
// // //                 CSV
// // //               </button>
// // //               <button
// // //                 onClick={() => handleDownload('pdf')}
// // //                 className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2"
// // //               >
// // //                 <Download className="h-4 w-4" />
// // //                 PDF
// // //               </button>
// // //               <button
// // //                 onClick={handleSaveReport}
// // //                 className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 flex items-center gap-2"
// // //               >
// // //                 <Save className="h-4 w-4" />
// // //                 Save Report
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
// // //         {/* Filters */}
// // //         <FilterPanel
// // //           filters={filters}
// // //           onChange={handleFilterChange}
// // //           onApply={handleApplyFilters}
// // //           onReset={handleResetFilters}
// // //         />

// // //         {/* Key Metrics */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// // //           <StatCard
// // //             icon={Calendar}
// // //             title="Total Appointments"
// // //             value={summary.appointments.total.toLocaleString()}
// // //             change={comparison ? `${((summary.appointments.total - comparison.appointments) / comparison.appointments * 100).toFixed(1)}%` : null}
// // //             trend={comparison && summary.appointments.total > comparison.appointments ? 'up' : 'down'}
// // //           />
// // //           <StatCard
// // //             icon={DollarSign}
// // //             title="Total Revenue"
// // //             value={`LKR ${summary.revenue.total.toLocaleString()}`}
// // //             change={comparison ? `${((summary.revenue.total - comparison.revenue) / comparison.revenue * 100).toFixed(1)}%` : null}
// // //             trend={comparison && summary.revenue.total > comparison.revenue ? 'up' : 'down'}
// // //           />
// // //           <StatCard
// // //             icon={Users}
// // //             title="Total Patients"
// // //             value={summary.patients.total.toLocaleString()}
// // //           />
// // //           <StatCard
// // //             icon={FileText}
// // //             title="Avg Transaction"
// // //             value={`LKR ${summary.revenue.average.toFixed(2)}`}
// // //           />
// // //         </div>

// // //         {/* Charts Row 1 */}
// // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //           {/* Appointment Status Pie Chart */}
// // //           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// // //             <h3 className="text-lg font-semibold text-teal-900 mb-4">
// // //               Appointments by Status
// // //             </h3>
// // //             <ResponsiveContainer width="100%" height={300}>
// // //               <PieChart>
// // //                 <Pie
// // //                   data={appointmentStatusData}
// // //                   cx="50%"
// // //                   cy="50%"
// // //                   labelLine={false}
// // //                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// // //                   outerRadius={80}
// // //                   fill="#8884d8"
// // //                   dataKey="value"
// // //                 >
// // //                   {appointmentStatusData.map((entry, index) => (
// // //                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // //                   ))}
// // //                 </Pie>
// // //                 <Tooltip />
// // //               </PieChart>
// // //             </ResponsiveContainer>
// // //           </div>

// // //           {/* Payment Methods Bar Chart */}
// // //           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// // //             <h3 className="text-lg font-semibold text-teal-900 mb-4">
// // //               Revenue by Payment Method
// // //             </h3>
// // //             <ResponsiveContainer width="100%" height={300}>
// // //               <BarChart data={paymentMethodData}>
// // //                 <CartesianGrid strokeDasharray="3 3" />
// // //                 <XAxis dataKey="name" />
// // //                 <YAxis />
// // //                 <Tooltip />
// // //                 <Bar dataKey="value" fill="#0d9488" />
// // //               </BarChart>
// // //             </ResponsiveContainer>
// // //           </div>
// // //         </div>

// // //         {/* Daily Revenue Line Chart */}
// // //         <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// // //           <h3 className="text-lg font-semibold text-teal-900 mb-4">
// // //             Daily Revenue Trend
// // //           </h3>
// // //           <ResponsiveContainer width="100%" height={350}>
// // //             <LineChart data={dailyRevenueData}>
// // //               <CartesianGrid strokeDasharray="3 3" />
// // //               <XAxis dataKey="date" />
// // //               <YAxis />
// // //               <Tooltip />
// // //               <Legend />
// // //               <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} />
// // //               <Line type="monotone" dataKey="transactions" stroke="#14b8a6" strokeWidth={2} />
// // //             </LineChart>
// // //           </ResponsiveContainer>
// // //         </div>

// // //         {/* Top Doctors */}
// // //         {charts.topDoctors && charts.topDoctors.length > 0 && (
// // //           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// // //             <h3 className="text-lg font-semibold text-teal-900 mb-4">
// // //               Top Performing Doctors
// // //             </h3>
// // //             <div className="space-y-3">
// // //               {charts.topDoctors.slice(0, 5).map((doctor, idx) => (
// // //                 <div
// // //                   key={doctor.doctorId}
// // //                   className="flex items-center justify-between p-3 rounded-xl border border-teal-100 hover:bg-teal-50 transition-colors cursor-pointer"
// // //                 >
// // //                   <div className="flex items-center gap-3">
// // //                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-semibold">
// // //                       {idx + 1}
// // //                     </div>
// // //                     <div>
// // //                       <p className="font-medium text-teal-900">{doctor.name}</p>
// // //                       <p className="text-sm text-teal-900/70">
// // //                         {doctor.appointmentCount} appointments
// // //                       </p>
// // //                     </div>
// // //                   </div>
// // //                   <ChevronRight className="h-5 w-5 text-teal-400" />
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </main>
// // //   );
// // // }

// // // src/pages/reports/ReportsDashboard.jsx
// // import React, { useState, useEffect } from 'react';
// // import { toast } from 'react-toastify';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   BarChart3,
// //   TrendingUp,
// //   Users,
// //   DollarSign,
// //   Calendar,
// //   Download,
// //   Save,
// //   Filter,
// //   RefreshCw,
// //   Clock,
// //   FileText,
// //   ChevronRight,
// //   AlertCircle,
// //   ArrowLeft,
// //   Activity,
// //   Building2,
// // } from 'lucide-react';
// // import {
// //   LineChart,
// //   Line,
// //   BarChart,
// //   Bar,
// //   PieChart,
// //   Pie,
// //   Cell,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer
// // } from 'recharts';
// // import { useAuth } from '../../contexts/AuthContext';

// // const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// // const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1'];

// // // ==================== STAT CARD COMPONENT ====================
// // const StatCard = ({ icon: Icon, title, value, change, trend, onClick }) => (
// //   <div
// //     onClick={onClick}
// //     className={`rounded-2xl border border-teal-100 bg-white p-6 shadow-sm transition-all hover:shadow-md ${
// //       onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
// //     }`}
// //   >
// //     <div className="flex items-start justify-between">
// //       <div>
// //         <p className="text-sm font-medium text-teal-900/70">{title}</p>
// //         <h3 className="mt-2 text-3xl font-bold text-teal-900">{value}</h3>
// //         {change && (
// //           <p className={`mt-2 text-sm flex items-center gap-1 ${
// //             trend === 'up' ? 'text-green-600' : 'text-red-600'
// //           }`}>
// //             <TrendingUp className={`h-4 w-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
// //             {change}
// //           </p>
// //         )}
// //       </div>
// //       <div className="rounded-xl bg-teal-50 p-3">
// //         <Icon className="h-6 w-6 text-teal-700" />
// //       </div>
// //     </div>
// //   </div>
// // );

// // // ==================== FILTER PANEL COMPONENT ====================
// // const FilterPanel = ({ filters, onChange, onApply, onReset }) => {
// //   return (
// //     <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// //       <div className="flex items-center justify-between mb-4">
// //         <h3 className="text-lg font-semibold text-teal-900 flex items-center gap-2">
// //           <Filter className="h-5 w-5" />
// //           Filters
// //         </h3>
// //         <button
// //           onClick={onReset}
// //           className="text-sm text-teal-700 hover:text-teal-800 flex items-center gap-1"
// //         >
// //           <RefreshCw className="h-4 w-4" />
// //           Reset
// //         </button>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// //         <div>
// //           <label className="block text-sm font-medium text-teal-900 mb-1">
// //             Start Date
// //           </label>
// //           <input
// //             type="date"
// //             value={filters.startDate}
// //             onChange={(e) => onChange('startDate', e.target.value)}
// //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-medium text-teal-900 mb-1">
// //             End Date
// //           </label>
// //           <input
// //             type="date"
// //             value={filters.endDate}
// //             onChange={(e) => onChange('endDate', e.target.value)}
// //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-medium text-teal-900 mb-1">
// //             Department
// //           </label>
// //           <input
// //             type="text"
// //             placeholder="e.g., Cardiology"
// //             value={filters.department}
// //             onChange={(e) => onChange('department', e.target.value)}
// //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-medium text-teal-900 mb-1">
// //             Compare With
// //           </label>
// //           <select
// //             value={filters.compareWith}
// //             onChange={(e) => onChange('compareWith', e.target.value)}
// //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
// //           >
// //             <option value="">None</option>
// //             <option value="week">Previous Week</option>
// //             <option value="month">Previous Month</option>
// //             <option value="year">Previous Year</option>
// //           </select>
// //         </div>
// //       </div>

// //       <div className="mt-4 flex gap-3">
// //         <button
// //           onClick={onApply}
// //           className="rounded-xl bg-teal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 transition-colors"
// //         >
// //           Apply Filters
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // // ==================== MAIN DASHBOARD COMPONENT ====================
// // export default function ReportsDashboard() {
// //   const navigate = useNavigate();
// //   const { token } = useAuth();
// //   const [loading, setLoading] = useState(true);
// //   const [reportData, setReportData] = useState(null);
// //   const [filters, setFilters] = useState({
// //     startDate: '',
// //     endDate: '',
// //     department: '',
// //     compareWith: ''
// //   });

// //   const headers = {
// //     'Content-Type': 'application/json',
// //     Authorization: `Bearer ${token?.replace(/^"|"$/g, '')}`
// //   };

// //   // ==================== FETCH REPORT DATA ====================
// //   const fetchReportData = async () => {
// //     setLoading(true);
// //     try {
// //       const queryParams = new URLSearchParams();
// //       if (filters.startDate) queryParams.append('startDate', filters.startDate);
// //       if (filters.endDate) queryParams.append('endDate', filters.endDate);
// //       if (filters.department) queryParams.append('department', filters.department);
// //       if (filters.compareWith) queryParams.append('compareWith', filters.compareWith);

// //       console.log('Fetching from:', `${API}/api/reports/summary?${queryParams.toString()}`);

// //       const response = await fetch(
// //         `${API}/api/reports/summary?${queryParams.toString()}`,
// //         { headers }
// //       );

// //       if (!response.ok) {
// //         const errorData = await response.json().catch(() => ({}));
// //         throw new Error(errorData.message || 'Failed to fetch report data');
// //       }

// //       const data = await response.json();
// //       console.log('Report data received:', data);
// //       setReportData(data);
// //       toast.success('Report data loaded successfully');
// //     } catch (error) {
// //       toast.error(error.message);
// //       console.error('Fetch report error:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchReportData();
// //   }, []);

// //   // ==================== EVENT HANDLERS ====================
// //   const handleFilterChange = (key, value) => {
// //     setFilters(prev => ({ ...prev, [key]: value }));
// //   };

// //   const handleApplyFilters = () => {
// //     fetchReportData();
// //   };

// //   const handleResetFilters = () => {
// //     setFilters({
// //       startDate: '',
// //       endDate: '',
// //       department: '',
// //       compareWith: ''
// //     });
// //     setTimeout(() => {
// //       fetchReportData();
// //     }, 100);
// //   };

// //   const handleDownload = async (format) => {
// //     try {
// //       const queryParams = new URLSearchParams({ format, ...filters });
// //       const response = await fetch(
// //         `${API}/api/reports/download?${queryParams.toString()}`,
// //         { headers }
// //       );

// //       if (!response.ok) throw new Error('Download failed');

// //       const blob = await response.blob();
// //       const url = window.URL.createObjectURL(blob);
// //       const a = document.createElement('a');
// //       a.href = url;
// //       a.download = `hospital-report-${Date.now()}.${format}`;
// //       document.body.appendChild(a);
// //       a.click();
// //       a.remove();
// //       window.URL.revokeObjectURL(url);

// //       toast.success(`Report downloaded as ${format.toUpperCase()}`);
// //     } catch (error) {
// //       toast.error(error.message);
// //       console.error('Download error:', error);
// //     }
// //   };

// //   const handleSaveReport = async () => {
// //     try {
// //       const response = await fetch(`${API}/api/reports/save`, {
// //         method: 'POST',
// //         headers,
// //         body: JSON.stringify({
// //           reportType: 'summary',
// //           title: `Report ${new Date().toLocaleDateString()}`,
// //           description: 'Auto-saved summary report',
// //           filters,
// //           data: reportData
// //         })
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json().catch(() => ({}));
// //         throw new Error(errorData.message || 'Failed to save report');
// //       }

// //       const data = await response.json();
// //       toast.success('Report saved successfully');
// //       console.log('Saved report:', data);
// //     } catch (error) {
// //       toast.error(error.message);
// //       console.error('Save error:', error);
// //     }
// //   };

// //   // ==================== LOADING STATE ====================
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <RefreshCw className="h-12 w-12 text-teal-600 animate-spin mx-auto" />
// //           <p className="mt-4 text-teal-900 font-medium">Loading report data...</p>
// //           <p className="mt-2 text-sm text-teal-900/70">Please wait while we fetch your analytics</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ==================== ERROR STATE ====================
// //   if (!reportData) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center max-w-md">
// //           <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />
// //           <h2 className="mt-4 text-xl font-semibold text-teal-900">No Data Available</h2>
// //           <p className="mt-2 text-sm text-teal-900/70">
// //             Unable to load report data. Please check your connection and try again.
// //           </p>
// //           <div className="mt-6 flex gap-3 justify-center">
// //             <button
// //               onClick={fetchReportData}
// //               className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 flex items-center gap-2"
// //             >
// //               <RefreshCw className="h-4 w-4" />
// //               Retry
// //             </button>
// //             <button
// //               onClick={() => navigate('/admin-dashboard')}
// //               className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
// //             >
// //               Go Back
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const { summary, charts, comparison } = reportData;

// //   // ==================== PREPARE CHART DATA ====================
// //   const appointmentStatusData = charts?.appointmentsByStatus?.map(item => ({
// //     name: item._id || 'Unknown',
// //     value: item.count || 0
// //   })) || [];

// //   const dailyRevenueData = charts?.dailyRevenue?.map(item => ({
// //     date: item._id || '',
// //     revenue: item.revenue || 0,
// //     transactions: item.transactions || 0
// //   })) || [];

// //   const paymentMethodData = charts?.paymentsByMethod?.map(item => ({
// //     name: item._id || 'Unknown',
// //     value: item.total || 0,
// //     count: item.count || 0
// //   })) || [];

// //   const appointmentsByDayData = charts?.appointmentsByDay?.map(item => ({
// //     date: item._id || '',
// //     count: item.count || 0
// //   })) || [];

// //   // ==================== RENDER ====================
// //   return (
// //     <main className="min-h-screen bg-gray-50">
// //       {/* ==================== HEADER ==================== */}
// //       <section className="bg-white border-b border-teal-100">
// //         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
// //           <div className="flex items-center justify-between flex-wrap gap-4">
// //             <div className="flex items-center gap-3">
// //               <button
// //                 onClick={() => navigate('/admin-dashboard')}
// //                 className="rounded-xl p-2 hover:bg-teal-50 transition-colors"
// //                 title="Back to Dashboard"
// //               >
// //                 <ArrowLeft className="h-6 w-6 text-teal-700" />
// //               </button>
// //               <div className="rounded-xl bg-teal-600 p-3">
// //                 <BarChart3 className="h-6 w-6 text-white" />
// //               </div>
// //               <div>
// //                 <h1 className="text-2xl font-bold text-teal-900">Analytics & Reports</h1>
// //                 <p className="text-sm text-teal-900/70">
// //                   Comprehensive insights into hospital operations
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="flex gap-3 flex-wrap">
// //               <button
// //                 onClick={() => handleDownload('csv')}
// //                 className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2 transition-colors"
// //               >
// //                 <Download className="h-4 w-4" />
// //                 CSV
// //               </button>
// //               <button
// //                 onClick={() => handleDownload('pdf')}
// //                 className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2 transition-colors"
// //               >
// //                 <Download className="h-4 w-4" />
// //                 PDF
// //               </button>
// //               <button
// //                 onClick={handleSaveReport}
// //                 className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 flex items-center gap-2 transition-colors"
// //               >
// //                 <Save className="h-4 w-4" />
// //                 Save Report
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
// //         {/* ==================== FILTERS ==================== */}
// //         <FilterPanel
// //           filters={filters}
// //           onChange={handleFilterChange}
// //           onApply={handleApplyFilters}
// //           onReset={handleResetFilters}
// //         />

// //         {/* ==================== KEY METRICS ==================== */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //           <StatCard
// //             icon={Calendar}
// //             title="Total Appointments"
// //             value={summary?.appointments?.total?.toLocaleString() || '0'}
// //             change={comparison ? `${((summary.appointments.total - comparison.appointments) / comparison.appointments * 100).toFixed(1)}%` : null}
// //             trend={comparison && summary.appointments.total > comparison.appointments ? 'up' : 'down'}
// //           />
// //           <StatCard
// //             icon={DollarSign}
// //             title="Total Revenue"
// //             value={`LKR ${summary?.revenue?.total?.toLocaleString() || '0'}`}
// //             change={comparison ? `${((summary.revenue.total - comparison.revenue) / comparison.revenue * 100).toFixed(1)}%` : null}
// //             trend={comparison && summary.revenue.total > comparison.revenue ? 'up' : 'down'}
// //           />
// //           <StatCard
// //             icon={Users}
// //             title="Total Patients"
// //             value={summary?.patients?.total?.toLocaleString() || '0'}
// //           />
// //           <StatCard
// //             icon={FileText}
// //             title="Avg Transaction"
// //             value={`LKR ${summary?.revenue?.average?.toFixed(2) || '0.00'}`}
// //           />
// //         </div>

// //         {/* ==================== CHARTS ROW 1 ==================== */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           {/* Appointment Status Pie Chart */}
// //           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// //             <h3 className="text-lg font-semibold text-teal-900 mb-4">
// //               Appointments by Status
// //             </h3>
// //             {appointmentStatusData.length > 0 ? (
// //               <ResponsiveContainer width="100%" height={300}>
// //                 <PieChart>
// //                   <Pie
// //                     data={appointmentStatusData}
// //                     cx="50%"
// //                     cy="50%"
// //                     labelLine={false}
// //                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                     outerRadius={80}
// //                     fill="#8884d8"
// //                     dataKey="value"
// //                   >
// //                     {appointmentStatusData.map((entry, index) => (
// //                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                     ))}
// //                   </Pie>
// //                   <Tooltip />
// //                 </PieChart>
// //               </ResponsiveContainer>
// //             ) : (
// //               <div className="h-[300px] flex items-center justify-center text-teal-900/50">
// //                 No appointment data available
// //               </div>
// //             )}
// //           </div>

// //           {/* Payment Methods Bar Chart */}
// //           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// //             <h3 className="text-lg font-semibold text-teal-900 mb-4">
// //               Revenue by Payment Method
// //             </h3>
// //             {paymentMethodData.length > 0 ? (
// //               <ResponsiveContainer width="100%" height={300}>
// //                 <BarChart data={paymentMethodData}>
// //                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                   <XAxis dataKey="name" stroke="#6b7280" />
// //                   <YAxis stroke="#6b7280" />
// //                   <Tooltip 
// //                     contentStyle={{ 
// //                       backgroundColor: '#fff', 
// //                       border: '1px solid #0d9488',
// //                       borderRadius: '8px'
// //                     }}
// //                   />
// //                   <Bar dataKey="value" fill="#0d9488" radius={[8, 8, 0, 0]} />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             ) : (
// //               <div className="h-[300px] flex items-center justify-center text-teal-900/50">
// //                 No payment data available
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* ==================== DAILY REVENUE LINE CHART ==================== */}
// //         <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// //           <h3 className="text-lg font-semibold text-teal-900 mb-4">
// //             Daily Revenue Trend
// //           </h3>
// //           {dailyRevenueData.length > 0 ? (
// //             <ResponsiveContainer width="100%" height={350}>
// //               <LineChart data={dailyRevenueData}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="date" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip 
// //                   contentStyle={{ 
// //                     backgroundColor: '#fff', 
// //                     border: '1px solid #0d9488',
// //                     borderRadius: '8px'
// //                   }}
// //                 />
// //                 <Legend />
// //                 <Line 
// //                   type="monotone" 
// //                   dataKey="revenue" 
// //                   stroke="#0d9488" 
// //                   strokeWidth={2} 
// //                   dot={{ fill: '#0d9488', r: 4 }}
// //                   activeDot={{ r: 6 }}
// //                   name="Revenue (LKR)"
// //                 />
// //                 <Line 
// //                   type="monotone" 
// //                   dataKey="transactions" 
// //                   stroke="#14b8a6" 
// //                   strokeWidth={2}
// //                   dot={{ fill: '#14b8a6', r: 4 }}
// //                   activeDot={{ r: 6 }}
// //                   name="Transactions"
// //                 />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           ) : (
// //             <div className="h-[350px] flex items-center justify-center text-teal-900/50">
// //               No revenue trend data available
// //             </div>
// //           )}
// //         </div>

// //         {/* ==================== APPOINTMENTS BY DAY ==================== */}
// //         {appointmentsByDayData.length > 0 && (
// //           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// //             <h3 className="text-lg font-semibold text-teal-900 mb-4">
// //               Daily Appointments Trend
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <LineChart data={appointmentsByDayData}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="date" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip 
// //                   contentStyle={{ 
// //                     backgroundColor: '#fff', 
// //                     border: '1px solid #0d9488',
// //                     borderRadius: '8px'
// //                   }}
// //                 />
// //                 <Line 
// //                   type="monotone" 
// //                   dataKey="count" 
// //                   stroke="#2dd4bf" 
// //                   strokeWidth={2}
// //                   dot={{ fill: '#2dd4bf', r: 4 }}
// //                   activeDot={{ r: 6 }}
// //                   name="Appointments"
// //                 />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </div>
// //         )}

// //         {/* ==================== TOP DOCTORS ==================== */}
// //         {charts?.topDoctors && charts.topDoctors.length > 0 && (
// //           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
// //             <h3 className="text-lg font-semibold text-teal-900 mb-4">
// //               Top Performing Doctors
// //             </h3>
// //             <div className="space-y-3">
// //               {charts.topDoctors.slice(0, 5).map((doctor, idx) => (
// //                 <div
// //                   key={doctor.doctorId || idx}
// //                   className="flex items-center justify-between p-3 rounded-xl border border-teal-100 hover:bg-teal-50 transition-colors cursor-pointer"
// //                 >
// //                   <div className="flex items-center gap-3">
// //                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-semibold">
// //                       {idx + 1}
// //                     </div>
// //                     <div>
// //                       <p className="font-medium text-teal-900">{doctor.name || 'Unknown'}</p>
// //                       <p className="text-sm text-teal-900/70">
// //                         {doctor.appointmentCount || 0} appointments
// //                         {doctor.specialty && ` • ${doctor.specialty}`}
// //                       </p>
// //                     </div>
// //                   </div>
// //                   <ChevronRight className="h-5 w-5 text-teal-400" />
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* ==================== ADDITIONAL STATS CARDS ==================== */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           <div className="rounded-2xl border border-teal-100 bg-white p-6">
// //             <div className="flex items-center gap-2 mb-2">
// //               <Activity className="h-5 w-5 text-teal-600" />
// //               <h4 className="text-sm font-medium text-teal-900/70">Completed Appointments</h4>
// //             </div>
// //             <p className="text-2xl font-bold text-teal-900">
// //               {summary?.appointments?.completed || 0}
// //             </p>
// //             <p className="text-sm text-teal-900/70 mt-1">
// //               {summary?.appointments?.total 
// //                 ? ((summary.appointments.completed / summary.appointments.total) * 100).toFixed(1) 
// //                 : 0}% completion rate
// //             </p>
// //           </div>

// //           <div className="rounded-2xl border border-teal-100 bg-white p-6">
// //             <div className="flex items-center gap-2 mb-2">
// //               <DollarSign className="h-5 w-5 text-teal-600" />
// //               <h4 className="text-sm font-medium text-teal-900/70">Total Transactions</h4>
// //             </div>
// //             <p className="text-2xl font-bold text-teal-900">
// //               {summary?.revenue?.transactions || 0}
// //             </p>
// //             <p className="text-sm text-teal-900/70 mt-1">
// //               LKR {summary?.revenue?.transactions 
// //                 ? (summary.revenue.total / summary.revenue.transactions).toFixed(2) 
// //                 : '0.00'} avg
// //             </p>
// //           </div>

// //           <div className="rounded-2xl border border-teal-100 bg-white p-6">
// //             <div className="flex items-center gap-2 mb-2">
// //               <Building2 className="h-5 w-5 text-teal-600" />
// //               <h4 className="text-sm font-medium text-teal-900/70">Total Doctors</h4>
// //             </div>
// //             <p className="text-2xl font-bold text-teal-900">
// //               {summary?.doctors?.total || 0}
// //             </p>
// //             <p className="text-sm text-teal-900/70 mt-1">
// //               Active medical staff
// //             </p>
// //           </div>
// //         </div>

// //         {/* ==================== COMPARISON DATA ==================== */}
// //         {comparison && (
// //           <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
// //             <h3 className="text-lg font-semibold text-purple-900 mb-4">
// //               Comparison with Previous Period
// //             </h3>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               <div className="bg-white rounded-xl p-4">
// //                 <p className="text-sm text-purple-900/70 mb-1">Appointments</p>
// //                 <p className="text-2xl font-bold text-purple-900">
// //                   {comparison.appointments || 0}
// //                 </p>
// //                 <p className="text-sm text-purple-900/70 mt-1">
// //                   Previous period
// //                 </p>
// //               </div>
// //               <div className="bg-white rounded-xl p-4">
// //                 <p className="text-sm text-purple-900/70 mb-1">Revenue</p>
// //                 <p className="text-2xl font-bold text-purple-900">
// //                   LKR {(comparison.revenue || 0).toLocaleString()}
// //                 </p>
// //                 <p className="text-sm text-purple-900/70 mt-1">
// //                   Previous period
// //                 </p>
// //               </div>
// //               <div className="bg-white rounded-xl p-4">
// //                 <p className="text-sm text-purple-900/70 mb-1">Transactions</p>
// //                 <p className="text-2xl font-bold text-purple-900">
// //                   {comparison.transactions || 0}
// //                 </p>
// //                 <p className="text-sm text-purple-900/70 mt-1">
// //                   Previous period
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </main>
// //   );
// // }

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import {
//   BarChart3,
//   TrendingUp,
//   Users,
//   DollarSign,
//   Calendar,
//   Download,
//   Save,
//   Filter,
//   RefreshCw,
//   ChevronRight,
//   AlertCircle,
//   ArrowLeft,
//   Activity,
//   Building2,
//   FileText
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';
// import { useAuth } from '../../contexts/AuthContext';

// const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1'];

// // ==================== STAT CARD COMPONENT ====================
// const StatCard = ({ icon: Icon, title, value, change, trend, onClick }) => (
//   <div
//     onClick={onClick}
//     className={`rounded-2xl border border-teal-100 bg-white p-6 shadow-sm transition-all hover:shadow-md ${
//       onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
//     }`}
//   >
//     <div className="flex items-start justify-between">
//       <div>
//         <p className="text-sm font-medium text-teal-900/70">{title}</p>
//         <h3 className="mt-2 text-3xl font-bold text-teal-900">{value}</h3>
//         {change !== null && change !== undefined && (
//           <p
//             className={`mt-2 text-sm flex items-center gap-1 ${
//               trend === 'up' ? 'text-green-600' : 'text-red-600'
//             }`}
//           >
//             <TrendingUp className={`h-4 w-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
//             {change}
//           </p>
//         )}
//       </div>
//       <div className="rounded-xl bg-teal-50 p-3">
//         <Icon className="h-6 w-6 text-teal-700" />
//       </div>
//     </div>
//   </div>
// );

// // ==================== FILTER PANEL COMPONENT ====================
// const FilterPanel = ({ filters, onChange, onApply, onReset }) => {
//   return (
//     <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-teal-900 flex items-center gap-2">
//           <Filter className="h-5 w-5" />
//           Filters
//         </h3>
//         <button
//           onClick={onReset}
//           className="text-sm text-teal-700 hover:text-teal-800 flex items-center gap-1"
//         >
//           <RefreshCw className="h-4 w-4" />
//           Reset
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-teal-900 mb-1">Start Date</label>
//           <input
//             type="date"
//             value={filters.startDate}
//             onChange={(e) => onChange('startDate', e.target.value)}
//             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-teal-900 mb-1">End Date</label>
//           <input
//             type="date"
//             value={filters.endDate}
//             onChange={(e) => onChange('endDate', e.target.value)}
//             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-teal-900 mb-1">Department</label>
//           <input
//             type="text"
//             placeholder="e.g., Cardiology"
//             value={filters.department}
//             onChange={(e) => onChange('department', e.target.value)}
//             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-teal-900 mb-1">Compare With</label>
//           <select
//             value={filters.compareWith}
//             onChange={(e) => onChange('compareWith', e.target.value)}
//             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
//           >
//             <option value="">None</option>
//             <option value="week">Previous Week</option>
//             <option value="month">Previous Month</option>
//             <option value="year">Previous Year</option>
//           </select>
//         </div>
//       </div>

//       <div className="mt-4 flex gap-3">
//         <button
//           onClick={onApply}
//           className="rounded-xl bg-teal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 transition-colors"
//         >
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// };

// // ==================== MAIN DASHBOARD COMPONENT ====================
// export default function ReportsDashboard() {
//   const navigate = useNavigate();
//   const { token } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [reportData, setReportData] = useState(null);
//   const [filters, setFilters] = useState({
//     startDate: '',
//     endDate: '',
//     department: '',
//     compareWith: ''
//   });

//   // ✅ FIX: Proper Authorization header using backticks + fallback
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token?.replace?.(/^"|"$/g, '') || ''}`,
//   };

//   // ==================== FETCH REPORT DATA ====================
//   const fetchReportData = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams();
//       if (filters.startDate) queryParams.append('startDate', filters.startDate);
//       if (filters.endDate) queryParams.append('endDate', filters.endDate);
//       if (filters.department) queryParams.append('department', filters.department);
//       if (filters.compareWith) queryParams.append('compareWith', filters.compareWith);

//       console.log('Fetching from:', `${API}/api/reports/summary?${queryParams.toString()}`);

//       const response = await fetch(
//         `${API}/api/reports/summary?${queryParams.toString()}`,
//         { headers }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Failed to fetch report data');
//       }

//       const data = await response.json();
//       console.log('Report data received:', data);
//       setReportData(data);
//       toast.success('Report data loaded successfully');
//     } catch (error) {
//       toast.error(error.message);
//       console.error('Fetch report error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ==================== EVENT HANDLERS ====================
//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const handleApplyFilters = () => {
//     fetchReportData();
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       startDate: '',
//       endDate: '',
//       department: '',
//       compareWith: ''
//     });
//     setTimeout(() => {
//       fetchReportData();
//     }, 100);
//   };

//   const handleDownload = async (format) => {
//     try {
//       const queryParams = new URLSearchParams({ format, ...filters });
//       const response = await fetch(
//         `${API}/api/reports/download?${queryParams.toString()}`,
//         { headers }
//       );

//       if (!response.ok) throw new Error('Download failed');

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `hospital-report-${Date.now()}.${format}`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);

//       toast.success(`Report downloaded as ${format.toUpperCase()}`);
//     } catch (error) {
//       toast.error(error.message);
//       console.error('Download error:', error);
//     }
//   };

//   const handleSaveReport = async () => {
//     try {
//       // keep only truthy values
//       const saveFilters = Object.fromEntries(
//       Object.entries(filters).filter(([_, v]) => Boolean(v))
//     );

//       // (optional) ensure date strings are ISO
//       if (saveFilters.startDate) saveFilters.startDate = new Date(saveFilters.startDate).toISOString();
//       if (saveFilters.endDate)   saveFilters.endDate   = new Date(saveFilters.endDate).toISOString();

//       const response = await fetch(`${API}/api/reports/save`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify({
//           reportType: 'summary',
//           title: `Report ${new Date().toLocaleDateString()}`,
//           description: 'Auto-saved summary report',
//           filters: saveFilters,
//           // Tip: storing only the essentials avoids oversized payloads
//           data: {
//             period: reportData?.period,
//             summary: reportData?.summary
//           }
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Failed to save report');
//       }

//       const data = await response.json();
//       toast.success('Report saved successfully');
//       console.log('Saved report:', data);
//     } catch (error) {
//       toast.error(error.message);
//       console.error('Save error:', error);
//     }
//   };

//   // ==================== LOADING STATE ====================
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="h-12 w-12 text-teal-600 animate-spin mx-auto" />
//           <p className="mt-4 text-teal-900 font-medium">Loading report data...</p>
//           <p className="mt-2 text-sm text-teal-900/70">Please wait while we fetch your analytics</p>
//         </div>
//       </div>
//     );
//   }

//   // ==================== ERROR STATE ====================
//   if (!reportData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />
//           <h2 className="mt-4 text-xl font-semibold text-teal-900">No Data Available</h2>
//           <p className="mt-2 text-sm text-teal-900/70">
//             Unable to load report data. Please check your connection and try again.
//           </p>
//           <div className="mt-6 flex gap-3 justify-center">
//             <button
//               onClick={fetchReportData}
//               className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 flex items-center gap-2"
//             >
//               <RefreshCw className="h-4 w-4" />
//               Retry
//             </button>
//             <button
//               onClick={() => navigate('/admin-dashboard')}
//               className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const { summary, charts, comparison } = reportData;

//   // ==================== PREPARE CHART DATA ====================
//   const appointmentStatusData =
//     charts?.appointmentsByStatus?.map(item => ({
//       name: item._id || 'Unknown',
//       value: item.count || 0
//     })) || [];

//   const dailyRevenueData =
//     charts?.dailyRevenue?.map(item => ({
//       date: item._id || '',
//       revenue: item.revenue || 0,
//       transactions: item.transactions || 0
//     })) || [];

//   const paymentMethodData =
//     charts?.paymentsByMethod?.map(item => ({
//       name: item._id || 'Unknown',
//       value: item.total || 0,
//       count: item.count || 0
//     })) || [];

//   const appointmentsByDayData =
//     charts?.appointmentsByDay?.map(item => ({
//       date: item._id || '',
//       count: item.count || 0
//     })) || [];

//   // Helpers for % change (avoid divide-by-zero/NaN)
//   const pct = (curr, prev) =>
//     prev && prev !== 0 ? `${(((curr - prev) / prev) * 100).toFixed(1)}%` : null;

//   // ==================== RENDER ====================
//   return (
//     <main className="min-h-screen bg-gray-50">
//       {/* ==================== HEADER ==================== */}
//       <section className="bg-white border-b border-teal-100">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => navigate('/admin-dashboard')}
//                 className="rounded-xl p-2 hover:bg-teal-50 transition-colors"
//                 title="Back to Dashboard"
//               >
//                 <ArrowLeft className="h-6 w-6 text-teal-700" />
//               </button>
//               <div className="rounded-xl bg-teal-600 p-3">
//                 <BarChart3 className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-teal-900">Analytics & Reports</h1>
//                 <p className="text-sm text-teal-900/70">
//                   Comprehensive insights into hospital operations
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-3 flex-wrap">
//               <button
//                 onClick={() => handleDownload('csv')}
//                 className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2 transition-colors"
//               >
//                 <Download className="h-4 w-4" />
//                 CSV
//               </button>
//               <button
//                 onClick={() => handleDownload('pdf')}
//                 className="rounded-XL border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2 transition-colors"
//               >
//                 <Download className="h-4 w-4" />
//                 PDF
//               </button>
//               <button
//                 onClick={handleSaveReport}
//                 className="rounded-XL bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 flex items-center gap-2 transition-colors"
//               >
//                 <Save className="h-4 w-4" />
//                 Save Report
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
//         {/* ==================== FILTERS ==================== */}
//         <FilterPanel
//           filters={filters}
//           onChange={handleFilterChange}
//           onApply={handleApplyFilters}
//           onReset={handleResetFilters}
//         />

//         {/* ==================== KEY METRICS ==================== */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             icon={Calendar}
//             title="Total Appointments"
//             value={summary?.appointments?.total?.toLocaleString() || '0'}
//             change={comparison ? pct(summary.appointments.total, comparison.appointments) : null}
//             trend={
//               comparison && comparison.appointments
//                 ? summary.appointments.total >= comparison.appointments
//                   ? 'up'
//                   : 'down'
//                 : 'up'
//             }
//           />
//           <StatCard
//             icon={DollarSign}
//             title="Total Revenue"
//             value={`LKR ${summary?.revenue?.total?.toLocaleString() || '0'}`}
//             change={comparison ? pct(summary.revenue.total, comparison.revenue) : null}
//             trend={
//               comparison && comparison.revenue
//                 ? summary.revenue.total >= comparison.revenue
//                   ? 'up'
//                   : 'down'
//                 : 'up'
//             }
//           />
//           <StatCard
//             icon={Users}
//             title="Total Patients"
//             value={summary?.patients?.total?.toLocaleString() || '0'}
//           />
//           <StatCard
//             icon={FileText}
//             title="Avg Transaction"
//             value={`LKR ${summary?.revenue?.average?.toFixed(2) || '0.00'}`}
//           />
//         </div>

//         {/* ==================== CHARTS ROW 1 ==================== */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Appointment Status Pie Chart */}
//           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
//             <h3 className="text-lg font-semibold text-teal-900 mb-4">Appointments by Status</h3>
//             {appointmentStatusData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={appointmentStatusData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {appointmentStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-[300px] flex items-center justify-center text-teal-900/50">
//                 No appointment data available
//               </div>
//             )}
//           </div>

//           {/* Payment Methods Bar Chart */}
//           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
//             <h3 className="text-lg font-semibold text-teal-900 mb-4">Revenue by Payment Method</h3>
//             {paymentMethodData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={paymentMethodData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="name" stroke="#6b7280" />
//                   <YAxis stroke="#6b7280" />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: '#fff',
//                       border: '1px solid #0d9488',
//                       borderRadius: '8px'
//                     }}
//                   />
//                   <Bar dataKey="value" fill="#0d9488" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-[300px] flex items-center justify-center text-teal-900/50">
//                 No payment data available
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ==================== DAILY REVENUE LINE CHART ==================== */}
//         <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
//           <h3 className="text-lg font-semibold text-teal-900 mb-4">Daily Revenue Trend</h3>
//           {dailyRevenueData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={350}>
//               <LineChart data={dailyRevenueData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="date" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#fff',
//                     border: '1px solid #0d9488',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#0d9488"
//                   strokeWidth={2}
//                   dot={{ fill: '#0d9488', r: 4 }}
//                   activeDot={{ r: 6 }}
//                   name="Revenue (LKR)"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="transactions"
//                   stroke="#14b8a6"
//                   strokeWidth={2}
//                   dot={{ fill: '#14b8a6', r: 4 }}
//                   activeDot={{ r: 6 }}
//                   name="Transactions"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-[350px] flex items-center justify-center text-teal-900/50">
//               No revenue trend data available
//             </div>
//           )}
//         </div>

//         {/* ==================== APPOINTMENTS BY DAY ==================== */}
//         {appointmentsByDayData.length > 0 && (
//           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
//             <h3 className="text-lg font-semibold text-teal-900 mb-4">Daily Appointments Trend</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={appointmentsByDayData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="date" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#fff',
//                     border: '1px solid #0d9488',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="count"
//                   stroke="#2dd4bf"
//                   strokeWidth={2}
//                   dot={{ fill: '#2dd4bf', r: 4 }}
//                   activeDot={{ r: 6 }}
//                   name="Appointments"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* ==================== TOP DOCTORS ==================== */}
//         {charts?.topDoctors && charts.topDoctors.length > 0 && (
//           <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
//             <h3 className="text-lg font-semibold text-teal-900 mb-4">Top Performing Doctors</h3>
//             <div className="space-y-3">
//               {charts.topDoctors.slice(0, 5).map((doctor, idx) => (
//                 <div
//                   key={doctor.doctorId || idx}
//                   className="flex items-center justify-between p-3 rounded-xl border border-teal-100 hover:bg-teal-50 transition-colors cursor-pointer"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-semibold">
//                       {idx + 1}
//                     </div>
//                     <div>
//                       <p className="font-medium text-teal-900">{doctor.name || 'Unknown'}</p>
//                       <p className="text-sm text-teal-900/70">
//                         {doctor.appointmentCount || 0} appointments
//                         {doctor.specialty ? ` • ${doctor.specialty}` : ''}
//                       </p>
//                     </div>
//                   </div>
//                   <ChevronRight className="h-5 w-5 text-teal-400" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ==================== ADDITIONAL STATS CARDS ==================== */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="rounded-2xl border border-teal-100 bg-white p-6">
//             <div className="flex items-center gap-2 mb-2">
//               <Activity className="h-5 w-5 text-teal-600" />
//               <h4 className="text-sm font-medium text-teal-900/70">Completed Appointments</h4>
//             </div>
//             <p className="text-2xl font-bold text-teal-900">
//               {summary?.appointments?.completed || 0}
//             </p>
//             <p className="text-sm text-teal-900/70 mt-1">
//               {summary?.appointments?.total
//                 ? ((summary.appointments.completed / summary.appointments.total) * 100).toFixed(1)
//                 : 0}% completion rate
//             </p>
//           </div>

//           <div className="rounded-2xl border border-teal-100 bg-white p-6">
//             <div className="flex items-center gap-2 mb-2">
//               <DollarSign className="h-5 w-5 text-teal-600" />
//               <h4 className="text-sm font-medium text-teal-900/70">Total Transactions</h4>
//             </div>
//             <p className="text-2xl font-bold text-teal-900">
//               {summary?.revenue?.transactions || 0}
//             </p>
//             <p className="text-sm text-teal-900/70 mt-1">
//               LKR {summary?.revenue?.transactions
//                 ? (summary.revenue.total / summary.revenue.transactions).toFixed(2)
//                 : '0.00'} avg
//             </p>
//           </div>

//           <div className="rounded-2xl border border-teal-100 bg-white p-6">
//             <div className="flex items-center gap-2 mb-2">
//               <Building2 className="h-5 w-5 text-teal-600" />
//               <h4 className="text-sm font-medium text-teal-900/70">Total Doctors</h4>
//             </div>
//             <p className="text-2xl font-bold text-teal-900">
//               {summary?.doctors?.total || 0}
//             </p>
//             <p className="text-sm text-teal-900/70 mt-1">Active medical staff</p>
//           </div>
//         </div>

//         {/* ==================== COMPARISON DATA ==================== */}
//         {comparison && (
//           <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
//             <h3 className="text-lg font-semibold text-purple-900 mb-4">
//               Comparison with Previous Period
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white rounded-xl p-4">
//                 <p className="text-sm text-purple-900/70 mb-1">Appointments</p>
//                 <p className="text-2xl font-bold text-purple-900">
//                   {comparison.appointments || 0}
//                 </p>
//                 <p className="text-sm text-purple-900/70 mt-1">Previous period</p>
//               </div>
//               <div className="bg-white rounded-xl p-4">
//                 <p className="text-sm text-purple-900/70 mb-1">Revenue</p>
//                 <p className="text-2xl font-bold text-purple-900">
//                   LKR {(comparison.revenue || 0).toLocaleString()}
//                 </p>
//                 <p className="text-sm text-purple-900/70 mt-1">Previous period</p>
//               </div>
//               <div className="bg-white rounded-xl p-4">
//                 <p className="text-sm text-purple-900/70 mb-1">Transactions</p>
//                 <p className="text-2xl font-bold text-purple-900">
//                   {comparison.transactions || 0}
//                 </p>
//                 <p className="text-sm text-purple-900/70 mt-1">Previous period</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  Save,
  Filter,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  Activity,
  Building2,
  FileText,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1'];

// ---------- small helpers ----------
const pct = (curr, prev) => (prev && prev !== 0 ? `${(((curr - prev) / prev) * 100).toFixed(1)}%` : null);

const buildQuery = (filters) => {
  const qp = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) qp.append(k, v);
  });
  return qp.toString();
};

// ==================== STAT CARD ====================
const StatCard = ({ icon: Icon, title, value, change, trend, onClick }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl border border-teal-100 bg-white p-6 shadow-sm transition-all hover:shadow-md ${
      onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
    }`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-teal-900/70">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-teal-900">{value}</h3>
        {change != null && (
          <p className={`mt-2 text-sm flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-4 w-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {change}
          </p>
        )}
      </div>
      <div className="rounded-xl bg-teal-50 p-3">
        <Icon className="h-6 w-6 text-teal-700" />
      </div>
    </div>
  </div>
);

// ==================== FILTER PANEL ====================
const FilterPanel = ({ filters, onChange, onApply, onReset }) => (
  <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-teal-900 flex items-center gap-2">
        <Filter className="h-5 w-5" />
        Filters
      </h3>
      <button onClick={onReset} className="text-sm text-teal-700 hover:text-teal-800 flex items-center gap-1">
        <RefreshCw className="h-4 w-4" />
        Reset
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-teal-900 mb-1">Start Date</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
          className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-teal-900 mb-1">End Date</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onChange('endDate', e.target.value)}
          className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-teal-900 mb-1">Department</label>
        <input
          type="text"
          placeholder="e.g., Cardiology"
          value={filters.department}
          onChange={(e) => onChange('department', e.target.value)}
          className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-teal-900 mb-1">Compare With</label>
        <select
          value={filters.compareWith}
          onChange={(e) => onChange('compareWith', e.target.value)}
          className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
        >
          <option value="">None</option>
          <option value="week">Previous Week</option>
          <option value="month">Previous Month</option>
          <option value="year">Previous Year</option>
        </select>
      </div>
    </div>

    <div className="mt-4 flex gap-3">
      <button
        onClick={onApply}
        className="rounded-xl bg-teal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  </div>
);

// ==================== MAIN DASHBOARD ====================
export default function ReportsDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: '',
    compareWith: '',
  });

  const authHeader = useMemo(() => {
    const raw = token?.replace?.(/^"|"$/g, '') || '';
    return raw ? { Authorization: `Bearer ${raw}` } : {};
  }, [token]);

  const jsonHeaders = useMemo(() => ({ 'Content-Type': 'application/json', ...authHeader }), [authHeader]);

  const ensureAuth = () => {
    if (!authHeader.Authorization) {
      toast.error('You are not authenticated. Please sign in again.');
      navigate('/login');
      return false;
    }
    return true;
  };

  // ---------- fetch summary ----------
  const fetchReportData = async () => {
    if (!ensureAuth()) return;
    setLoading(true);
    try {
      const qs = buildQuery(filters);
      const url = `${API}/api/reports/summary?${qs}`;
      console.log('Fetching from:', url);

      const res = await fetch(url, { headers: authHeader });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch report data');
      }
      const data = await res.json();
      console.log('Report data received:', data);
      setReportData(data);
    } catch (e) {
      console.error('Fetch report error:', e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const handleApplyFilters = () => fetchReportData();
  const handleResetFilters = () => {
    setFilters({ startDate: '', endDate: '', department: '', compareWith: '' });
    setTimeout(fetchReportData, 100);
  };

  const handleDownload = async (format) => {
    if (!ensureAuth()) return;
    try {
      const qs = buildQuery({ format, ...filters });
      const res = await fetch(`${API}/api/reports/download?${qs}`, { headers: authHeader });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Download failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hospital-report-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`Report downloaded as ${format.toUpperCase()}`);
    } catch (e) {
      console.error('Download error:', e);
      toast.error(e.message);
    }
  };

  const handleSaveReport = async () => {
    if (!ensureAuth()) return;
    try {
      const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => !!v));
      if (clean.startDate) clean.startDate = new Date(clean.startDate).toISOString();
      if (clean.endDate) clean.endDate = new Date(clean.endDate).toISOString();

      const body = {
        reportType: 'summary',
        title: `Report ${new Date().toLocaleDateString()}`,
        description: 'Auto-saved summary report',
        filters: clean,
        data: {
          period: reportData?.period,
          summary: reportData?.summary,
        },
      };

      const res = await fetch(`${API}/api/reports/save`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save report');
      }
      const data = await res.json();
      console.log('Saved report:', data);
      toast.success('Report saved successfully');
    } catch (e) {
      console.error('Save error:', e);
      toast.error(e.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-teal-600 animate-spin mx-auto" />
          <p className="mt-4 text-teal-900 font-medium">Loading report data...</p>
          <p className="mt-2 text-sm text-teal-900/70">Please wait while we fetch your analytics</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-teal-900">No Data Available</h2>
          <p className="mt-2 text-sm text-teal-900/70">Unable to load report data. Please try again.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={fetchReportData}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { summary, charts, comparison } = reportData;

  const appointmentStatusData = charts?.appointmentsByStatus?.map((i) => ({ name: i._id || 'Unknown', value: i.count || 0 })) || [];
  const dailyRevenueData = charts?.dailyRevenue?.map((i) => ({ date: i._id || '', revenue: i.revenue || 0, transactions: i.transactions || 0 })) || [];
  const paymentMethodData = charts?.paymentsByMethod?.map((i) => ({ name: i._id || 'Unknown', value: i.total || 0, count: i.count || 0 })) || [];
  const appointmentsByDayData = charts?.appointmentsByDay?.map((i) => ({ date: i._id || '', count: i.count || 0 })) || [];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-teal-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin-dashboard')} className="rounded-xl p-2 hover:bg-teal-50" title="Back to Dashboard">
                <ArrowLeft className="h-6 w-6 text-teal-700" />
              </button>
              <div className="rounded-xl bg-teal-600 p-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-teal-900">Analytics & Reports</h1>
                <p className="text-sm text-teal-900/70">Comprehensive insights into hospital operations</p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleDownload('csv')}
                className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                CSV
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                PDF
              </button>
              <button onClick={handleSaveReport} className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Report
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <FilterPanel filters={filters} onChange={handleFilterChange} onApply={handleApplyFilters} onReset={handleResetFilters} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Calendar}
            title="Total Appointments"
            value={summary?.appointments?.total?.toLocaleString() || '0'}
            change={comparison ? pct(summary.appointments.total, comparison.appointments) : null}
            trend={comparison && comparison.appointments ? (summary.appointments.total >= comparison.appointments ? 'up' : 'down') : 'up'}
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`LKR ${summary?.revenue?.total?.toLocaleString() || '0'}`}
            change={comparison ? pct(summary.revenue.total, comparison.revenue) : null}
            trend={comparison && comparison.revenue ? (summary.revenue.total >= comparison.revenue ? 'up' : 'down') : 'up'}
          />
          <StatCard icon={Users} title="Total Patients" value={summary?.patients?.total?.toLocaleString() || '0'} />
          <StatCard icon={FileText} title="Avg Transaction" value={`LKR ${summary?.revenue?.average?.toFixed(2) || '0.00'}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-900 mb-4">Appointments by Status</h3>
            {appointmentStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {appointmentStatusData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-teal-900/50">No appointment data available</div>
            )}
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-900 mb-4">Revenue by Payment Method</h3>
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentMethodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #0d9488', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#0d9488" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-teal-900/50">No payment data available</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-900 mb-4">Daily Revenue Trend</h3>
          {dailyRevenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #0d9488', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue (LKR)" />
                <Line type="monotone" dataKey="transactions" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Transactions" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-teal-900/50">No revenue trend data available</div>
          )}
        </div>

        {appointmentsByDayData.length > 0 && (
          <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-900 mb-4">Daily Appointments Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={appointmentsByDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #0d9488', borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Appointments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {charts?.topDoctors?.length > 0 && (
          <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-900 mb-4">Top Performing Doctors</h3>
            <div className="space-y-3">
              {charts.topDoctors.slice(0, 5).map((doctor, idx) => (
                <div
                  key={doctor.doctorId || idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-teal-100 hover:bg-teal-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-semibold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-teal-900">{doctor.name || 'Unknown'}</p>
                      <p className="text-sm text-teal-900/70">
                        {doctor.appointmentCount || 0} appointments{doctor.specialty ? ` • ${doctor.specialty}` : ''}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-teal-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-teal-100 bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-teal-600" />
              <h4 className="text-sm font-medium text-teal-900/70">Completed Appointments</h4>
            </div>
            <p className="text-2xl font-bold text-teal-900">{summary?.appointments?.completed || 0}</p>
            <p className="text-sm text-teal-900/70 mt-1">
              {summary?.appointments?.total ? ((summary.appointments.completed / summary.appointments.total) * 100).toFixed(1) : 0}% completion
              rate
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-teal-600" />
              <h4 className="text-sm font-medium text-teal-900/70">Total Transactions</h4>
            </div>
            <p className="text-2xl font-bold text-teal-900">{summary?.revenue?.transactions || 0}</p>
            <p className="text-sm text-teal-900/70 mt-1">
              LKR {summary?.revenue?.transactions ? (summary.revenue.total / summary.revenue.transactions).toFixed(2) : '0.00'} avg
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-teal-600" />
              <h4 className="text-sm font-medium text-teal-900/70">Total Doctors</h4>
            </div>
            <p className="text-2xl font-bold text-teal-900">{summary?.doctors?.total || 0}</p>
            <p className="text-sm text-teal-900/70 mt-1">Active medical staff</p>
          </div>
        </div>

        {comparison && (
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Comparison with Previous Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-purple-900/70 mb-1">Appointments</p>
                <p className="text-2xl font-bold text-purple-900">{comparison.appointments || 0}</p>
                <p className="text-sm text-purple-900/70 mt-1">Previous period</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-purple-900/70 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-purple-900">LKR {(comparison.revenue || 0).toLocaleString()}</p>
                <p className="text-sm text-purple-900/70 mt-1">Previous period</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-purple-900/70 mb-1">Transactions</p>
                <p className="text-2xl font-bold text-purple-900">{comparison.transactions || 0}</p>
                <p className="text-sm text-purple-900/70 mt-1">Previous period</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
