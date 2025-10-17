// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Menu, X, Settings } from 'lucide-react';
import logo from '../assets/Logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Are we on home page?
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role → dashboard route
  const getRoleDashboard = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'reception':
        return '/reception/dashboard';
      case 'patient':
        return '/patient/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Role → human label
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'doctor':
        return 'Doctor';
      case 'reception':
        return 'Reception';
      case 'patient':
        return 'Patient';
      default:
        return 'User';
    }
  };

  // Smooth-scroll to a section on the Home page (e.g., "How it works")
  const handleAboutClick = (e) => {
    e.preventDefault();
    const targetId = 'how-it-works'; // <-- ensure your Home page section uses this id
    const currentPath = window.location.pathname;

    const scrollToSection = () => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Retry briefly if element not yet in DOM
        setTimeout(scrollToSection, 100);
      }
    };

    if (currentPath !== '/') {
      navigate('/');
      setTimeout(scrollToSection, 300);
    } else {
      scrollToSection();
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logo} alt="My Health Logo" className="h-16 w-auto" />
              {/* <span className="ml-3 text-lg font-semibold text-teal-700">My Health</span> */}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>

            {/* About (scrolls on home) */}
            {isHomePage ? (
              <a
                href="#how-it-works"
                onClick={handleAboutClick}
                className="text-gray-700 hover:text-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                How it works
              </a>
            ) : (
              <Link
                to="/#how-it-works"
                onClick={handleAboutClick}
                className="text-gray-700 hover:text-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                How it works
              </Link>
            )}

           

          

            {user && (
              <>
                <Link
                  to={user?.role === 'doctor' ? '/doctor/dashboard' : '/appointments'}
                  className="text-gray-700 hover:text-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Appointments
                </Link>
               
             
                <Link
                  to={getRoleDashboard(user.role)}
                  className="text-gray-700 hover:text-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* Right side: Auth controls */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((s) => !s)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-teal-700 focus:outline-none"
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:5000${user.profilePic}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-teal-700" />
                    </div>
                  )}
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-sm font-medium">
                      {user.firstName || 'User'}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/onboard-hospital"
                  className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              className="text-gray-700 hover:text-teal-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* --------------------------- Mobile Drawer --------------------------- */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* About/How it works (mobile) */}
              {isHomePage ? (
                <a
                  href="#how-it-works"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    handleAboutClick(e);
                  }}
                >
                  How it works
                </a>
              ) : (
                <a
                  href="/#how-it-works"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    handleAboutClick(e);
                  }}
                >
                  How it works
                </a>
              )}

              <Link
                to="/doctors"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Doctors
              </Link>

              <Link
                to="/hospitals"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Hospitals
              </Link>

              {user && (
                <>
                  <Link
                    to={user?.role === 'doctor' ? '/doctor/dashboard' : '/appointments'}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Appointments
                  </Link>
                  <Link
                    to="/records"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Records
                  </Link>
                  <Link
                    to="/billing"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Billing
                  </Link>
                  <Link
                    to={getRoleDashboard(user.role)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}

              {/* Mobile profile / auth area */}
              {user ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center px-3">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:5000${user.profilePic}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-teal-700" />
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {(user.firstName || '') + ' ' + (user.lastName || '')}
                      </div>
                      <div className="text-sm text-gray-500">{getRoleLabel(user.role)}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-1">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/onboard-hospital"
                    className="block px-3 py-2 text-base font-medium bg-teal-600 text-white hover:bg-teal-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
