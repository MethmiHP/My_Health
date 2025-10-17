import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FlowStepper from '../components/FlowStepper.jsx';

describe('FlowStepper', () => {
  it('renders default 6 steps and highlights current', () => {
    render(<FlowStepper current={3} />);
    // Default labels present
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Confirmation')).toBeInTheDocument();
    // ARIA current on the active step
    const items = screen.getAllByRole('listitem');
    const active = items.find(li => li.getAttribute('aria-current') === 'step');
    expect(active).toBeTruthy();
  });
});


