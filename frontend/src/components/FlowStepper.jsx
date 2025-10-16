// // // src/components/FlowStepper.jsx
// // import React from "react";

// // /**
// //  * Circle stepper for the appointment flow.
// //  * - current: 1-based active step index
// //  * - steps: optional array of labels (defaults to 6 standard labels)
// //  *
// //  * Styling keeps your teal palette.
// //  */
// // export default function FlowStepper({
// //   current = 1,
// //   steps = [
// //     "Start",
// //     "Choose Specialty",
// //     "Doctor Availability",
// //     "Select Slot",
// //     "Patient Details",
// //     "Confirmation",
// //   ],
// //   className = "",
// // }) {
// //   return (
// //     <div className={`w-full ${className}`}>
// //       <div className="flex items-center justify-between">
// //         {steps.map((label, idx) => {
// //           const stepNum = idx + 1;
// //           const isDone = stepNum < current;
// //           const isActive = stepNum === current;

// //           return (
// //             <div key={label} className="flex-1 flex items-center min-w-0">
// //               {/* Circle */}
// //               <div className="flex items-center gap-2 min-w-0">
// //                 <div
// //                   className={[
// //                     "h-8 w-8 shrink-0 rounded-full border text-xs font-semibold flex items-center justify-center",
// //                     isDone
// //                       ? "bg-teal-600 text-white border-teal-600"
// //                       : isActive
// //                       ? "bg-white text-teal-900 border-teal-600 ring-4 ring-teal-100"
// //                       : "bg-white text-teal-800 border-teal-300",
// //                   ].join(" ")}
// //                 >
// //                   {stepNum}
// //                 </div>
// //                 <div
// //                   className={[
// //                     "truncate text-sm",
// //                     isDone || isActive ? "text-teal-900" : "text-teal-800/70",
// //                     isActive ? "font-semibold" : "font-medium",
// //                   ].join(" ")}
// //                   title={label}
// //                 >
// //                   {label}
// //                 </div>
// //               </div>

// //               {/* Connector */}
// //               {idx < steps.length - 1 && (
// //                 <div
// //                   className={[
// //                     "mx-2 h-[2px] flex-1 rounded",
// //                     isDone ? "bg-teal-600" : "bg-teal-200",
// //                   ].join(" ")}
// //                 />
// //               )}
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }

// // src/components/FlowStepper.jsx
// import React from "react";
// import { Check } from "lucide-react";

// /**
//  * Circle stepper for the appointment flow (visual only).
//  *
//  * Props:
//  * - current: 1-based active step index
//  * - steps:   array of labels (defaults provided)
//  * - className: extra wrapper classes
//  *
//  * Notes:
//  * - Uses teal palette to match your app.
//  * - Completed steps show a checkmark.
//  * - Active step has a subtle ring + bold label.
//  * - Responsive: labels truncate on very small screens and wrap when space allows.
//  */
// export default function FlowStepper({
//   current = 1,
//   steps = [
//     "Start",
//     "Choose Specialty",
//     "Doctor Availability",
//     "Select Slot",
//     "Patient Details",
//     "Confirmation",
//   ],
//   className = "",
// }) {
//   // clamp current to a valid range
//   const active = Math.min(Math.max(current, 1), steps.length);

//   return (
//     <div className={`w-full ${className}`} aria-label="Appointment booking progress">
//       <div className="flex items-center justify-between gap-3">
//         {steps.map((label, idx) => {
//           const stepNum = idx + 1;
//           const isDone = stepNum < active;
//           const isActive = stepNum === active;

//           return (
//             <div
//               key={label}
//               className="flex-1 min-w-0 flex items-center"
//               aria-current={isActive ? "step" : undefined}
//             >
//               {/* Step node */}
//               <div className="flex items-center gap-3 min-w-0">
//                 <div
//                   className={[
//                     "relative h-9 w-9 shrink-0 rounded-full border flex items-center justify-center",
//                     "transition-colors duration-200",
//                     isDone
//                       ? "bg-teal-600 border-teal-600 text-white shadow-sm"
//                       : isActive
//                       ? "bg-white border-teal-600 text-teal-900 ring-4 ring-teal-100 shadow-sm"
//                       : "bg-white border-teal-300 text-teal-800",
//                   ].join(" ")}
//                 >
//                   {isDone ? (
//                     <Check className="h-4 w-4" aria-hidden="true" />
//                   ) : (
//                     <span className="text-[13px] font-semibold leading-none">{stepNum}</span>
//                   )}
//                 </div>

//                 <div className="min-w-0">
//                   <div
//                     className={[
//                       "truncate text-[13px] sm:text-sm leading-tight",
//                       isActive ? "text-teal-900 font-semibold" : "text-teal-800/80 font-medium",
//                     ].join(" ")}
//                     title={label}
//                   >
//                     {label}
//                   </div>
//                 </div>
//               </div>

//               {/* Connector */}
//               {idx < steps.length - 1 && (
//                 <div className="flex-1 mx-3">
//                   <div
//                     className={[
//                       "h-[2px] w-full rounded-full",
//                       // a subtle gradient makes it feel more refined
//                       isDone
//                         ? "bg-teal-600"
//                         : isActive
//                         ? "bg-gradient-to-r from-teal-600 to-teal-200"
//                         : "bg-teal-200",
//                     ].join(" ")}
//                   />
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// src/components/FlowStepper.jsx
import React from "react";

/**
 * Screenshot-style stepper:
 *  • Circle number
 *  • Short underline below the circle
 *  • Label underneath
 *
 * Props:
 *  - current: 1-based active step index
 *  - steps:   array of labels
 *  - className: extra wrapper classes
 *
 * Palette stays on your teal; future steps are neutral gray.
 */
export default function FlowStepper({
  current = 1,
  steps = [
    "Start",
    "Choose Specialty",
    "Doctor Availability",
    "Select Slot",
    "Patient Details",
    "Confirmation",
  ],
  className = "",
}) {
  const active = Math.min(Math.max(current, 1), steps.length);

  return (
    <nav
      className={`w-full ${className}`}
      aria-label="Appointment booking progress"
    >
      <ol className="flex items-start justify-between gap-2">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === active;
          const isDone = stepNum < active;
          const onColor =
            "bg-teal-600 border-teal-600 text-white"; // filled teal
          const ringColor =
            "ring-4 ring-teal-100"; // subtle halo for the active one
          const offCircle = "bg-gray-100 border-gray-300 text-gray-400";
          const onBar = "bg-teal-600";
          const offBar = "bg-gray-200";
          const onLabel = "text-teal-700";
          const offLabel = "text-gray-400";

          return (
            <li
              key={label}
              className="flex-1 min-w-0 flex flex-col items-center text-center"
              aria-current={isActive ? "step" : undefined}
            >
              {/* Circle */}
              <div
                className={[
                  "h-9 w-9 rounded-full border flex items-center justify-center text-[13px] font-semibold shadow-sm transition-all duration-200",
                  isDone || isActive ? onColor : offCircle,
                  isActive && !isDone ? ringColor : "",
                ].join(" ")}
              >
                {stepNum}
              </div>

              {/* Short underline bar */}
              <div
                className={[
                  "mt-2 h-[3px] w-14 rounded-full",
                  isDone || isActive ? onBar : offBar,
                ].join(" ")}
              />

              {/* Label */}
              <div
                className={[
                  "mt-2 max-w-[8.5rem] truncate text-[13px] leading-tight",
                  isDone || isActive ? onLabel : offLabel,
                  isActive ? "font-semibold" : "font-medium",
                ].join(" ")}
                title={label}
              >
                {label}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
