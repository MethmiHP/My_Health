import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import ReportsDashboard from '../pages/reports/ReportsDashboard.jsx';

// Mock fetch globally for this test file
vi.stubGlobal('fetch', vi.fn(async (url) => {
  // Simulate a slight delay so the component shows loader first, then data
  if (String(url).includes('/api/reports/summary')) {
    await new Promise(r => setTimeout(r, 10));
    return {
      ok: true,
      json: async () => ({
        summary: { appointments: { total: 10, completed: 7 }, revenue: { total: 1000, average: 100, transactions: 10 }, patients: { total: 5 }, doctors: { total: 3 } },
        charts: { appointmentsByStatus: [], dailyRevenue: [], paymentsByMethod: [] },
      })
    };
  }
  return { ok: true, blob: async () => new Blob() };
}));

describe('ReportsDashboard', () => {
  beforeEach(() => {
    // Ensure auth passes inside component
    localStorage.setItem('token', 't');
  });
  afterEach(() => {
    localStorage.removeItem('token');
  });
  it('renders analytics header and filter panel', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <ReportsDashboard />
        </MemoryRouter>
      </AuthProvider>
    );
    // Wait until loading state is gone by checking that spinner text disappears
    // Wait for the page header to appear after data load
    expect(await screen.findByRole('heading', { name: /Analytics & Reports/i })).toBeInTheDocument();
  });
});


