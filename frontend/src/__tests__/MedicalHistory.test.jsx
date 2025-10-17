import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MedicalHistory from '../components/MedicalHistory.jsx';

const sample = {
  bloodType: 'O+',
  allergies: ['Peanuts'],
  chronicConditions: ['Asthma'],
  familyConditions: ['Diabetes'],
  medications: [{ name: 'Med A', dosage: '5mg', status: 'active', startDate: '2025-01-01' }],
  procedures: [{ procedureName: 'Appendectomy', type: 'surgery', procedureDate: '2024-12-12' }],
  prescriptions: [{ medicationName: 'Amoxicillin', dosage: '250mg', status: 'prescribed', prescribedDate: '2025-01-02', startDate: '2025-01-03' }],
  lastUpdatedAt: '2025-01-10T00:00:00Z',
};

describe('MedicalHistory', () => {
  it('renders sections and counts', () => {
    render(<MedicalHistory medicalHistory={sample} loading={false} />);
    expect(screen.getByText('Blood Type')).toBeInTheDocument();
    expect(screen.getAllByText('Allergies').length).toBeGreaterThan(0);
    expect(screen.getByText(/Procedures/)).toBeInTheDocument();
  });
});


