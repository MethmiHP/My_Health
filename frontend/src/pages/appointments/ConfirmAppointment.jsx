// // // // // // src/pages/appointments/ConfirmAppointment.jsx
// // // // // import React, { useState } from 'react';
// // // // // import { useNavigate, useSearchParams } from 'react-router-dom';
// // // // // import { toast } from 'react-toastify';
// // // // // import { API_BASE, useAuthHeaders, postJSON } from '../../utils/api';
// // // // // import { ClipboardList, User, Calendar, Clock } from 'lucide-react';

// // // // // export default function ConfirmAppointment() {
// // // // //   const [params] = useSearchParams();
// // // // //   const doctorId = params.get('doctorId');
// // // // //   const doctorName = params.get('name') || 'Doctor';
// // // // //   const slotStart = params.get('start');
// // // // //   const slotEnd = params.get('end');

// // // // //   const headers = useAuthHeaders();
// // // // //   const navigate = useNavigate();
// // // // //   const [reason, setReason] = useState('');
// // // // //   const [loading, setLoading] = useState(false);

// // // // //   const start = slotStart ? new Date(slotStart) : null;
// // // // //   const end = slotEnd ? new Date(slotEnd) : null;

// // // // //   const submit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     if (!doctorId || !slotStart || !slotEnd) {
// // // // //       toast.error('Invalid booking details');
// // // // //       return;
// // // // //     }
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       await postJSON(`${API_BASE}/api/appointments`, headers, {
// // // // //         doctorId,
// // // // //         slotStart,
// // // // //         slotEnd,
// // // // //         reason,
// // // // //       });
// // // // //       toast.success('Appointment confirmed');
// // // // //       // navigate('/appointments/my', { replace: true });

// // // // //       // If you have these values available, include them:
// // // // // const hospital = params.get('hospital') || undefined;
// // // // // // If you can read current user info, you can pass patientName/email/phone too.

// // // // // navigate(
// // // // //   `/appointments/confirmed?name=${encodeURIComponent(doctorName)}&start=${encodeURIComponent(
// // // // //     slotStart
// // // // //   )}&end=${encodeURIComponent(slotEnd)}${hospital ? `&hospital=${encodeURIComponent(hospital)}` : ''}`,
// // // // //   {
// // // // //     replace: true,
// // // // //     state: {
// // // // //       doctorName,
// // // // //       start: slotStart,
// // // // //       end: slotEnd,
// // // // //       hospital,
// // // // //       // patientName, patientEmail, patientPhone // add if you have them
// // // // //     },
// // // // //   }
// // // // // );
// // // // //     } catch (e) {
// // // // //       toast.error(e.message);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <main className="max-w-xl mx-auto px-4 py-8">
// // // // //       <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
// // // // //         <ClipboardList className="h-6 w-6 text-teal-700" /> Confirm Appointment
// // // // //       </h1>

// // // // //       <div className="mt-6 rounded-xl border border-teal-100 bg-white p-4 text-sm">
// // // // //         <div className="flex items-center gap-2">
// // // // //           <User className="h-4 w-4 text-teal-700" />
// // // // //           <span className="font-medium text-teal-900">{doctorName}</span>
// // // // //         </div>
// // // // //         <div className="mt-2 flex items-center gap-2">
// // // // //           <Calendar className="h-4 w-4 text-teal-700" />
// // // // //           <span>{start?.toLocaleDateString()}</span>
// // // // //         </div>
// // // // //         <div className="mt-1 flex items-center gap-2">
// // // // //           <Clock className="h-4 w-4 text-teal-700" />
// // // // //           <span>
// // // // //             {start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
// // // // //             {end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // // //           </span>
// // // // //         </div>
// // // // //       </div>

// // // // //       <form onSubmit={submit} className="mt-6 space-y-3">
// // // // //         <label className="block">
// // // // //           <span className="block text-sm font-medium text-teal-900 mb-1">Symptoms / reason (optional)</span>
// // // // //           <textarea
// // // // //             rows={4}
// // // // //             value={reason}
// // // // //             onChange={(e) => setReason(e.target.value)}
// // // // //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
// // // // //             placeholder="Briefly describe your symptoms"
// // // // //           />
// // // // //         </label>

// // // // //         <div className="flex justify-end gap-2">
// // // // //           <button
// // // // //             type="button"
// // // // //             onClick={() => window.history.back()}
// // // // //             className="rounded-lg border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
// // // // //           >
// // // // //             Back
// // // // //           </button>
// // // // //           <button
// // // // //             type="submit"
// // // // //             disabled={loading}
// // // // //             className={`rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 ${
// // // // //               loading ? 'opacity-60 cursor-not-allowed' : ''
// // // // //             }`}
// // // // //           >
// // // // //             {loading ? 'Booking…' : 'Confirm Booking'}
// // // // //           </button>
// // // // //         </div>
// // // // //       </form>
// // // // //     </main>
// // // // //   );
// // // // // }

// // // // // src/pages/appointments/ConfirmAppointment.jsx
// // // // import React, { useEffect, useState } from 'react';
// // // // import { useNavigate, useSearchParams } from 'react-router-dom';
// // // // import { toast } from 'react-toastify';
// // // // import { API_BASE, useAuthHeaders, postJSON, getJSON } from '../../utils/api';
// // // // import { ClipboardList, User, Calendar, Clock } from 'lucide-react';

// // // // export default function ConfirmAppointment() {
// // // //   const [params] = useSearchParams();
// // // //   const doctorId = params.get('doctorId');
// // // //   const doctorName = params.get('name') || 'Doctor';
// // // //   const slotStart = params.get('start');
// // // //   const slotEnd = params.get('end');

// // // //   const headers = useAuthHeaders();
// // // //   const navigate = useNavigate();

// // // //   const [reason, setReason] = useState('');
// // // //   const [loading, setLoading] = useState(false);

// // // //   // patient profile
// // // //   const [patientName, setPatientName] = useState('');
// // // //   const [patientEmail, setPatientEmail] = useState('');
// // // //   const [patientPhone, setPatientPhone] = useState('');

// // // //   const start = slotStart ? new Date(slotStart) : null;
// // // //   const end = slotEnd ? new Date(slotEnd) : null;

// // // //   // Fetch current user's profile (name/email/phone)
// // // //   useEffect(() => {
// // // //     let isMounted = true;

// // // //     const loadMe = async () => {
// // // //       try {
// // // //         // try users/me first
// // // //         const me = await getJSON(`${API_BASE}/api/users/me`, headers);
// // // //         if (!isMounted) return;
// // // //         const fullName = [me.firstName, me.lastName].filter(Boolean).join(' ').trim() || me.name || '';
// // // //         setPatientName(fullName);
// // // //         setPatientEmail(me.email || '');
// // // //         setPatientPhone(me.phone || me.mobile || '');
// // // //       } catch (e1) {
// // // //         // fallback to patients/me if your API exposes it there
// // // //         try {
// // // //           const me = await getJSON(`${API_BASE}/api/patients/me`, headers);
// // // //           if (!isMounted) return;
// // // //           const fullName = [me.firstName, me.lastName].filter(Boolean).join(' ').trim() || me.name || '';
// // // //           setPatientName(fullName);
// // // //           setPatientEmail(me.email || '');
// // // //           setPatientPhone(me.phone || me.mobile || '');
// // // //         } catch (e2) {
// // // //           // keep silent; fields will just be blank on the confirmed screen
// // // //           // (you can toast here if you prefer)
// // // //         }
// // // //       }
// // // //     };

// // // //     loadMe();
// // // //     return () => { isMounted = false; };
// // // //   }, [API_BASE]); // headers is stable from hook; avoid refetch loops

// // // //   const submit = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!doctorId || !slotStart || !slotEnd) {
// // // //       toast.error('Invalid booking details');
// // // //       return;
// // // //     }
// // // //     setLoading(true);
// // // //     try {
// // // //       await postJSON(`${API_BASE}/api/appointments`, headers, {
// // // //         doctorId,
// // // //         slotStart,
// // // //         slotEnd,
// // // //         reason,
// // // //       });

// // // //       toast.success('Appointment confirmed');

// // // //       const hospital = params.get('hospital') || undefined;

// // // //       // Build a URL with fallbacks so refresh still shows details
// // // //       const url = `/appointments/confirmed?name=${encodeURIComponent(
// // // //         doctorName
// // // //       )}&start=${encodeURIComponent(slotStart)}&end=${encodeURIComponent(
// // // //         slotEnd
// // // //       )}${
// // // //         hospital ? `&hospital=${encodeURIComponent(hospital)}` : ''
// // // //       }${
// // // //         patientName ? `&patient=${encodeURIComponent(patientName)}` : ''
// // // //       }${
// // // //         patientEmail ? `&email=${encodeURIComponent(patientEmail)}` : ''
// // // //       }${
// // // //         patientPhone ? `&phone=${encodeURIComponent(patientPhone)}` : ''
// // // //       }`;

// // // //       // Prefer passing full state (richer + not visible in URL)
// // // //       navigate(url, {
// // // //         replace: true,
// // // //         state: {
// // // //           doctorName,
// // // //           start: slotStart,
// // // //           end: slotEnd,
// // // //           hospital,
// // // //           patientName: patientName || undefined,
// // // //           patientEmail: patientEmail || undefined,
// // // //           patientPhone: patientPhone || undefined,
// // // //         },
// // // //       });
// // // //     } catch (e) {
// // // //       toast.error(e.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <main className="max-w-xl mx-auto px-4 py-8">
// // // //       <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
// // // //         <ClipboardList className="h-6 w-6 text-teal-700" /> Confirm Appointment
// // // //       </h1>

// // // //       <div className="mt-6 rounded-xl border border-teal-100 bg-white p-4 text-sm">
// // // //         <div className="flex items-center gap-2">
// // // //           <User className="h-4 w-4 text-teal-700" />
// // // //           <span className="font-medium text-teal-900">{doctorName}</span>
// // // //         </div>
// // // //         <div className="mt-2 flex items-center gap-2">
// // // //           <Calendar className="h-4 w-4 text-teal-700" />
// // // //           <span>{start?.toLocaleDateString()}</span>
// // // //         </div>
// // // //         <div className="mt-1 flex items-center gap-2">
// // // //           <Clock className="h-4 w-4 text-teal-700" />
// // // //           <span>
// // // //             {start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
// // // //             {end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // //           </span>
// // // //         </div>
// // // //       </div>

// // // //       <form onSubmit={submit} className="mt-6 space-y-3">
// // // //         <label className="block">
// // // //           <span className="block text-sm font-medium text-teal-900 mb-1">
// // // //             Symptoms / reason (optional)
// // // //           </span>
// // // //           <textarea
// // // //             rows={4}
// // // //             value={reason}
// // // //             onChange={(e) => setReason(e.target.value)}
// // // //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
// // // //             placeholder="Briefly describe your symptoms"
// // // //           />
// // // //         </label>

// // // //         <div className="flex justify-end gap-2">
// // // //           <button
// // // //             type="button"
// // // //             onClick={() => window.history.back()}
// // // //             className="rounded-lg border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
// // // //           >
// // // //             Back
// // // //           </button>
// // // //           <button
// // // //             type="submit"
// // // //             disabled={loading}
// // // //             className={`rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 ${
// // // //               loading ? 'opacity-60 cursor-not-allowed' : ''
// // // //             }`}
// // // //           >
// // // //             {loading ? 'Booking…' : 'Confirm Booking'}
// // // //           </button>
// // // //         </div>
// // // //       </form>
// // // //     </main>
// // // //   );
// // // // }

// // // import React, { useEffect, useState } from 'react';
// // // import { useNavigate, useSearchParams } from 'react-router-dom';
// // // import { toast } from 'react-toastify';
// // // import { API_BASE, useAuthHeaders, postJSON, getJSON } from '../../utils/api';
// // // import { ClipboardList, User, Calendar, Clock } from 'lucide-react';

// // // export default function ConfirmAppointment() {
// // //   const [params] = useSearchParams();
// // //   const doctorId = params.get('doctorId');
// // //   const doctorName = params.get('name') || 'Doctor';
// // //   const slotStart = params.get('start');
// // //   const slotEnd = params.get('end');

// // //   const headers = useAuthHeaders();
// // //   const navigate = useNavigate();

// // //   const [reason, setReason] = useState('');
// // //   const [loading, setLoading] = useState(false);

// // //   // patient profile
// // //   const [patientName, setPatientName] = useState('');
// // //   const [patientEmail, setPatientEmail] = useState('');
// // //   const [patientPhone, setPatientPhone] = useState('');

// // //   const start = slotStart ? new Date(slotStart) : null;
// // //   const end = slotEnd ? new Date(slotEnd) : null;

// // //   // --- Helpers ---------------------------------------------------------------

// // //   const normalizeMe = (raw) => {
// // //     // Accept { ... }, { data: {...} }, or { user: {...} }
// // //     const me = raw?.user || raw?.data || raw || {};
// // //     const first = me.firstName || me.firstname || me.givenName || '';
// // //     const last  = me.lastName  || me.lastname  || me.familyName || '';
// // //     const name  = [first, last].filter(Boolean).join(' ').trim() || me.name || me.fullName || '';

// // //     const email = me.email || me.primaryEmail || '';
// // //     const phone = me.phone || me.mobile || me.contactNumber || me.phoneNumber || '';

// // //     return { name, email, phone };
// // //   };

// // //   const fetchMe = async () => {
// // //     // Try a few likely endpoints. Stop on the first that works.
// // //     const endpoints = [
// // //       `${API_BASE}/api/users/me`,
// // //       `${API_BASE}/api/patients/me`,
// // //       `${API_BASE}/api/auth/me`,
// // //     ];

// // //     for (const url of endpoints) {
// // //       try {
// // //         const res = await getJSON(url, headers);
// // //         const { name, email, phone } = normalizeMe(res);
// // //         // If at least one field is present, accept this endpoint.
// // //         if (name || email || phone) {
// // //           setPatientName(name || '');
// // //           setPatientEmail(email || '');
// // //           setPatientPhone(phone || '');
// // //           return;
// // //         }
// // //       } catch (_) {
// // //         // keep trying next endpoint
// // //       }
// // //     }
// // //     // If nothing worked, leave fields blank (UI handles it).
// // //   };

// // //   // --------------------------------------------------------------------------

// // //   // Fetch current user's profile (name/email/phone)
// // //   useEffect(() => {
// // //     let mounted = true;
// // //     (async () => {
// // //       await fetchMe();
// // //       if (!mounted) return;
// // //     })();
// // //     return () => { mounted = false; };
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []); // run once

// // //   const submit = async (e) => {
// // //     e.preventDefault();
// // //     if (!doctorId || !slotStart || !slotEnd) {
// // //       toast.error('Invalid booking details');
// // //       return;
// // //     }
// // //     setLoading(true);
// // //     try {
// // //       await postJSON(`${API_BASE}/api/appointments`, headers, {
// // //         doctorId,
// // //         slotStart,
// // //         slotEnd,
// // //         reason,
// // //       });

// // //       toast.success('Appointment confirmed');

// // //       const hospital = params.get('hospital') || undefined;

// // //       // Build a URL with fallbacks so refresh still shows details
// // //       const search = new URLSearchParams();
// // //       search.set('name', doctorName);
// // //       search.set('start', slotStart);
// // //       search.set('end', slotEnd);
// // //       if (hospital) search.set('hospital', hospital);
// // //       if (patientName)  search.set('patient', patientName);
// // //       if (patientEmail) search.set('email', patientEmail);
// // //       if (patientPhone) search.set('phone', patientPhone);

// // //       navigate(`/appointments/confirmed?${search.toString()}`, {
// // //         replace: true,
// // //         state: {
// // //           doctorName,
// // //           start: slotStart,
// // //           end: slotEnd,
// // //           hospital,
// // //           patientName: patientName || undefined,
// // //           patientEmail: patientEmail || undefined,
// // //           patientPhone: patientPhone || undefined,
// // //         },
// // //       });
// // //     } catch (e) {
// // //       toast.error(e.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <main className="max-w-xl mx-auto px-4 py-8">
// // //       <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
// // //         <ClipboardList className="h-6 w-6 text-teal-700" /> Confirm Appointment
// // //       </h1>

// // //       <div className="mt-6 rounded-xl border border-teal-100 bg-white p-4 text-sm">
// // //         <div className="flex items-center gap-2">
// // //           <User className="h-4 w-4 text-teal-700" />
// // //           <span className="font-medium text-teal-900">{doctorName}</span>
// // //         </div>
// // //         <div className="mt-2 flex items-center gap-2">
// // //           <Calendar className="h-4 w-4 text-teal-700" />
// // //           <span>{start?.toLocaleDateString()}</span>
// // //         </div>
// // //         <div className="mt-1 flex items-center gap-2">
// // //           <Clock className="h-4 w-4 text-teal-700" />
// // //           <span>
// // //             {start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
// // //             {end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // //           </span>
// // //         </div>
// // //       </div>

// // //       <form onSubmit={submit} className="mt-6 space-y-3">
// // //         <label className="block">
// // //           <span className="block text-sm font-medium text-teal-900 mb-1">
// // //             Symptoms / reason (optional)
// // //           </span>
// // //           <textarea
// // //             rows={4}
// // //             value={reason}
// // //             onChange={(e) => setReason(e.target.value)}
// // //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
// // //             placeholder="Briefly describe your symptoms"
// // //           />
// // //         </label>

// // //         <div className="flex justify-end gap-2">
// // //           <button
// // //             type="button"
// // //             onClick={() => window.history.back()}
// // //             className="rounded-lg border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
// // //           >
// // //             Back
// // //           </button>
// // //           <button
// // //             type="submit"
// // //             disabled={loading}
// // //             className={`rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 ${
// // //               loading ? 'opacity-60 cursor-not-allowed' : ''
// // //             }`}
// // //           >
// // //             {loading ? 'Booking…' : 'Confirm Booking'}
// // //           </button>
// // //         </div>
// // //       </form>
// // //     </main>
// // //   );
// // // }

// // import React, { useEffect, useState } from 'react';
// // import { useNavigate, useSearchParams } from 'react-router-dom';
// // import { toast } from 'react-toastify';
// // import { API_BASE, useAuthHeaders, postJSON, getJSON } from '../../utils/api';
// // import { ClipboardList, User, Calendar, Clock } from 'lucide-react';

// // export default function ConfirmAppointment() {
// //   const [params] = useSearchParams();
// //   const doctorId = params.get('doctorId');
// //   const doctorName = params.get('name') || 'Doctor';
// //   const slotStart = params.get('start');
// //   const slotEnd = params.get('end');

// //   const headers = useAuthHeaders();
// //   const navigate = useNavigate();

// //   const [reason, setReason] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   // patient profile
// //   const [patientName, setPatientName] = useState('');
// //   const [patientEmail, setPatientEmail] = useState('');
// //   const [patientPhone, setPatientPhone] = useState('');

// //   const start = slotStart ? new Date(slotStart) : null;
// //   const end = slotEnd ? new Date(slotEnd) : null;

// //   useEffect(() => {
// //     let mounted = true;
// //     (async () => {
// //       try {
// //         // SINGLE, canonical endpoint
// //         const res = await getJSON(`${API_BASE}/auth/me`, headers);
// //         // normalize
// //         const payload = res?.data || res?.user || res || {};
// //         const first = payload.firstName || payload.firstname || '';
// //         const last  = payload.lastName  || payload.lastname  || '';
// //         const name  = [first, last].filter(Boolean).join(' ').trim() || payload.name || payload.fullName || '';
// //         const email = payload.email || '';
// //         const phone = payload.phone || payload.mobile || payload.contactNumber || '';
// //         if (!mounted) return;
// //         setPatientName(name || '');
// //         setPatientEmail(email || '');
// //         setPatientPhone(phone || '');
// //       } catch (_) {
// //         // leave blank; UI handles missing patient info
// //       }
// //     })();
// //     return () => { mounted = false; };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     if (!doctorId || !slotStart || !slotEnd) {
// //       toast.error('Invalid booking details');
// //       return;
// //     }
// //     setLoading(true);
// //     try {
// //       await postJSON(`${API_BASE}/api/appointments`, headers, {
// //         doctorId,
// //         slotStart,
// //         slotEnd,
// //         reason,
// //       });

// //       toast.success('Appointment confirmed');

// //       const hospital = params.get('hospital') || undefined;

// //       const search = new URLSearchParams();
// //       search.set('name', doctorName);
// //       search.set('start', slotStart);
// //       search.set('end', slotEnd);
// //       if (hospital) search.set('hospital', hospital);
// //       if (patientName)  search.set('patient', patientName);
// //       if (patientEmail) search.set('email', patientEmail);
// //       if (patientPhone) search.set('phone', patientPhone);

// //       navigate(`/appointments/confirmed?${search.toString()}`, {
// //         replace: true,
// //         state: {
// //           doctorName,
// //           start: slotStart,
// //           end: slotEnd,
// //           hospital,
// //           patientName: patientName || undefined,
// //           patientEmail: patientEmail || undefined,
// //           patientPhone: patientPhone || undefined,
// //         },
// //       });
// //     } catch (e) {
// //       toast.error(e.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <main className="max-w-xl mx-auto px-4 py-8">
// //       <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
// //         <ClipboardList className="h-6 w-6 text-teal-700" /> Confirm Appointment
// //       </h1>

// //       <div className="mt-6 rounded-xl border border-teal-100 bg-white p-4 text-sm">
// //         <div className="flex items-center gap-2">
// //           <User className="h-4 w-4 text-teal-700" />
// //           <span className="font-medium text-teal-900">{doctorName}</span>
// //         </div>
// //         <div className="mt-2 flex items-center gap-2">
// //           <Calendar className="h-4 w-4 text-teal-700" />
// //           <span>{start?.toLocaleDateString()}</span>
// //         </div>
// //         <div className="mt-1 flex items-center gap-2">
// //           <Clock className="h-4 w-4 text-teal-700" />
// //           <span>
// //             {start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
// //             {end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //           </span>
// //         </div>
// //       </div>

// //       <form onSubmit={submit} className="mt-6 space-y-3">
// //         <label className="block">
// //           <span className="block text-sm font-medium text-teal-900 mb-1">
// //             Symptoms / reason (optional)
// //           </span>
// //           <textarea
// //             rows={4}
// //             value={reason}
// //             onChange={(e) => setReason(e.target.value)}
// //             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
// //             placeholder="Briefly describe your symptoms"
// //           />
// //         </label>

// //         <div className="flex justify-end gap-2">
// //           <button
// //             type="button"
// //             onClick={() => window.history.back()}
// //             className="rounded-lg border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
// //           >
// //             Back
// //           </button>
// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className={`rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 ${
// //               loading ? 'opacity-60 cursor-not-allowed' : ''
// //             }`}
// //           >
// //             {loading ? 'Booking…' : 'Confirm Booking'}
// //           </button>
// //         </div>
// //       </form>
// //     </main>
// //   );
// // }

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { API_BASE, useAuthHeaders, postJSON, getJSON } from '../../utils/api';
// import { ClipboardList, User, Calendar, Clock } from 'lucide-react';

// export default function ConfirmAppointment() {
//   const [params] = useSearchParams();
//   const doctorId = params.get('doctorId');
//   const doctorName = params.get('name') || 'Doctor';
//   const slotStart = params.get('start');
//   const slotEnd = params.get('end');

//   const headers = useAuthHeaders();
//   const navigate = useNavigate();

//   const [reason, setReason] = useState('');
//   const [loading, setLoading] = useState(false);

//   // patient profile
//   const [patientName, setPatientName] = useState('');
//   const [patientEmail, setPatientEmail] = useState('');
//   const [patientPhone, setPatientPhone] = useState('');

//   const start = slotStart ? new Date(slotStart) : null;
//   const end = slotEnd ? new Date(slotEnd) : null;

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const res = await getJSON(`${API_BASE}/api/profile/me`, headers);
//         const payload = res?.data || res;
//         const name  = payload?.name  || '';
//         const email = payload?.email || '';
//         const phone = payload?.phone || '';
//         if (!mounted) return;
//         setPatientName(name);
//         setPatientEmail(email);
//         setPatientPhone(phone);
//       } catch {
//         // silently ignore; confirmation page handles missing info
//       }
//     })();
//     return () => { mounted = false; };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!doctorId || !slotStart || !slotEnd) {
//       toast.error('Invalid booking details');
//       return;
//     }
//     setLoading(true);
//     try {
//       await postJSON(`${API_BASE}/api/appointments`, headers, {
//         doctorId,
//         slotStart,
//         slotEnd,
//         reason,
//       });

//       toast.success('Appointment confirmed');

//       const hospital = params.get('hospital') || undefined;

//       const search = new URLSearchParams();
//       search.set('name', doctorName);
//       search.set('start', slotStart);
//       search.set('end', slotEnd);
//       if (hospital) search.set('hospital', hospital);
//       if (patientName)  search.set('patient', patientName);
//       if (patientEmail) search.set('email', patientEmail);
//       if (patientPhone) search.set('phone', patientPhone);

//       navigate(`/appointments/confirmed?${search.toString()}`, {
//         replace: true,
//         state: {
//           doctorName,
//           start: slotStart,
//           end: slotEnd,
//           hospital,
//           patientName:  patientName  || undefined,
//           patientEmail: patientEmail || undefined,
//           patientPhone: patientPhone || undefined,
//         },
//       });
//     } catch (e) {
//       toast.error(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="max-w-xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
//         <ClipboardList className="h-6 w-6 text-teal-700" /> Confirm Appointment
//       </h1>

//       <div className="mt-6 rounded-xl border border-teal-100 bg-white p-4 text-sm">
//         <div className="flex items-center gap-2">
//           <User className="h-4 w-4 text-teal-700" />
//           <span className="font-medium text-teal-900">{doctorName}</span>
//         </div>
//         <div className="mt-2 flex items-center gap-2">
//           <Calendar className="h-4 w-4 text-teal-700" />
//           <span>{start?.toLocaleDateString()}</span>
//         </div>
//         <div className="mt-1 flex items-center gap-2">
//           <Clock className="h-4 w-4 text-teal-700" />
//           <span>
//             {start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
//             {end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </span>
//         </div>
//       </div>

//       <form onSubmit={submit} className="mt-6 space-y-3">
//         <label className="block">
//           <span className="block text-sm font-medium text-teal-900 mb-1">
//             Symptoms / reason (optional)
//           </span>
//           <textarea
//             rows={4}
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
//             placeholder="Briefly describe your symptoms"
//           />
//         </label>

//         <div className="flex justify-end gap-2">
//           <button
//             type="button"
//             onClick={() => window.history.back()}
//             className="rounded-lg border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 ${
//               loading ? 'opacity-60 cursor-not-allowed' : ''
//             }`}
//           >
//             {loading ? 'Booking…' : 'Confirm Booking'}
//           </button>
//         </div>
//       </form>
//     </main>
//   );
// }
// //commit

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE, useAuthHeaders, postJSON, getJSON } from '../../utils/api';
import { ClipboardList, User, Calendar, Clock } from 'lucide-react';
import FlowStepper from '../../components/FlowStepper';

export default function ConfirmAppointment() {
  const [params] = useSearchParams();
  const doctorId = params.get('doctorId');
  const doctorName = params.get('name') || 'Doctor';
  const slotStart = params.get('start');
  const slotEnd = params.get('end');

  const headers = useAuthHeaders();
  const navigate = useNavigate();

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  const start = slotStart ? new Date(slotStart) : null;
  const end = slotEnd ? new Date(slotEnd) : null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getJSON(`${API_BASE}/api/profile/me`, headers);
        const payload = res?.data || res;
        const name  = payload?.name  || '';
        const email = payload?.email || '';
        const phone = payload?.phone || '';
        if (!mounted) return;
        setPatientName(name);
        setPatientEmail(email);
        setPatientPhone(phone);
      } catch {}
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!doctorId || !slotStart || !slotEnd) {
      toast.error('Invalid booking details');
      return;
    }
    setLoading(true);
    try {
      await postJSON(`${API_BASE}/api/appointments`, headers, {
        doctorId,
        slotStart,
        slotEnd,
        reason,
      });

      toast.success('Appointment confirmed');

      const hospital = params.get('hospital') || undefined;

      const search = new URLSearchParams();
      search.set('name', doctorName);
      search.set('start', slotStart);
      search.set('end', slotEnd);
      if (hospital) search.set('hospital', hospital);
      if (patientName)  search.set('patient', patientName);
      if (patientEmail) search.set('email', patientEmail);
      if (patientPhone) search.set('phone', patientPhone);

      navigate(`/appointments/confirmed?${search.toString()}`, {
        replace: true,
        state: {
          doctorName,
          start: slotStart,
          end: slotEnd,
          hospital,
          patientName:  patientName  || undefined,
          patientEmail: patientEmail || undefined,
          patientPhone: patientPhone || undefined,
        },
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Stepper */}
      <FlowStepper current={5} className="mb-6" />

      <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
        <ClipboardList className="h-6 w-6 text-teal-700" /> Confirm Appointment
      </h1>

      <div className="mt-6 rounded-xl border border-teal-100 bg-white p-4 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-teal-700" />
          <span className="font-medium text-teal-900">{doctorName}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-teal-700" />
          <span>{start?.toLocaleDateString()}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <Clock className="h-4 w-4 text-teal-700" />
          <span>
            {start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
            {end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <label className="block">
          <span className="block text-sm font-medium text-teal-900 mb-1">
            Symptoms / reason (optional)
          </span>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-teal-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Briefly describe your symptoms"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-lg border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Booking…' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </main>
  );
}
