import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BarcodeScanner from '../components/BarcodeScanner.jsx';

// Mock dynamic import of @zxing/library to avoid camera usage in tests
vi.mock('@zxing/library', () => ({
  BrowserMultiFormatReader: class {
    listVideoInputDevices() { return Promise.resolve([]); }
    decodeFromVideoDevice() { return Promise.resolve({ getTracks: () => [] }); }
    reset() {}
  },
  BarcodeFormat: { CODE_39: 3, CODE_128: 5 },
}));

describe('BarcodeScanner', () => {
  it('renders scanner UI and controls', () => {
    render(<BarcodeScanner isActive={false} onScan={() => {}} onError={() => {}} />);
    expect(screen.getByText(/Barcode Scanner/i)).toBeInTheDocument();
    expect(screen.getByText(/Scanner Inactive/i)).toBeInTheDocument();
  });
});


