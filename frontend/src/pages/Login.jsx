// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, Stethoscope } from "lucide-react";
import heroImg from "../assets/hospital.jpg"; // optional background
import logo from "../assets/logo2.jpg";        // optional logo

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go if no role-specific landing is required
  const from = location.state?.from?.pathname || "/dashboard";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Role-based landing
  const goByRole = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      case "reception":
        return "/reception/dashboard";
      case "patient":
        return "/patient/dashboard";
      default:
        return from;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      if (res?.success) {
        toast.success("Welcome back!");
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(res?.message || "Invalid credentials");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-teal-50 flex items-center justify-center">
      {/* Background image overlay (optional) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 p-6 sm:p-10">
        {/* Left: Brand / Copy */}
        <div className="hidden lg:flex flex-col justify-center">
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
            Sign in to your hospital account
          </h1>
          <p className="mt-3 text-teal-900/70">
            Access appointments, electronic records, billing, and analytics across our connected hospital network.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-teal-900/80">
            <li>• <b>Hospital Admin</b>: manage staff, patients, and settings</li>
            <li>• <b>Doctors</b>: scan patient barcode/QR and update clinical notes</li>
            <li>• <b>Reception</b>: register patients and manage scheduling</li>
            <li>• <b>Cashier</b>: process cash/card/insurance & split bills</li>
            <li>• <b>Patients</b>: view history (read-only) and manage appointments</li>
          </ul>
        </div>

        {/* Right: Card with form */}
        <div className="w-full">
          <div className="rounded-3xl bg-white/90 border border-teal-100 shadow-lg p-6 sm:p-8">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-teal-900">Welcome back</h2>
              <p className="text-sm text-teal-900/70">Use the credentials provided by your hospital admin</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-teal-900 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-teal-400" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full rounded-xl border border-teal-200 bg-white px-10 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    placeholder="you@hospital.lk"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-teal-900 mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-teal-400" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={onChange}
                    className="w-full rounded-xl border border-teal-200 bg-white px-10 pr-12 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-500 hover:text-teal-700"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm font-medium text-teal-700 hover:text-teal-800">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl bg-teal-600 text-white py-3 text-sm font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="inline-flex items-center">
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-teal-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white/90 px-2 text-xs text-teal-700">New to SmartCare?</span>
                </div>
              </div>

              {/* Hospital onboarding (only hospitals self-register) */}
              <div className="mt-4 grid grid-cols-1 gap-3">
                <Link
                  to="/onboard-hospital"
                  className="inline-flex items-center justify-center rounded-xl border border-teal-300 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"
                >
                  Onboard Your Hospital
                </Link>
              </div>

              {/* Info for staff/patients */}
              <div className="mt-3 text-center text-xs text-teal-900/80">
                Staff & Patients are created by the hospital admin.{" "}
                <Link to="/help/access" className="underline hover:opacity-80">
                  Need access?
                </Link>
              </div>
            </div>
          </div>

          {/* Small footer note */}
          <p className="mt-4 text-xs text-center text-teal-900/60">
            © {new Date().getFullYear()} SmartCare Hospitals. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
