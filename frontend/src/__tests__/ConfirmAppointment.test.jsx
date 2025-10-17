import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ConfirmAppointment from '../pages/appointments/ConfirmAppointment.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';

vi.mock('../utils/api', async (orig) => {
  const mod = await orig();
  return {
    ...mod,
    getJSON: vi.fn().mockResolvedValue({ data: { name: 'John Doe', email: 'j@d.com', phone: '123' } }),
    postJSON: vi.fn().mockResolvedValue({ ok: true }),
  };
});

function renderWithRouter() {
  const url = '/appointments/confirm?doctorId=abc&name=Dr%20Test&start=2025-01-01T10:00:00Z&end=2025-01-01T10:30:00Z';
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/appointments/confirm" element={<ConfirmAppointment />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('ConfirmAppointment page', () => {
  it('renders heading and form', async () => {
    renderWithRouter();
    expect(screen.getByText(/Confirm Appointment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm Booking/i })).toBeInTheDocument();
  });
});


