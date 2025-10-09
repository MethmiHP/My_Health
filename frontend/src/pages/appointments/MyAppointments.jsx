// src/pages/appointments/MyAppointments.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE, useAuthHeaders, getJSON, postJSON } from '../../utils/api';
import { CalendarDays, X } from 'lucide-react';

export default function MyAppointments() {
  const headers = useAuthHeaders();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getJSON(`${API_BASE}/api/appointments/my`, headers);
      setList(data.appointments || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await postJSON(`${API_BASE}/api/appointments/${id}/cancel`, headers, { reason: 'User cancelled' });
      toast.success('Cancelled');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
        <CalendarDays className="h-6 w-6 text-teal-700" /> My Appointments
      </h1>

      {loading ? (
        <div className="mt-6 text-teal-700">Loading…</div>
      ) : (
        <div className="mt-6 space-y-3">
          {list.length === 0 && <div className="text-sm text-teal-900/70">No appointments yet.</div>}
          {list.map((a) => (
            <div key={a._id} className="rounded-xl border border-teal-100 bg-white p-4 text-sm">
              <div className="font-semibold text-teal-900">
                {a.doctorId?.firstName} {a.doctorId?.lastName}
              </div>
              <div className="text-teal-900/80">
                {new Date(a.slotStart).toLocaleString()} – {new Date(a.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded bg-teal-50 px-2 py-0.5 text-xs text-teal-800 border border-teal-100">
                  {a.status}
                </span>
                {a.status === 'booked' && (
                  <button
                    onClick={() => cancel(a._id)}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline ml-auto"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
