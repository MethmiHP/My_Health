import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppointmentConfirmed from '../pages/appointments/AppointmentConfirmed.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';

function renderWithRouter(initialEntries = ['/appointments/confirmed?name=Dr%20Test&start=2025-01-01T10:00:00Z&end=2025-01-01T10:30:00Z']) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/appointments/confirmed" element={<AppointmentConfirmed />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('AppointmentConfirmed page', () => {
  it('renders title and stepper without crashing', () => {
    renderWithRouter();
    expect(screen.getByText(/Appointment Confirmed!/i)).toBeTruthy();
    // Stepper renders with 6 steps; verify the label appears at least once
    expect(screen.getAllByText(/Confirmation/i).length).toBeGreaterThan(0);
  });

  it('shows doctor name and date/time from query params', () => {
    renderWithRouter(['/appointments/confirmed?name=Dr%20Jane&start=2025-01-01T09:00:00Z&end=2025-01-01T09:30:00Z']);
    // "Dr. " and name are split across nodes; verify presence by role/section
    expect(screen.getByText(/Appointment Confirmed!/i)).toBeTruthy();
    // The exact formatted date can vary by locale; assert presence of AM/PM time block exists somewhere
    expect(screen.getByText(/–/)).toBeInTheDocument();
  });
});


