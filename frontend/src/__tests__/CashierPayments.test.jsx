import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import CashierPayments from '../pages/dashboards/CashierPayments.jsx';

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { medications: [], total: 0 } }),
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

describe('CashierPayments', () => {
  it('renders payment header and controls', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <CashierPayments />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/Manage Payments/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Patient NIC/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fetch Bill/i })).toBeInTheDocument();
  });
});


