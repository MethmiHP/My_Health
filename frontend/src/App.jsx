// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
// import ProtectedRoute from './components/ProtectedRoute';
// import Navbar from './components/NavBar';

// // Auth Pages
// import Login from './pages/Login.jsx';
// import Home from './components/home.jsx';

// import OnboardHospital from "./pages/OnboardHospital";


// // Dashboard Pages
// import CashierDashboard from './pages/dashboards/cashierDashboard';
// import DoctorDashboard from './pages/dashboards/doctorDashboard';
// import AdminDashboard from './pages/dashboards/hospitalDashboard';
// import PatientDashboard from './pages/dashboards/patientDashboard';

// // Utility Pages
// const Unauthorized = () => (
//   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//     <div className="text-center">
//       <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
//       <p className="text-xl text-gray-600 mb-8">You don't have permission to access this page.</p>
//       <button 
//         onClick={() => window.history.back()} 
//         className="btn-primary"
//       >
//         Go Back
//       </button>
//     </div>
//   </div>
// );

// const NotFound = () => (
//   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//     <div className="text-center">
//       <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
//       <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
//       <button 
//         onClick={() => window.history.back()} 
//         className="btn-primary"
//       >
//         Go Back
//       </button>
//     </div>
//   </div>
// );

// // Component to redirect to appropriate dashboard based on user role
// const DashboardRedirect = () => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;

//   const role = (user.role || "").toLowerCase();
//   const targetByRole = {
//     admin:     "/admin-dashboard",
//     patient:   "/patient-dashboard",
//     doctor:    "/doctor-dashboard",
//     cashier:   "/cashier-dashboard",
//   };

//   return <Navigate to={targetByRole[role] || "/patient-dashboard"} replace />;
// };

// // Main content component
// const AppContent = () => {
//   const location = useLocation();
//   const hideNavbarPaths = ['/login', '/register', '/register-recycle-centre'];
//   const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

//   return (
//     <>
//       {!shouldHideNavbar && <Navbar />}
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/unauthorized" element={<Unauthorized />} />

//         <Route path="/onboard-hospital" element={<OnboardHospital />} />


//         {/* Protected Routes */}
//         <Route path="/" element={
//           <ProtectedRoute>
//             <Navigate to="/dashboard" replace />
//           </ProtectedRoute>
//         } />

//         {/* Generic Dashboard Route */}
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <DashboardRedirect />
//           </ProtectedRoute>
//         } />

//         {/* Role-specific Dashboards */}
//         <Route path="/admin-dashboard" element={
//           <ProtectedRoute roles={['admin']}>
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />

//         <Route path="/patient-dashboard" element={
//           <ProtectedRoute roles={['patient']}>
//             <PatientDashboard />
//           </ProtectedRoute>
//         } />

//         <Route path="/doctor-dashboard" element={
//           <ProtectedRoute roles={['doctor']}>
//             <DoctorDashboard />
//           </ProtectedRoute>
//         } />

        
//         <Route path="/cashier-dashboard" element={
//           <ProtectedRoute roles={['cashier']}>
//             <CashierDashboard />
//           </ProtectedRoute>
//         } />


//         {/* Catch all route */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>

//       {/* Toast Notifications */}
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </>
//   );
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="App">
//           <AppContent />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavBar';

// Auth Pages
import Login from './pages/Login.jsx';
import Home from './components/home.jsx';
import OnboardHospital from './pages/OnboardHospital';

// Dashboards
import CashierDashboard from './pages/dashboards/cashierDashboard';
import DoctorDashboard from './pages/dashboards/doctorDashboard';
import AdminDashboard from './pages/dashboards/hospitalDashboard';
import PatientDashboard from './pages/dashboards/patientDashboard';
import CashierPayments from './pages/dashboards/CashierPayments';

// Medical History
import MedicalHistoryPage from './pages/MedicalHistoryPage';

// Appointments
import Specialties from './pages/appointments/Specialties';
import Doctors from './pages/appointments/Doctors';
import DoctorSlots from './pages/appointments/DoctorSlots';
import ConfirmAppointment from './pages/appointments/ConfirmAppointment';
import MyAppointments from './pages/appointments/MyAppointments';

// -------- Utility pages --------
const Unauthorized = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
      <p className="text-xl text-gray-600 mb-8">You don't have permission to access this page.</p>
      <button onClick={() => window.history.back()} className="btn-primary">Go Back</button>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  </div>
);

// -------- Central dashboard redirect by role --------
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const role = (user.role || '').toLowerCase();
  const targetByRole = {
    admin:     '/admin-dashboard',
    patient:   '/patient-dashboard',
    doctor:    '/doctor-dashboard',
    cashier:   '/cashier-dashboard',
    // reception: '/reception-dashboard', // add when you build it
  };

  return <Navigate to={targetByRole[role] || '/patient-dashboard'} replace />;
};

// -------- App content with routes --------
const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/register-recycle-centre', '/onboard-hospital'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/onboard-hospital" element={<OnboardHospital />} />

        {/* Generic dashboard entry point */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Role dashboards */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute roles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute roles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier-dashboard"
          element={
            <ProtectedRoute roles={['cashier']}>
              <CashierDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cashier-dashboard/payments"
          element={
            <ProtectedRoute roles={['cashier']}>
              <CashierPayments />
            </ProtectedRoute>
        } 
        />

        {/* --- Optional aliases: prevent old links from 404ing --- */}
        <Route path="/admin/dashboard" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/patient/dashboard" element={<Navigate to="/patient-dashboard" replace />} />
        <Route path="/doctor/dashboard" element={<Navigate to="/doctor-dashboard" replace />} />
        <Route path="/cashier/dashboard" element={<Navigate to="/cashier-dashboard" replace />} />

        {/* Medical History (patient) */}
        <Route path="/medical-history" element={
          <ProtectedRoute roles={['patient']}>
            <MedicalHistoryPage />
          </ProtectedRoute>
        } />

        {/* Appointments (patient) */}
<Route path="/appointments" element={
  <ProtectedRoute roles={['patient','reception','admin']}>
    <Specialties />
  </ProtectedRoute>
} />
<Route path="/appointments/doctors" element={
  <ProtectedRoute roles={['patient','reception','admin']}>
    <Doctors />
  </ProtectedRoute>
} />
<Route path="/appointments/doctor/:doctorId" element={
  <ProtectedRoute roles={['patient','reception','admin']}>
    <DoctorSlots />
  </ProtectedRoute>
} />
<Route path="/appointments/confirm" element={
  <ProtectedRoute roles={['patient','reception','admin']}>
    <ConfirmAppointment />
  </ProtectedRoute>
} />
<Route path="/appointments/my" element={
  <ProtectedRoute roles={['patient']}>
    <MyAppointments />
  </ProtectedRoute>
} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={5000} theme="light" />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}
