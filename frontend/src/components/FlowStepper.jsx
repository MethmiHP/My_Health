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
