import React from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  CalendarPlus,
  CalendarDays,
  FileText,
  CreditCard,
} from "lucide-react";

export default function PatientDashboard() {
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
              <h1 className="text-2xl font-bold text-teal-900">
                Patient Dashboard
              </h1>
              <p className="text-sm text-teal-900/70">
                Book new appointments, view your bookings, and manage records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/appointments"
            className="group rounded-2xl border border-teal-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-50 p-3">
                <CalendarPlus className="h-6 w-6 text-teal-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-teal-900">
                  Book Appointment
                </h3>
                <p className="text-sm text-teal-900/70">
                  Choose a specialty and time slot.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/appointments/my"
            className="group rounded-2xl border border-teal-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-50 p-3">
                <CalendarDays className="h-6 w-6 text-teal-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-teal-900">
                  My Appointments
                </h3>
                <p className="text-sm text-teal-900/70">
                  View, refresh, and cancel upcoming bookings.
                </p>
              </div>
            </div>
          </Link>

          {/* Optional placeholders you can hook up later */}
          <div className="rounded-2xl border border-teal-100 bg-white p-6 opacity-70">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-50 p-3">
                <FileText className="h-6 w-6 text-teal-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-teal-900">
                  Records (soon)
                </h3>
                <p className="text-sm text-teal-900/70">
                  Lab reports & prescriptions.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-6 opacity-70">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-50 p-3">
                <CreditCard className="h-6 w-6 text-teal-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-teal-900">
                  Billing (soon)
                </h3>
                <p className="text-sm text-teal-900/70">
                  Invoices & payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
