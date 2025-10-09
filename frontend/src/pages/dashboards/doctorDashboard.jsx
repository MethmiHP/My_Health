// src/pages/dashboards/DoctorAppointments.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE, useAuthHeaders, getJSON } from '../../utils/api';
import { Calendar, Users } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DoctorAppointments() {
  const headers = useAuthHeaders();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

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

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
          <Users className="h-6 w-6 text-teal-700" /> My Appointments
        </h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-teal-700" />
          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            className="rounded-lg border border-teal-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-6 text-teal-700">Loading…</div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-teal-100 bg-white">
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
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-teal-900/60">
                    No appointments for this date.
                  </td>
                </tr>
              )}
              {list.map((a) => (
                <tr key={a._id} className="border-t border-teal-50">
                  <td className="px-4 py-3">
                    {new Date(a.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(a.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    {a.patientId?.firstName} {a.patientId?.lastName}
                  </td>
                  <td className="px-4 py-3 capitalize">{a.status}</td>
                  <td className="px-4 py-3">{a.reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
