import React from 'react';
import stethoscopeBg from '../assets/steth.jpg';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen">
      {/* Background Image - positioned to not cover navbar */}
      <div 
        className="fixed top-16 left-0 right-0 bottom-0 bg-cover bg-center bg-no-repeat opacity-75"
        style={{ backgroundImage: `url(${stethoscopeBg})` }}
        aria-hidden="true"
      />
      {/* Main content */}
      <div className="relative z-10" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '48px',
        fontWeight: 'bold'
      }}>
        Forgot Password
      </div>
    </div>
  );
}
