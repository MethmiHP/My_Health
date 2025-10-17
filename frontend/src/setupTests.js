import './index.css';
import '@testing-library/jest-dom';

// Provide a minimal AuthContext mock so components using useAuth() don't crash
import React from 'react';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});