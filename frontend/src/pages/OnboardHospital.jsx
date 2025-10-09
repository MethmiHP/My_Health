// src/pages/OnboardHospital.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import heroImg from "../assets/hospital.jpg";
import logo from "../assets/logo2.jpg";

const OnboardHospital = () => {
  const navigate = useNavigate();

  const [hospital, setHospital] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
  });

  const [admin, setAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // Uses your .env — restart Vite after editing .env
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const validate = () => {
    if (!hospital.name || !hospital.code) return "Hospital name and code are required.";
    if (!/^[A-Z0-9-]{2,10}$/.test(hospital.code))
      return "Hospital code must be 2-10 characters (A-Z, 0-9, -).";
    if (!admin.firstName || !admin.lastName) return "Admin first and last name are required.";
    if (!admin.email || !/^\S+@\S+\.\S+$/.test(admin.email)) return "A valid admin email is required.";
    if (admin.password.length < 8) return "Password must be at least 8 characters.";
    if (admin.password !== admin.confirmPassword) return "Passwords do not match.";
    if (!agree) return "Please confirm you’re authorized to onboard this hospital.";
    return null;
  };

  const onChangeHospital = (e) => {
    const { name, value } = e.target;
    setHospital((p) => ({ ...p, [name]: name === "code" ? value.toUpperCase() : value }));
  };
  const onChangeAdmin = (e) => {
    const { name, value } = e.target;
    setAdmin((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/hospital/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospital, admin }),
      });

      let data = {};
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        return toast.error(data?.message || "Registration failed");
      }

      toast.success("Hospital onboarded successfully. Please sign in.");
      navigate("/login", { replace: true });
    } catch (e2) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-teal-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 p-6 sm:p-10">
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-center">
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt="SmartCare" className="h-10 w-auto" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-teal-600 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
            )}
            <span className="text-2xl font-semibold text-teal-800">SmartCare</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold text-teal-900 leading-tight">
            Onboard your hospital
          </h1>
          <p className="mt-3 text-teal-900/70">
            Create your hospital in SmartCare. The first account becomes the <b>Hospital Admin</b> — you can add
            doctors, reception, cashier, and patients afterward.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-teal-900/80">
            <li>• Unique hospital code (e.g., <b>CGH</b>, <b>NCGH-01</b>)</li>
            <li>• Admin gets full access to manage users & settings</li>
            <li>• Patients & staff are created by the hospital admin</li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <form onSubmit={onSubmit} className="rounded-3xl bg-white/90 border border-teal-100 shadow-lg p-6 sm:p-8 space-y-7">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-teal-700" />
              <h2 className="text-xl font-bold text-teal-900">Hospital details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-teal-900 mb-1">Hospital name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={hospital.name}
                  onChange={onChangeHospital}
                  placeholder="Central General Hospital"
                  className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Hospital code *</label>
                <input
                  type="text"
                  name="code"
                  required
                  value={hospital.code}
                  onChange={onChangeHospital}
                  placeholder="CGH"
                  maxLength={10}
                  className="uppercase w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                />
                <p className="mt-1 text-xs text-teal-900/60">2–10 chars (A–Z, 0–9, dash)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Contact email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-teal-400" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={hospital.email}
                    onChange={onChangeHospital}
                    placeholder="contact@cgh.lk"
                    className="w-full rounded-xl border border-teal-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Phone</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-teal-400" />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={hospital.phone}
                    onChange={onChangeHospital}
                    placeholder="+94 11 123 4567"
                    className="w-full rounded-xl border border-teal-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-teal-900 mb-1">Address</label>
                <div className="relative">
                  <span className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-teal-400" />
                  </span>
                  <textarea
                    name="address"
                    rows={2}
                    value={hospital.address}
                    onChange={onChangeHospital}
                    placeholder="123 Lake Rd, Colombo"
                    className="w-full rounded-xl border border-teal-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>
              </div>
            </div>

            <hr className="border-teal-100" />

            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-teal-700" />
              <h2 className="text-xl font-bold text-teal-900">Hospital Admin</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">First name *</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={admin.firstName}
                  onChange={onChangeAdmin}
                  placeholder="Nimali"
                  className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Last name *</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={admin.lastName}
                  onChange={onChangeAdmin}
                  placeholder="Perera"
                  className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-teal-900 mb-1">Admin email *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-teal-400" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={admin.email}
                    onChange={onChangeAdmin}
                    placeholder="admin@cgh.lk"
                    autoComplete="email"
                    className="w-full rounded-xl border border-teal-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Phone</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-teal-400" />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={admin.phone}
                    onChange={onChangeAdmin}
                    placeholder="+94 71 123 4567"
                    className="w-full rounded-xl border border-teal-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Password *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-teal-400" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    required
                    value={admin.password}
                    onChange={onChangeAdmin}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-teal-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Confirm password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={admin.confirmPassword}
                  onChange={onChangeAdmin}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-teal-900/90 select-none cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 accent-teal-600"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span className="flex-1">
                <span className="inline-flex items-center gap-1 font-medium">
                  <ShieldCheck className="h-4 w-4 text-teal-700" />
                  I confirm I am authorized to onboard this hospital.
                </span>
                <br />
                <span className="text-teal-900/60">
                  This will create a Hospital Admin account with full privileges for the selected hospital.
                </span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !agree}
              className={`w-full rounded-xl bg-teal-600 text-white py-3 text-sm font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                loading || !agree ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating hospital…
                </span>
              ) : (
                "Create hospital"
              )}
            </button>

            <p className="text-center text-sm text-teal-900/70">
              Already onboarded?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-teal-700 font-medium hover:text-teal-800 underline"
              >
                Sign in
              </button>
            </p>
          </form>

          <p className="mt-4 text-xs text-center text-teal-900/60">
            © {new Date().getFullYear()} SmartCare Hospitals. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardHospital;

