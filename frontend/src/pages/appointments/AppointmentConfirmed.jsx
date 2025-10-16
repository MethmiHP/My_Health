// // // src/pages/appointments/AppointmentConfirmed.jsx
// // import React from "react";
// // import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
// // import { CheckCircle2, Calendar, Clock, User, Home, Mail, Phone } from "lucide-react";

// // /**
// //  * Reads details primarily from navigation state (preferred),
// //  * and falls back to URL query params so it works if user reloads.
// //  *
// //  * Expected state/params:
// //  * - doctorName (string)
// //  * - start (ISO string)
// //  * - end (ISO string)
// //  * - hospital (optional string)
// //  * - patientName (optional string)
// //  * - patientEmail (optional string)
// //  * - patientPhone (optional string)
// //  */
// // export default function AppointmentConfirmed() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [params] = useSearchParams();

// //   const state = location.state || {};
// //   const doctorName = state.doctorName || params.get("name") || "Doctor";
// //   const startISO = state.start || params.get("start");
// //   const endISO = state.end || params.get("end");
// //   const hospital = state.hospital || params.get("hospital") || null;

// //   const patientName  = state.patientName  || params.get("patient") || "";
// //   const patientEmail = state.patientEmail || params.get("email")   || "";
// //   const patientPhone = state.patientPhone || params.get("phone")   || "";

// //   const hasPatientInfo = Boolean(
// //         (patientName && patientName.trim().length > 0) ||
// //         (patientEmail && patientEmail.trim().length > 0) ||
// //         (patientPhone && patientPhone.trim().length > 0)
// //       );

// //   const start = startISO ? new Date(startISO) : null;
// //   const end = endISO ? new Date(endISO) : null;

// //   const formatDate = (d) =>
// //     d?.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) || "-";
// //   const formatTime = (d) =>
// //     d?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "-";

// //   // If we somehow got here without required info, offer a friendly escape.
// //   const missingCore = !start || !end || !doctorName;

// //   return (
// //     <main className="max-w-4xl mx-auto px-4 py-10">
// //       {/* Progress / Stepper */}
// //       <div className="mb-6 hidden md:block">
// //         <div className="flex items-center justify-between text-sm text-teal-800">
// //           {["Start", "Choose Specialty", "Doctor Availability", "Select Slot", "Patient Details", "Confirmation"]
// //             .map((label, idx, arr) => {
// //               const isActive = idx === arr.length - 1;
// //               return (
// //                 <div key={label} className="flex-1 flex items-center">
// //                   <div
// //                     className={`h-8 px-3 rounded-full border ${
// //                       isActive
// //                         ? "bg-teal-600 text-white border-teal-600"
// //                         : "bg-white text-teal-800 border-teal-300"
// //                     } flex items-center justify-center`}
// //                   >
// //                     {idx + 1}. {label}
// //                   </div>
// //                   {idx < arr.length - 1 && (
// //                     <div className="h-[2px] flex-1 bg-teal-200 mx-2" />
// //                   )}
// //                 </div>
// //               );
// //             })}
// //         </div>
// //       </div>

// //       {/* Header */}
// //       <div className="mb-4">
// //         <button
// //           onClick={() => navigate(-1)}
// //           className="text-teal-700 hover:text-teal-800 text-sm font-medium"
// //         >
// //           ← Back
// //         </button>
// //       </div>

// //       {/* Confirmation Card */}
// //       <section className="rounded-2xl border border-teal-100 bg-white shadow-sm">
// //         <div className="p-6 md:p-8">
// //           <div className="flex items-center gap-3">
// //             <CheckCircle2 className="h-7 w-7 text-teal-600" />
// //             <h1 className="text-2xl md:text-3xl font-bold text-teal-900">
// //               Appointment Confirmed!
// //             </h1>
// //           </div>

// //           <p className="mt-2 text-teal-800">
// //             Your appointment has been confirmed.
// //           </p>

// //           {/* Appointment Summary Card */}
// //           <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/40 p-5">
// //             <div className="flex flex-col gap-3">
// //               <div className="flex items-center gap-2">
// //                 <User className="h-5 w-5 text-teal-700" />
// //                 <div className="text-teal-900 font-semibold">
// //                   Dr. {doctorName}
// //                 </div>
// //               </div>

// //               {hospital && (
// //                 <div className="pl-[28px] text-sm text-teal-800 -mt-2">
// //                   {hospital}
// //                 </div>
// //               )}

// //               <div className="flex items-center gap-2">
// //                 <Calendar className="h-5 w-5 text-teal-700" />
// //                 <div className="text-teal-900">{formatDate(start)}</div>
// //               </div>

// //               <div className="flex items-center gap-2">
// //                 <Clock className="h-5 w-5 text-teal-700" />
// //                 <div className="text-teal-900">
// //                   {formatTime(start)} – {formatTime(end)}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Patient Information (optional) */}
// //           {hasPatientInfo && (
// //             <div className="mt-6">
// //               <h2 className="text-teal-900 font-semibold">Patient Information</h2>
// //               <div className="mt-3 rounded-2xl border border-teal-100 p-4">
// //               {patientName && (
// //                   <div className="text-teal-900 font-medium">{patientName}</div>
// //                 )}
// //                 <div className="mt-1 flex flex-col gap-1 text-sm text-teal-800">
// //                 {patientEmail && patientEmail.trim().length > 0 && (
// //                     <div className="flex items-center gap-2">
// //                       <Mail className="h-4 w-4 text-teal-700" />
// //                       <span>{patientEmail}</span>
// //                     </div>
// //                   )}
// //                   {patientPhone && patientPhone.trim().length > 0 && (
// //                     <div className="flex items-center gap-2">
// //                       <Phone className="h-4 w-4 text-teal-700" />
// //                       <span>{patientPhone}</span>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Success notice */}
// //           <div className="mt-6 rounded-xl bg-teal-50 border border-teal-100 p-4 text-teal-900">
// //             A confirmation email has been sent with your appointment details.
// //           </div>

// //           {/* Actions */}
// //           <div className="mt-8 flex flex-col sm:flex-row gap-3">
// //             <Link
// //               to="/"
// //               className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200 px-4 py-2 font-semibold text-teal-800 hover:bg-teal-50"
// //             >
// //               <Home className="h-4 w-4" />
// //               Return to Home
// //             </Link>
// //             <Link
// //               to="/appointments/my"
// //               className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700"
// //             >
// //               View My Appointments
// //             </Link>
// //           </div>

// //           {/* Fallback if core data missing */}
// //           {missingCore && (
// //             <p className="mt-6 text-sm text-teal-800">
// //               We couldn’t load some appointment details. You can still{" "}
// //               <Link to="/appointments/my" className="underline text-teal-700">
// //                 view your appointments
// //               </Link>{" "}
// //               or go back.
// //             </p>
// //           )}
// //         </div>
// //       </section>
// //     </main>
// //   );
// // }

// //AppointmentConfirmed.jsx
// import React from "react";
// import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
// import { CheckCircle2, Calendar, Clock, User, Home, Mail, Phone } from "lucide-react";

// export default function AppointmentConfirmed() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [params] = useSearchParams();

//   const state = location.state || {};
//   const doctorName = state.doctorName || params.get("name") || "Doctor";
//   const startISO   = state.start      || params.get("start");
//   const endISO     = state.end        || params.get("end");
//   const hospital   = state.hospital   || params.get("hospital") || null;

//   // empty-string fallbacks so our has-info check works consistently
//   const patientName  = state.patientName  || params.get("patient") || "";
//   const patientEmail = state.patientEmail || params.get("email")   || "";
//   const patientPhone = state.patientPhone || params.get("phone")   || "";

//   const hasPatientInfo = Boolean(
//     (patientName && patientName.trim().length > 0) ||
//     (patientEmail && patientEmail.trim().length > 0) ||
//     (patientPhone && patientPhone.trim().length > 0)
//   );

//   const start = startISO ? new Date(startISO) : null;
//   const end   = endISO   ? new Date(endISO)   : null;

//   const formatDate = (d) =>
//     d?.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) || "-";
//   const formatTime = (d) =>
//     d?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "-";

//   const missingCore = !start || !end || !doctorName;

//   return (
//     <main className="max-w-4xl mx-auto px-4 py-10">
//       {/* Stepper */}
//       <div className="mb-6 hidden md:block">
//         <div className="flex items-center justify-between text-sm text-teal-800">
//           {["Start", "Choose Specialty", "Doctor Availability", "Select Slot", "Patient Details", "Confirmation"]
//             .map((label, idx, arr) => {
//               const isActive = idx === arr.length - 1;
//               return (
//                 <div key={label} className="flex-1 flex items-center">
//                   <div
//                     className={`h-8 px-3 rounded-full border ${
//                       isActive ? "bg-teal-600 text-white border-teal-600"
//                                : "bg-white text-teal-800 border-teal-300"
//                     } flex items-center justify-center`}
//                   >
//                     {idx + 1}. {label}
//                   </div>
//                   {idx < arr.length - 1 && <div className="h-[2px] flex-1 bg-teal-200 mx-2" />}
//                 </div>
//               );
//             })}
//         </div>
//       </div>

//       {/* Back */}
//       <div className="mb-4">
//         <button
//           onClick={() => navigate(-1)}
//           className="text-teal-700 hover:text-teal-800 text-sm font-medium"
//         >
//           ← Back
//         </button>
//       </div>

//       {/* Card */}
//       <section className="rounded-2xl border border-teal-100 bg-white shadow-sm">
//         <div className="p-6 md:p-8">
//           <div className="flex items-center gap-3">
//             <CheckCircle2 className="h-7 w-7 text-teal-600" />
//             <h1 className="text-2xl md:text-3xl font-bold text-teal-900">
//               Appointment Confirmed!
//             </h1>
//           </div>

//           <p className="mt-2 text-teal-800">Your appointment has been confirmed.</p>

//           {/* Summary */}
//           <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/40 p-5">
//             <div className="flex flex-col gap-3">
//               <div className="flex items-center gap-2">
//                 <User className="h-5 w-5 text-teal-700" />
//                 <div className="text-teal-900 font-semibold">
//                   Dr. {doctorName}
//                 </div>
//               </div>

//               {hospital && (
//                 <div className="pl-[28px] text-sm text-teal-800 -mt-2">
//                   {hospital}
//                 </div>
//               )}

//               <div className="flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-teal-700" />
//                 <div className="text-teal-900">{formatDate(start)}</div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-teal-700" />
//                 <div className="text-teal-900">
//                   {formatTime(start)} – {formatTime(end)}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Patient Info */}
//           {hasPatientInfo && (
//             <div className="mt-6">
//               <h2 className="text-teal-900 font-semibold">Patient Information</h2>
//               <div className="mt-3 rounded-2xl border border-teal-100 p-4">
//                 {patientName && <div className="text-teal-900 font-medium">{patientName}</div>}
//                 <div className="mt-1 flex flex-col gap-1 text-sm text-teal-800">
//                   {patientEmail && patientEmail.trim().length > 0 && (
//                     <div className="flex items-center gap-2">
//                       <Mail className="h-4 w-4 text-teal-700" />
//                       <span>{patientEmail}</span>
//                     </div>
//                   )}
//                   {patientPhone && patientPhone.trim().length > 0 && (
//                     <div className="flex items-center gap-2">
//                       <Phone className="h-4 w-4 text-teal-700" />
//                       <span>{patientPhone}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Notice */}
//           <div className="mt-6 rounded-xl bg-teal-50 border border-teal-100 p-4 text-teal-900">
//             A confirmation email has been sent with your appointment details.
//           </div>

//           {/* Actions */}
//           <div className="mt-8 flex flex-col sm:flex-row gap-3">
//             <Link
//               to="/"
//               className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200 px-4 py-2 font-semibold text-teal-800 hover:bg-teal-50"
//             >
//               <Home className="h-4 w-4" />
//               Return to Home
//             </Link>
//             <Link
//               to="/appointments/my"
//               className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700"
//             >
//               View My Appointments
//             </Link>
//           </div>

//           {/* Fallback */}
//           {missingCore && (
//             <p className="mt-6 text-sm text-teal-800">
//               We couldn’t load some appointment details. You can still{" "}
//               <Link to="/appointments/my" className="underline text-teal-700">
//                 view your appointments
//               </Link>{" "}
//               or go back.
//             </p>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }
// //commit

import React from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Calendar, Clock, User, Home, Mail, Phone } from "lucide-react";
import FlowStepper from "../../components/FlowStepper";

export default function AppointmentConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const state = location.state || {};
  const doctorName = state.doctorName || params.get("name") || "Doctor";
  const startISO   = state.start      || params.get("start");
  const endISO     = state.end        || params.get("end");
  const hospital   = state.hospital   || params.get("hospital") || null;

  const patientName  = state.patientName  || params.get("patient") || "";
  const patientEmail = state.patientEmail || params.get("email")   || "";
  const patientPhone = state.patientPhone || params.get("phone")   || "";

  const hasPatientInfo = Boolean(
    (patientName && patientName.trim().length > 0) ||
    (patientEmail && patientEmail.trim().length > 0) ||
    (patientPhone && patientPhone.trim().length > 0)
  );

  const start = startISO ? new Date(startISO) : null;
  const end   = endISO   ? new Date(endISO)   : null;

  const formatDate = (d) =>
    d?.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) || "-";
  const formatTime = (d) =>
    d?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "-";

  const missingCore = !start || !end || !doctorName;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Stepper */}
      <FlowStepper current={6} className="mb-6" />

      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-teal-700 hover:text-teal-800 text-sm font-medium"
        >
          ← Back
        </button>
      </div>

      <section className="max-w-2xl mx-auto rounded-2xl border border-teal-100 bg-white shadow-sm">
        <div className="p-6 md:p-8">
        <div className="flex items-center justify-center gap-3 text-center">
            <CheckCircle2 className="h-7 w-7 text-teal-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-teal-900">
              Appointment Confirmed!
            </h1>
          </div>

          <p className="mt-2 text-teal-800 text-center">Your appointment has been confirmed.</p>

          <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/40 p-5 text-center">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-teal-700" />
                <div className="text-teal-900 font-semibold">
                  Dr. {doctorName}
                </div>
              </div>

              {hospital && (
                <div className="pl-[28px] text-sm text-teal-800 -mt-2">
                  {hospital}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-700" />
                <div className="text-teal-900">{formatDate(start)}</div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-700" />
                <div className="text-teal-900">
                  {formatTime(start)} – {formatTime(end)}
                </div>
              </div>
            </div>
          </div>

          {hasPatientInfo && (
            <div className="mt-6">
              <h2 className="text-teal-900 font-bold text-center">Patient Information</h2>
              <div className="mt-3 rounded-2xl border border-teal-100 p-4 text-center">
                {patientName && <div className="text-teal-900 font-medium">{patientName}</div>}
                <div className="mt-1 flex flex-col gap-1 text-sm text-teal-800">
                  {patientEmail && patientEmail.trim().length > 0 && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-teal-700" />
                      <span>{patientEmail}</span>
                    </div>
                  )}
                  {patientPhone && patientPhone.trim().length > 0 && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-teal-700" />
                      <span>{patientPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl bg-teal-50 border border-teal-100 p-4 text-teal-900 text-center">
            A confirmation email has been sent with your appointment details.
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200 px-4 py-2 font-semibold text-teal-800 hover:bg-teal-50"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Link>
            <Link
              to="/appointments/my"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700"
            >
              View My Appointments
            </Link>
          </div>

          {missingCore && (
            <p className="mt-6 text-sm text-teal-800">
              We couldn’t load some appointment details. You can still{" "}
              <Link to="/appointments/my" className="underline text-teal-700">
                view your appointments
              </Link>{" "}
              or go back.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
