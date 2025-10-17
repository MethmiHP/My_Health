// src/pages/appointments/MyAppointments.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE, useAuthHeaders, getJSON, postJSON } from '../../utils/api';
import { CalendarDays, X, Pencil, Check, XCircle } from 'lucide-react';
import stethoscopeBg from '../../assets/steth.jpg';

export default function MyAppointments() {
  const headers = useAuthHeaders();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  // inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editReason, setEditReason] = useState('');
  const [saving, setSaving] = useState(false);

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

  const startEdit = (a) => {
    setEditingId(a._id);
    setEditReason(a.reason || '');
  };

  const abortEdit = () => {
    setEditingId(null);
    setEditReason('');
  };

  const saveReason = async (id) => {
    const payload = { reason: editReason.trim() };
    if (!payload.reason) {
      toast.error('Please enter a reason');
      return;
    }
    setSaving(true);
    try {
      // PATCH /api/appointments/:id/reason
      const res = await fetch(`${API_BASE}/api/appointments/${id}/reason`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: editReason.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update');
      }
      toast.success('Reason updated');
      setEditingId(null);
      setEditReason('');
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
    {/* Background Image - keep under navbar */}
    <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${stethoscopeBg})`,
          opacity: 0.75,
          zIndex: -1
        }}
        aria-hidden="true"
      />
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
        <CalendarDays className="h-6 w-6 text-teal-700" /> My Appointments
      </h1>

      {loading ? (
        <div className="mt-6 text-teal-700">Loading…</div>
      ) : (
        <div className="mt-6 space-y-3">
          {list.length === 0 && <div className="text-sm text-teal-900/70">No appointments yet.</div>}

          {list.map((a) => {
            const isEditing = editingId === a._id;
            const canEdit = a.status === 'booked'; // only allow when booked

            return (
              <div key={a._id} className="rounded-xl border border-teal-100 bg-white p-4 text-sm">
                <div className="font-semibold text-teal-900">
                  {a.doctorId?.firstName} {a.doctorId?.lastName}
                </div>

                <div className="text-teal-900/80">
                  {new Date(a.slotStart).toLocaleString()} –{' '}
                  {new Date(a.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                {/* reason row */}
                <div className="mt-2">
                  <div className="text-teal-900/80">
                    <span className="font-medium text-teal-900">Reason:</span>{' '}
                    {!isEditing ? (a.reason || '—') : null}
                  </div>

                  {isEditing ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        className="flex-1 rounded-xl border border-teal-200 px-3 py-2 focus:ring-2 focus:ring-teal-400"
                        placeholder="Enter reason / disease"
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                      />
                      <button
                        disabled={saving}
                        onClick={() => saveReason(a._id)}
                        className="rounded-xl bg-teal-600 text-white px-3 py-2 hover:bg-teal-700 disabled:opacity-60 inline-flex items-center gap-1"
                        title="Save"
                      >
                        <Check className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        disabled={saving}
                        onClick={abortEdit}
                        className="rounded-xl border border-teal-200 px-3 py-2 text-teal-800 hover:bg-teal-50 inline-flex items-center gap-1"
                        title="Cancel"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded bg-teal-50 px-2 py-0.5 text-xs text-teal-800 border border-teal-100">
                    {a.status}
                  </span>

                  {canEdit && !isEditing && (
                    <button
                      onClick={() => startEdit(a)}
                      className="inline-flex items-center gap-1 text-xs text-teal-700 hover:underline"
                      title="Edit reason"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit reason
                    </button>
                  )}

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
            );
          })}
        </div>
      )}
    </main>
    </div>
  );
}
