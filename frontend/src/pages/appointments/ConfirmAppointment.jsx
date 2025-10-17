import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE, useAuthHeaders, postJSON, getJSON } from '../../utils/api';
import { ClipboardList, User, Calendar, Clock } from 'lucide-react';
import FlowStepper from '../../components/FlowStepper';
import stethoscopeBg from '../../assets/steth.jpg';

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
    <div className="min-h-screen">
      {/* Background Image - positioned to not cover navbar */}
      <div 
        className="fixed top-16 left-0 right-0 bottom-0 bg-cover bg-center bg-no-repeat opacity-75"
        style={{ backgroundImage: `url(${stethoscopeBg})` }}
        aria-hidden="true"
      />
      {/* Main content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 py-8">
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

      <form onSubmit={submit} className="mt-6 space-y-3 bg-white/90 backdrop-blur-sm rounded-xl border border-teal-100 p-6">
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
    </div>
  );
}
