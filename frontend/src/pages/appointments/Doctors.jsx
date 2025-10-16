// // src/pages/appointments/Doctors.jsx
// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { User, Building2, DollarSign, Calendar } from 'lucide-react';
// import { API_BASE, useAuthHeaders, getJSON } from '../../utils/api';

// export default function Doctors() {
//   const headers = useAuthHeaders();
//   const [params] = useSearchParams();
//   const [loading, setLoading] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const spec = params.get('specialty') || '';
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!spec) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const data = await getJSON(`${API_BASE}/api/appointments/doctors?specialty=${encodeURIComponent(spec)}`, headers);
//         setDoctors(data.doctors || []);
//       } catch (e) {
//         toast.error(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [spec]);

//   return (
//     <main className="max-w-4xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
//         <Calendar className="h-6 w-6 text-teal-700" /> {spec || 'Doctors'}
//       </h1>

//       {loading ? (
//         <div className="mt-6 text-teal-700">Loading doctors…</div>
//       ) : (
//         <div className="mt-6 space-y-3">
//           {doctors.length === 0 && (
//             <div className="text-sm text-teal-900/70">No doctors found.</div>
//           )}
//           {doctors.map((d) => (
//             <div key={d.doctorId} className="rounded-xl border border-teal-100 bg-white p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="rounded-xl bg-teal-50 p-3">
//                     <User className="h-5 w-5 text-teal-700" />
//                   </div>
//                   <div>
//                     <div className="font-semibold text-teal-900">{d.name}</div>
//                     <div className="text-xs text-teal-900/70 flex items-center gap-2">
//                       <Building2 className="h-3.5 w-3.5" /> Room {d.roomNo || '-'}
//                       <span className="inline-flex items-center gap-1 ml-3">
//                         <DollarSign className="h-3.5 w-3.5" /> {Number(d.fee || 0).toLocaleString()} LKR
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => navigate(`/appointments/doctor/${d.doctorId}?name=${encodeURIComponent(d.name)}`)}
//                   className="rounded-lg bg-teal-600 px-3 py-2 text-white text-sm font-semibold hover:bg-teal-700"
//                 >
//                   View Slots
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Building2, DollarSign, Calendar } from 'lucide-react';
import { API_BASE, useAuthHeaders, getJSON } from '../../utils/api';
import FlowStepper from '../../components/FlowStepper';

export default function Doctors() {
  const headers = useAuthHeaders();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const spec = params.get('specialty') || '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!spec) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getJSON(`${API_BASE}/api/appointments/doctors?specialty=${encodeURIComponent(spec)}`, headers);
        setDoctors(data.doctors || []);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [spec]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Stepper */}
      <FlowStepper current={3} className="mb-6" />

      <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
        <Calendar className="h-6 w-6 text-teal-700" /> {spec || 'Doctors'}
      </h1>

      {loading ? (
        <div className="mt-6 text-teal-700">Loading doctors…</div>
      ) : (
        <div className="mt-6 space-y-3">
          {doctors.length === 0 && (
            <div className="text-sm text-teal-900/70">No doctors found.</div>
          )}
          {doctors.map((d) => (
            <div key={d.doctorId} className="rounded-xl border border-teal-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-teal-50 p-3">
                    <User className="h-5 w-5 text-teal-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-teal-900">{d.name}</div>
                    <div className="text-xs text-teal-900/70 flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5" /> Room {d.roomNo || '-'}
                      <span className="inline-flex items-center gap-1 ml-3">
                        <DollarSign className="h-3.5 w-3.5" /> {Number(d.fee || 0).toLocaleString()} LKR
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/appointments/doctor/${d.doctorId}?name=${encodeURIComponent(d.name)}`)}
                  className="rounded-lg bg-teal-600 px-3 py-2 text-white text-sm font-semibold hover:bg-teal-700"
                >
                  View Slots
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

