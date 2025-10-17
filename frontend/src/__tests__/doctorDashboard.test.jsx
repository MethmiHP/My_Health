import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import DoctorDashboard from '../pages/dashboards/doctorDashboard.jsx';

vi.mock('../utils/api', async (orig) => {
  const mod = await orig();
  return {
    ...mod,
    getJSON: vi.fn((url) => {
      if (url.includes('/api/appointments/doctor/day')) {
        return Promise.resolve({ appointments: [] });
      }
      if (url.includes('/api/patient-reports/doctor')) {
        return Promise.resolve({ reports: [] });
      }
      return Promise.resolve({});
    }),
    putJSON: vi.fn().mockResolvedValue({}),
    postJSON: vi.fn().mockResolvedValue({}),
  };
});

describe('DoctorDashboard', () => {
  it('renders header and tabs', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <DoctorDashboard />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/Doctor Dashboard/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Appointments/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Barcode Scanner/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient Alerts/i)).toBeInTheDocument();
  });
});


