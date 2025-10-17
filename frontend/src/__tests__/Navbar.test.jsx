import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';

function renderWithAuth(ui) {
  return render(
    <AuthProvider>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('Navbar', () => {
  it('renders My Health brand', () => {
    renderWithAuth(<Navbar />);
    expect(screen.getByAltText(/My Health/i)).toBeInTheDocument();
  });
});


