import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import PatientDashboard from '../pages/dashboards/patientDashboard.jsx';

vi.mock('../utils/api', async (orig) => {
  const mod = await orig();
  return {
    ...mod,
    getJSON: vi.fn((url) => {
      if (url.includes('/api/patients/user/')) {
        return Promise.resolve({
          _id: 'p1', firstName: 'Alice', lastName: 'Doe', dob: '2000-01-01', gender: 'female',
          nic: '123', bloodGroup: 'O+', allergies: ['Peanuts'], chronicConditions: ['Asthma'],
          emergencyContact: { name: 'Bob', relation: 'Father', phone: '111' },
          insurance: { provider: 'ABC', policyNo: 'XYZ' }, barcode: 'BAR123', surgeries: [], medications: []
        });
      }
      if (url.includes('/api/medical-history/patient/')) {
        return Promise.resolve({ medicalHistory: { bloodType: 'O+' } });
      }
      if (url.includes('/api/patient-reports/my-reports')) {
        return Promise.resolve({ reports: [] });
      }
      return Promise.resolve({});
    }),
    postJSON: vi.fn().mockResolvedValue({ ok: true }),
    putJSON: vi.fn().mockResolvedValue({ patient: { _id: 'p1' } }),
  };
});

describe('PatientDashboard', () => {
  it('renders header and key sections', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <PatientDashboard />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/Patient Dashboard/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Medical History/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/My Patient Barcode/i)).toBeInTheDocument();
  });
});


