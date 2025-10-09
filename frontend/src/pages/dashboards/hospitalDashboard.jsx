// src/pages/dashboards/hospitalDashboard.jsx
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  UserPlus,
  Stethoscope,
  Users,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  User,
  DollarSign,
  IdCard,
  BookOpen,
  Calendar,
  Clock,
  Building2,
  Activity,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* ----------------------- UI PRIMITIVES ----------------------- */
const CardButton = ({ icon: Icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="group rounded-2xl border border-teal-100 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
  >
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-teal-50 p-3">
        <Icon className="h-6 w-6 text-teal-700" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-teal-900">{title}</h3>
        <p className="text-sm text-teal-900/70">{desc}</p>
      </div>
    </div>
  </button>
);

const Field = ({ label, icon: Icon, className = "", ...props }) => (
  <label className={`block ${className}`}>
    <span className="block text-sm font-medium text-teal-900 mb-1">
      {label}
    </span>
    <div className="relative">
      {Icon && (
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-teal-400" />
        </span>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border border-teal-200 bg-white ${
          Icon ? "pl-10" : "pl-4"
        } pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400`}
      />
    </div>
  </label>
);

const Select = ({ label, icon: Icon, className = "", children, ...props }) => (
  <label className={`block ${className}`}>
    <span className="block text-sm font-medium text-teal-900 mb-1">
      {label}
    </span>
    <div className="relative">
      {Icon && (
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-teal-400" />
        </span>
      )}
      <select
        {...props}
        className={`w-full appearance-none rounded-xl border border-teal-200 bg-white ${
          Icon ? "pl-10" : "pl-4"
        } pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500 pointer-events-none" />
    </div>
  </label>
);

const TextArea = ({ label, className = "", ...props }) => (
  <label className={`block ${className}`}>
    <span className="block text-sm font-medium text-teal-900 mb-1">
      {label}
    </span>
    <textarea
      {...props}
      className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
    />
  </label>
);

const Checkbox = ({ label, ...props }) => (
  <label className="inline-flex items-center gap-2 text-sm text-teal-900">
    <input type="checkbox" className="accent-teal-600 h-4 w-4" {...props} />
    <span>{label}</span>
  </label>
);

// /* ----------------------- HELPERS ----------------------- */
// const useAuthHeader = () => {
//   const { token } = useAuth();
//   return useMemo(
//     () => ({
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     }),
//     [token]
//   );
// };

// async function postJSON(url, headers, body) {
//   const res = await fetch(url, {
//     method: "POST",
//     headers,
//     body: JSON.stringify(body),
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data?.message || "Request failed");
//   return data;
// }

/* ----------------------- HELPERS ----------------------- */
const useAuthHeader = () => {
    const { token } = useAuth();
  
    // strip accidental quotes if token was JSON.stringified before saving
    const clean = useMemo(
      () => (token ? String(token).replace(/^"|"$/g, "") : ""),
      [token]
    );
  
    // only include Authorization if we actually have a token
    return useMemo(
      () =>
        clean
          ? {
              "Content-Type": "application/json",
              Authorization: `Bearer ${clean}`,
            }
          : { "Content-Type": "application/json" },
      [clean]
    );
  };
  
  async function postJSON(url, headers, body) {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // this makes the error message clearer in your toast
      throw new Error(data?.message || (res.status === 401 ? "Invalid or expired token" : "Request failed"));
    }
    return data;
  }
  

/* ----------------------- DOCTOR MODAL (overlay scrolls) ----------------------- */
const CreateDoctorModal = ({ open, onClose, onCreated }) => {
  const headers = useAuthHeader();
  const [loading, setLoading] = useState(false);

  const [base, setBase] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [licenseNumber, setLicenseNumber] = useState("");
  const [specialties, setSpecialties] = useState(""); // comma-separated
  const [qualifications, setQualifications] = useState([
    { degree: "", institution: "", year: "" },
  ]);
  const [availability, setAvailability] = useState([
    { day: 1, start: "09:00", end: "12:00" },
  ]);
  const [consultationFee, setConsultationFee] = useState("");
  const [roomNo, setRoomNo] = useState("");

  const updateBase = (e) =>
    setBase((p) => ({ ...p, [e.target.name]: e.target.value }));

  const addQualification = () =>
    setQualifications((p) => [...p, { degree: "", institution: "", year: "" }]);
  const removeQualification = (idx) =>
    setQualifications((p) => p.filter((_, i) => i !== idx));
  const updateQualification = (idx, field, value) =>
    setQualifications((p) =>
      p.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );

  const addSlot = () =>
    setAvailability((p) => [...p, { day: 1, start: "09:00", end: "12:00" }]);
  const removeSlot = (idx) =>
    setAvailability((p) => p.filter((_, i) => i !== idx));
  const updateSlot = (idx, field, value) =>
    setAvailability((p) =>
      p.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );

  const submit = async (e) => {
    e.preventDefault();
    if (!base.firstName || !base.lastName || !base.email || !base.password) {
      return toast.error("Please fill required fields");
    }
    setLoading(true);
    try {
      const payload = {
        ...base,
        licenseNumber: licenseNumber || undefined,
        specialties: specialties
          ? specialties.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        qualifications: qualifications
          .filter((q) => q.degree || q.institution || q.year)
          .map((q) => ({
            degree: q.degree || undefined,
            institution: q.institution || undefined,
            year: q.year ? Number(q.year) : undefined,
          })),
        availability: availability.map((s) => ({
          day: Number(s.day),
          start: s.start,
          end: s.end,
        })),
        consultationFee: consultationFee ? Number(consultationFee) : 0,
        roomNo: roomNo || undefined,
      };

      const data = await postJSON(
        `${API}/api/hospital/users/doctor`,
        headers,
        payload
      );
      toast.success("Doctor created");
      onCreated?.(data);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // overlay scrollable, card is not
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white border border-teal-100 shadow-xl">
          <div className="p-6 border-b border-teal-100">
            <h2 className="text-xl font-bold text-teal-900">Add Doctor</h2>
            <p className="text-sm text-teal-900/70">
              Create a doctor and set qualifications & availability.
            </p>
          </div>

          <form onSubmit={submit} className="p-6 space-y-6">
            {/* Base */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name *" name="firstName" value={base.firstName} onChange={updateBase} icon={User} />
              <Field label="Last name *" name="lastName" value={base.lastName} onChange={updateBase} icon={User} />
              <Field label="Email *" name="email" type="email" value={base.email} onChange={updateBase} icon={Mail} />
              <Field label="Phone" name="phone" value={base.phone} onChange={updateBase} icon={Phone} />
              <Field label="Password *" name="password" type="password" value={base.password} onChange={updateBase} icon={Lock} />
              <Field label="SLMC License No." value={licenseNumber} onChange={(e)=>setLicenseNumber(e.target.value)} icon={IdCard} />
            </div>

            <Field
              label="Specialties (comma-separated)"
              placeholder="Cardiology, Pediatrics"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              icon={BookOpen}
            />

            {/* Qualifications */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-teal-900">Qualifications</span>
                <button type="button" onClick={addQualification} className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-800">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
              <div className="mt-2 space-y-3">
                {qualifications.map((q, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2">
                    <input
                      placeholder="Degree (e.g., MBBS)"
                      className="col-span-4 rounded-xl border border-teal-200 px-3 py-2 text-sm"
                      value={q.degree}
                      onChange={(e) => updateQualification(idx, "degree", e.target.value)}
                    />
                    <input
                      placeholder="Institution"
                      className="col-span-6 rounded-xl border border-teal-200 px-3 py-2 text-sm"
                      value={q.institution}
                      onChange={(e) => updateQualification(idx, "institution", e.target.value)}
                    />
                    <input
                      placeholder="Ye"
                      type="number"
                      className="col-span-1 rounded-xl border border-teal-200 px-3 py-2 text-sm"
                      value={q.year}
                      onChange={(e) => updateQualification(idx, "year", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeQualification(idx)}
                      className="col-span-1 inline-flex items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Availability */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-teal-900">Weekly Availability</span>
                <button type="button" onClick={addSlot} className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-800">
                  <Plus className="h-4 w-4" /> Add Slot
                </button>
              </div>
              <div className="mt-2 space-y-3">
                {availability.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2">
                    <select
                      className="col-span-4 rounded-xl border border-teal-200 px-3 py-2 text-sm"
                      value={s.day}
                      onChange={(e) => updateSlot(idx, "day", e.target.value)}
                    >
                      <option value={0}>Sunday</option>
                      <option value={1}>Monday</option>
                      <option value={2}>Tuesday</option>
                      <option value={3}>Wednesday</option>
                      <option value={4}>Thursday</option>
                      <option value={5}>Friday</option>
                      <option value={6}>Saturday</option>
                    </select>
                    <input type="time" className="col-span-3 rounded-xl border border-teal-200 px-3 py-2 text-sm" value={s.start} onChange={(e) => updateSlot(idx, "start", e.target.value)} />
                    <input type="time" className="col-span-3 rounded-xl border border-teal-200 px-3 py-2 text-sm" value={s.end} onChange={(e) => updateSlot(idx, "end", e.target.value)} />
                    <button
                      type="button"
                      onClick={() => removeSlot(idx)}
                      className="col-span-2 inline-flex items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee / Room */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Consultation Fee (LKR)" value={consultationFee} onChange={(e)=>setConsultationFee(e.target.value)} icon={DollarSign} />
              <Field label="Room No." value={roomNo} onChange={(e)=>setRoomNo(e.target.value)} icon={Building2} />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating…" : "Create Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ----------------------- PATIENT MODAL ----------------------- */
const CreatePatientModal = ({ open, onClose, onCreated }) => {
  const headers = useAuthHeader();
  const [loading, setLoading] = useState(false);

  const [base, setBase] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("other");
  const [bloodGroup, setBloodGroup] = useState("");

  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");

  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const [ec, setEc] = useState({ name: "", phone: "", relation: "" });
  const [ins, setIns] = useState({ provider: "", policyNo: "" });

  const updateBase = (e) =>
    setBase((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!base.firstName || !base.lastName || !base.email || !base.password) {
      return toast.error("Please fill required fields");
    }
    setLoading(true);
    try {
      const payload = {
        ...base,
        dob: dob ? new Date(dob) : undefined,
        gender,
        bloodGroup: bloodGroup || undefined,
        allergies: allergies
          ? allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        chronicConditions: conditions
          ? conditions.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        medications: medications
          ? medications.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        heightCm: heightCm ? Number(heightCm) : undefined,
        weightKg: weightKg ? Number(weightKg) : undefined,
        emergencyContact: ec,
        insurance: ins,
      };

      const data = await postJSON(
        `${API}/api/hospital/users/patient`,
        headers,
        payload
      );
      toast.success("Patient created");
      toast.info(`Barcode: ${data?.profile?.barcode || "generated"}`);
      onCreated?.(data);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // Patient: overlay scroll too (consistent UX)
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white border border-teal-100 shadow-xl">
          <div className="p-6 border-b border-teal-100">
            <h2 className="text-xl font-bold text-teal-900">Add Patient</h2>
            <p className="text-sm text-teal-900/70">
              Register a patient. A barcode will be generated automatically.
            </p>
          </div>

          <form onSubmit={submit} className="p-6 space-y-6">
            {/* Base */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name *" name="firstName" value={base.firstName} onChange={updateBase} icon={User} />
              <Field label="Last name *" name="lastName" value={base.lastName} onChange={updateBase} icon={User} />
              <Field label="Email *" name="email" type="email" value={base.email} onChange={updateBase} icon={Mail} />
              <Field label="Phone" name="phone" value={base.phone} onChange={updateBase} icon={Phone} />
              <Field label="Password *" name="password" type="password" value={base.password} onChange={updateBase} icon={Lock} />
              <Field label="Date of Birth" type="date" value={dob} onChange={(e)=>setDob(e.target.value)} icon={Calendar} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select label="Gender" value={gender} onChange={(e)=>setGender(e.target.value)}>
                <option value="other">Other</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
              <Field label="Blood Group" value={bloodGroup} onChange={(e)=>setBloodGroup(e.target.value)} />
              <Field label="Height (cm)" type="number" value={heightCm} onChange={(e)=>setHeightCm(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Weight (kg)" type="number" value={weightKg} onChange={(e)=>setWeightKg(e.target.value)} />
              <Field label="Allergies (comma)" value={allergies} onChange={(e)=>setAllergies(e.target.value)} />
              <Field label="Conditions (comma)" value={conditions} onChange={(e)=>setConditions(e.target.value)} />
            </div>

            <Field label="Medications (comma)" value={medications} onChange={(e)=>setMedications(e.target.value)} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextArea
                label="Emergency Contact (name / phone / relation)"
                rows={2}
                placeholder="e.g., Kamal / +94 77... / Brother"
                value={`${ec.name}${ec.name || ec.phone || ec.relation ? " / " : ""}${ec.phone}${ec.phone || ec.relation ? " / " : ""}${ec.relation}`}
                onChange={(e) => {
                  const parts = e.target.value.split("/").map((p) => p.trim());
                  setEc({
                    name: parts[0] || "",
                    phone: parts[1] || "",
                    relation: parts[2] || "",
                  });
                }}
              />
              <TextArea
                label="Insurance (provider / policyNo)"
                rows={2}
                placeholder="e.g., ABC / POL-1001"
                value={`${ins.provider}${ins.provider || ins.policyNo ? " / " : ""}${ins.policyNo}`}
                onChange={(e) => {
                  const parts = e.target.value.split("/").map((p) => p.trim());
                  setIns({
                    provider: parts[0] || "",
                    policyNo: parts[1] || "",
                  });
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating…" : "Create Patient"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ----------------------- CASHIER MODAL ----------------------- */
const CreateCashierModal = ({ open, onClose, onCreated }) => {
  const headers = useAuthHeader();
  const [loading, setLoading] = useState(false);

  const [base, setBase] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [employeeId, setEmployeeId] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [shift, setShift] = useState("morning");
  const [canRefund, setCanRefund] = useState(true);
  const [canSplit, setCanSplit] = useState(true);

  const updateBase = (e) =>
    setBase((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!base.firstName || !base.lastName || !base.email || !base.password) {
      return toast.error("Please fill required fields");
    }
    setLoading(true);
    try {
      const payload = {
        ...base,
        employeeId: employeeId || undefined,
        joinedAt: joinedAt || undefined,
        shift,
        permissions: { canRefund, canSplit },
      };

      const data = await postJSON(
        `${API}/api/hospital/users/cashier`,
        headers,
        payload
      );
      toast.success("Cashier created");
      onCreated?.(data);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white border border-teal-100 shadow-xl">
          <div className="p-6 border-b border-teal-100">
            <h2 className="text-xl font-bold text-teal-900">Add Cashier</h2>
            <p className="text-sm text-teal-900/70">
              Create a cashier and set basic employment details.
            </p>
          </div>

          <form onSubmit={submit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name *" name="firstName" value={base.firstName} onChange={updateBase} icon={User} />
              <Field label="Last name *" name="lastName" value={base.lastName} onChange={updateBase} icon={User} />
              <Field label="Email *" name="email" type="email" value={base.email} onChange={updateBase} icon={Mail} />
              <Field label="Phone" name="phone" value={base.phone} onChange={updateBase} icon={Phone} />
              <Field label="Password *" name="password" type="password" value={base.password} onChange={updateBase} icon={Lock} />
              <Field label="Employee ID" value={employeeId} onChange={(e)=>setEmployeeId(e.target.value)} icon={IdCard} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Joined At" type="date" value={joinedAt} onChange={(e)=>setJoinedAt(e.target.value)} icon={Calendar} />
              <Select label="Shift" value={shift} onChange={(e)=>setShift(e.target.value)} icon={Clock}>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
                <option value="rotational">Rotational</option>
              </Select>
              <div className="flex items-center gap-4 pt-6">
                <Checkbox label="Can refund" checked={canRefund} onChange={(e)=>setCanRefund(e.target.checked)} />
                <Checkbox label="Can split bill" checked={canSplit} onChange={(e)=>setCanSplit(e.target.checked)} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating…" : "Create Cashier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ----------------------- DASHBOARD ----------------------- */
export default function HospitalDashboard() {
  const [open, setOpen] = useState(null); // 'doctor' | 'patient' | 'cashier' | null

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-teal-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-600 p-3">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-teal-900">Hospital Dashboard</h1>
              <p className="text-sm text-teal-900/70">
                Add staff and patients to your hospital. Role-specific details are collected for each user type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardButton
            icon={UserPlus}
            title="Add Doctor"
            desc="Qualifications, specialties & availability."
            onClick={() => setOpen("doctor")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <CardButton
            icon={Users}
            title="Add Patient"
            desc="Personal & medical summary; barcode auto-generated."
            onClick={() => setOpen("patient")}
          />
          <CardButton
            icon={ShieldCheck}
            title="Add Cashier"
            desc="Employment details & permissions."
            onClick={() => setOpen("cashier")}
          />
        </div>

        {/* Helpful cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-teal-100 bg-white p-6">
            <div className="flex items-center gap-2 text-teal-700">
              <Activity className="h-5 w-5" />
              <h3 className="font-semibold">Quick Tips</h3>
            </div>
            <ul className="mt-3 text-sm text-teal-900/80 list-disc list-inside space-y-1">
              <li>Doctors can be searched by specialty when booking appointments.</li>
              <li>
                Patient barcodes are generated as{" "}
                <code>PT-&lt;HOSPITAL_CODE&gt;-&lt;user_id&gt;</code>.
              </li>
              <li>Cashier permissions control refunding and split-bill features.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-white p-6">
            <div className="flex items-center gap-2 text-teal-700">
              <Building2 className="h-5 w-5" />
              <h3 className="font-semibold">Coming Soon</h3>
            </div>
            <p className="mt-3 text-sm text-teal-900/80">
              User lists, search & filters, and bulk import from CSV.
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <CreateDoctorModal
        open={open === "doctor"}
        onClose={() => setOpen(null)}
        onCreated={() => {}}
      />
      <CreatePatientModal
        open={open === "patient"}
        onClose={() => setOpen(null)}
        onCreated={() => {}}
      />
      <CreateCashierModal
        open={open === "cashier"}
        onClose={() => setOpen(null)}
        onCreated={() => {}}
      />
    </main>
  );
}
