import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MedicationAlert from '../components/MedicationAlert.jsx';

describe('MedicationAlert', () => {
  it('renders nothing when no meds and surgeries', () => {
    const { container } = render(<MedicationAlert medications={[]} surgeries={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders meds and surgeries summaries', () => {
    render(
      <MedicationAlert
        medications={["Drug A"]}
        surgeries={[{ type: 'surgery', name: 'Appendectomy', date: '2024-01-01' }]}
        lastUpdated={'2024-01-02'}
        updatedBy={'Dr. Smith'}
      />
    );
    expect(screen.getByText(/Current Medications/i)).toBeInTheDocument();
    expect(screen.getByText(/Appendectomy/i)).toBeInTheDocument();
  });
});


