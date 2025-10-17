// src/pages/Home.jsx
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Stethoscope,
  CalendarCheck,
  FileText,
  CreditCard,
  ShieldCheck,
  Activity,
  Building2,
  Ambulance,
} from 'lucide-react';
import heroImg from '../assets/hospital.jpg'; // <-- replace with your image
import logo from '../assets/Logo.png';

// --------------------------- Intersection Observer Hook ---------------------------
const useIntersectionObserver = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [elementRef, isVisible];
};

// ------------------------------- Animated Section ---------------------------------
const AnimatedSection = ({ children, className = '', delay = 0, animation = 'fade-up' }) => {
  const [ref, isVisible] = useIntersectionObserver();

  const animationClasses = {
    'fade-up': isVisible ? 'animate-fade-up opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    'fade-in': isVisible ? 'animate-fade-in opacity-100' : 'opacity-0',
    'slide-left': isVisible ? 'animate-slide-left opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    'slide-right': isVisible ? 'animate-slide-right opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
    'scale-up': isVisible ? 'animate-scale-up opacity-100 scale-100' : 'opacity-0 scale-95',
  };

  return (
    <div
      ref={ref}
      className={`${className} ${animationClasses[animation]} transition-all duration-700 ease-out`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ------------------------------------- Home ---------------------------------------
export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookClick = () => {
    navigate(user ? '/appointments' : '/login');
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes fadeIn { from { opacity: 0;} to { opacity: 1;} }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(30px);} to { opacity: 1; transform: translateX(0);} }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-30px);} to { opacity: 1; transform: translateX(0);} }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
        .animate-fade-up { animation: fadeUp 0.7s ease-out; }
        .animate-fade-in { animation: fadeIn 0.7s ease-out; }
        .animate-slide-left { animation: slideLeft 0.7s ease-out; }
        .animate-slide-right { animation: slideRight 0.7s ease-out; }
        .animate-scale-up { animation: scaleUp 0.7s ease-out; }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up, .animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-scale-up {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        /* Extra vectors for hero */
        @keyframes heartbeatDash { to { stroke-dashoffset: -1200; } }
        @keyframes floatSlow { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } }
        .hero-heartbeat { stroke: #14b8a6; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; fill: none; stroke-dasharray: 12 10; animation: heartbeatDash 6s linear infinite; opacity: .85; }
        .med-float { animation: floatSlow 5s ease-in-out infinite; }
      `}</style>

      {/* ------------------------------- Hero Section ------------------------------- */}
      <section aria-label="Hero" className="relative h-[22rem] md:h-[28rem] lg:h-[32rem] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-teal-900/40" />

        {/* Animated heartbeat line */}
        <svg className="absolute bottom-8 left-0 right-0 w-[120%] -translate-x-[10%]" height="80" viewBox="0 0 1200 80" aria-hidden="true">
          <path
            className="hero-heartbeat"
            d="M0 40 H150 L180 10 L210 70 L240 40 H350 L380 20 L410 60 L440 40 H560 L590 8 L615 72 L640 40 H770 L800 18 L830 62 L860 40 H1000 L1030 15 L1060 65 L1090 40 H1200"
          />
        </svg>

        {/* Floating medical crosses */}
        <svg className="absolute top-10 left-10 w-8 h-8 text-white/80 med-float" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10 2h4v6h6v4h-6v6h-4v-6H4v-4h6z" />
        </svg>
        <svg className="absolute top-20 right-16 w-6 h-6 text-white/70 med-float" style={{animationDelay:'0.8s'}} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10 2h4v6h6v4h-6v6h-4v-6H4v-4h6z" />
        </svg>
        <svg className="absolute bottom-16 left-24 w-7 h-7 text-white/75 med-float" style={{animationDelay:'1.6s'}} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10 2h4v6h6v4h-6v6h-4v-6H4v-4h6z" />
        </svg>

        {/* Decorative accents */}
        <div className="absolute top-4 left-4 w-16 h-16 bg-teal-300 rounded-full opacity-30" />
        <div className="absolute top-12 right-8 w-8 h-8 bg-teal-200 rounded-full opacity-40" />
        <div className="absolute bottom-8 left-12 w-12 h-12 bg-teal-300 rounded-full opacity-25" />
        <div className="absolute bottom-4 right-16 w-6 h-6 bg-teal-200 rounded-full opacity-50" />

        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
              CONNECTED CARE.
              <br />
              SMART HOSPITALS.
              <br />
              BETTER OUTCOMES.
            </h1>
            <p className="mt-3 text-white/90 max-w-2xl mx-auto">
              Book appointments, access records, and pay securely across a network of hospitals.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={handleBookClick}
                className="rounded-2xl bg-white px-5 py-2 text-sm font-semibold text-teal-700 shadow hover:shadow-md"
              >
                Book Appointment
              </button>
              <a
                href="#hospitals"
                className="rounded-2xl border border-white/70 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Find Hospitals
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- Why SmartCare ------------------------------- */}
      <section id="why-smartcare" className="py-16 bg-gray-50" aria-labelledby="why-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12" animation="fade-up">
            <h2 id="why-title" className="text-3xl font-bold text-gray-900 mb-4">WHY CHOOSE SMARTCARE?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Tools for patients, clinicians, and administrators—designed to streamline care and operations.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Appointments */}
            <AnimatedSection
              className="text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              animation="scale-up"
              delay={0}
            >
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <CalendarCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Easy Appointments</h3>
              <p className="text-sm text-gray-600">
                Search doctors by specialty, book, reschedule, and get reminders.
              </p>
            </AnimatedSection>

            {/* Electronic Records */}
            <AnimatedSection
              className="text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              animation="scale-up"
              delay={100}
            >
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Electronic Records</h3>
              <p className="text-sm text-gray-600">
                Securely view lab results, prescriptions, and visit history.
              </p>
            </AnimatedSection>

            {/* Payments */}
            <AnimatedSection
              className="text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              animation="scale-up"
              delay={200}
            >
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Flexible Payments</h3>
              <p className="text-sm text-gray-600">
                Pay by cash, card, or insurance—itemized bills in one place.
              </p>
            </AnimatedSection>

            {/* Privacy & Security */}
            <AnimatedSection
              className="text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              animation="scale-up"
              delay={300}
            >
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Safety & Privacy</h3>
              <p className="text-sm text-gray-600">
                Role-based access and audit trails keep data protected.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ------------------------------ How It Works ------------------------------- */}
      <section id="how-it-works" className="py-16 bg-white" aria-labelledby="how-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12" animation="fade-up">
            <h2 id="how-title" className="text-3xl font-bold text-gray-900 mb-4">HOW IT WORKS</h2>
            <p className="text-gray-600 text-lg">Three quick steps to coordinated care</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <AnimatedSection className="text-center" animation="slide-left" delay={0}>
              <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-4 text-xl">REGISTER & PROFILE</h3>
              <p className="text-gray-600">Create your account and add medical details and preferences.</p>
            </AnimatedSection>

            {/* Step 2 */}
            <AnimatedSection className="text-center" animation="fade-up" delay={100}>
              <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-4 text-xl">BOOK & CHECK IN</h3>
              <p className="text-gray-600">Pick a doctor, time, and hospital. Get digital tokens and directions.</p>
            </AnimatedSection>

            {/* Step 3 */}
            <AnimatedSection className="text-center" animation="slide-right" delay={200}>
              <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-4 text-xl">CARE & FOLLOW-UP</h3>
              <p className="text-gray-600">View prescriptions and lab results, pay, and schedule follow-ups.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* --------------------------- Stats & Network Card --------------------------- */}
      <section id="hospitals" className="py-16 bg-gray-50" aria-labelledby="network-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <AnimatedSection className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm" animation="fade-up">
              <div className="flex items-center gap-3 text-teal-700">
                <Building2 className="w-6 h-6" />
                <h3 id="network-title" className="font-semibold">Hospital Network</h3>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {[
                  { k: 'Hospitals', v: '250+' },
                  { k: 'Doctors', v: '5,000+' },
                  { k: 'Appointments/yr', v: '1M+' },
                  { k: 'Uptime', v: '99.9%' },
                ].map((i) => (
                  <div key={i.k} className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
                    <div className="text-lg font-bold text-teal-800">{i.v}</div>
                    <div className="text-xs text-teal-900/70">{i.k}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection
              className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm"
              animation="fade-up"
              delay={150}
            >
              <div className="flex items-center gap-3 text-teal-700">
                <Activity className="w-6 h-6" />
                <h3 className="font-semibold">Emergency Ready</h3>
              </div>
              <p className="mt-3 text-sm text-teal-900/80">
                Integrated ER triage and ambulance routing for faster response across the network.
              </p>
              <div className="mt-4 flex items-center gap-3 text-teal-700">
                <Ambulance className="w-6 h-6" />
                <span className="text-sm">24/7 hotline and live queue updates</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ----------------------------------- CTA ----------------------------------- */}
      <section id="book" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl border border-teal-100 bg-gradient-to-r from-teal-600 to-teal-500 p-8 text-white">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold">Ready to get started?</h3>
              <p className="text-sm/6 text-white/90">Create your patient account or onboard your hospital today.</p>
            </div>
            <div className="flex gap-3">
              <a href="#signup" className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-teal-700">
                Create patient account
              </a>
              {/* UPDATED: Link to OnboardHospital page */}
              <Link
                to="/onboard-hospital"
                className="rounded-2xl border border-white/50 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Hospital onboarding
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------- Footer ---------------------------------- */}
      <AnimatedSection animation="fade-up">
        <footer className="bg-teal-800 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Logo and Description */}
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <img src={logo} alt="My Health" className="h-16 w-auto" />
                  {/* <span className="ml-3 text-xl font-bold">My Health</span> */}
                </div>
                <p className="text-teal-100 leading-relaxed">
                  A connected hospital platform for Sri Lanka—secure records, faster check-ins, and analytics that
                  improve patient flow.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
                <div className="space-y-2 text-sm">
                  <div><a href="#" className="text-teal-200 hover:text-white">Home</a></div>
                  <div><a href="#" className="text-teal-200 hover:text-white">Doctors</a></div>
                  <div><a href="#" className="text-teal-200 hover:text-white">Hospitals</a></div>
                  <div>
                    <Link to="/onboard-hospital" className="text-teal-200 hover:text-white">
                      Hospital onboarding
                    </Link>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div>
                <h4 className="font-bold mb-4 text-lg">Compliance</h4>
                <div className="space-y-2 text-sm">
                  <div>Gov & Insurance ready</div>
                  <div>Role-based access</div>
                  <div>Audit logs & backups</div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </AnimatedSection>
    </main>
  );
}
