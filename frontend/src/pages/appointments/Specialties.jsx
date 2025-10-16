// // src/pages/appointments/Specialties.jsx
// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { Stethoscope, ChevronRight } from 'lucide-react';
// import { API_BASE, useAuthHeaders, getJSON } from '../../utils/api';

// export default function Specialties() {
//   const headers = useAuthHeaders();
//   const [loading, setLoading] = useState(false);
//   const [specialties, setSpecialties] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const data = await getJSON(`${API_BASE}/api/appointments/specialties`, headers);
//         setSpecialties(data.specialties || []);
//       } catch (e) {
//         toast.error(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <main className="max-w-4xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
//         <Stethoscope className="h-6 w-6 text-teal-700" /> Choose a Specialty
//       </h1>

//       {loading ? (
//         <div className="mt-6 text-teal-700">Loading specialties…</div>
//       ) : (
//         <div className="mt-6 grid sm:grid-cols-2 gap-4">
//           {specialties.length === 0 && (
//             <div className="text-sm text-teal-900/70">No specialties found.</div>
//           )}
//           {specialties.map((s) => (
//             <button
//               key={s}
//               onClick={() => navigate(`/appointments/doctors?specialty=${encodeURIComponent(s)}`)}
//               className="flex items-center justify-between rounded-xl border border-teal-100 bg-white p-4 hover:shadow-sm"
//             >
//               <span className="font-medium text-teal-900">{s}</span>
//               <ChevronRight className="h-4 w-4 text-teal-700" />
//             </button>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ChevronRight } from 'lucide-react';
import { API_BASE, useAuthHeaders, getJSON } from '../../utils/api';
import FlowStepper from '../../components/FlowStepper';

export default function Specialties() {
  const headers = useAuthHeaders();
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getJSON(`${API_BASE}/api/appointments/specialties`, headers);
        setSpecialties(data.specialties || []);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Stepper */}
      <FlowStepper current={2} className="mb-6" />

      <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
        <Stethoscope className="h-6 w-6 text-teal-700" /> Choose a Specialty
      </h1>

      {loading ? (
        <div className="mt-6 text-teal-700">Loading specialties…</div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {specialties.length === 0 && (
            <div className="text-sm text-teal-900/70">No specialties found.</div>
          )}
          {specialties.map((s) => (
            <button
              key={s}
              onClick={() => navigate(`/appointments/doctors?specialty=${encodeURIComponent(s)}`)}
              className="flex items-center justify-between rounded-xl border border-teal-100 bg-white p-4 hover:shadow-sm"
            >
              <span className="font-medium text-teal-900">{s}</span>
              <ChevronRight className="h-4 w-4 text-teal-700" />
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
