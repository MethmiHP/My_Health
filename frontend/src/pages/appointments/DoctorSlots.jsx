// src/pages/appointments/DoctorSlots.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE, useAuthHeaders, getJSON } from '../../utils/api';
import { CalendarDays, Clock } from 'lucide-react';

const addDaysISO = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0,10);
};

export default function DoctorSlots() {
  const { doctorId } = useParams();
  const [params] = useSearchParams();
  const doctorName = params.get('name') || 'Doctor';
  const headers = useAuthHeaders();
  const navigate = useNavigate();

  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(() => new Date().toISOString().slice(0,10));
  const to = useMemo(() => addDaysISO(from, 7), [from]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getJSON(
          `${API_BASE}/api/appointments/slots?doctorId=${doctorId}&from=${from}&to=${to}&slotMinutes=15`,
          headers
        );
        setDays(data.days || []);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [doctorId, from, to]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-teal-700" /> {doctorName} – Available Slots
        </h1>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-teal-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-6 text-teal-700">Loading slots…</div>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {days.map((d) => (
            <div key={d.date} className="rounded-xl border border-teal-100 bg-white p-4">
              <div className="font-semibold text-teal-900">{d.date}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {d.slots.length === 0 && (
                  <div className="text-xs text-teal-900/60">No slots</div>
                )}
                {d.slots.map((s) => {
                  const start = new Date(s.start);
                  const end = new Date(s.end);
                  const label = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                  return (
                    <button
                      key={s.start}
                      onClick={() =>
                        navigate(
                          `/appointments/confirm?doctorId=${doctorId}&name=${encodeURIComponent(doctorName)}&start=${encodeURIComponent(new Date(s.start).toISOString())}&end=${encodeURIComponent(new Date(s.end).toISOString())}`
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-teal-200 px-3 py-2 text-xs hover:bg-teal-50"
                    >
                      <Clock className="h-3.5 w-3.5 text-teal-700" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
