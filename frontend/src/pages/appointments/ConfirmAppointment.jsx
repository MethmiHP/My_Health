// src/pages/appointments/ConfirmAppointment.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE, useAuthHeaders, postJSON } from '../../utils/api';
import { ClipboardList, User, Calendar, Clock } from 'lucide-react';

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

  const start = slotStart ? new Date(slotStart) : null;
  const end = slotEnd ? new Date(slotEnd) : null;

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
      navigate('/appointments/my', { replace: true });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
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
          <span className="block text-sm font-medium text-teal-900 mb-1">Symptoms / reason (optional)</span>
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
