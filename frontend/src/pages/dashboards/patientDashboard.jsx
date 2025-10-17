
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  CalendarPlus,
  CalendarDays,
  FileText,
  CreditCard,
  QrCode,
  AlertTriangle,
  Send,
  X,
  User,
  Edit3,
  Save,
  XCircle,
  ArrowRight,
  Download,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getJSON, postJSON, putJSON, useAuthHeaders } from "../../utils/api";
import BarcodeCard from "../../components/BarcodeCard";
import MedicationAlert from "../../components/MedicationAlert";
import MedicalHistory from "../../components/MedicalHistory";
import stethoscopeBg from "../../assets/steth.jpg";

export default function PatientDashboard() {
  const { user } = useAuth();
  const headers = useAuthHeaders();
  const navigate = useNavigate();
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Report functionality state
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportPriority, setReportPriority] = useState('medium');
  const [submittingReport, setSubmittingReport] = useState(false);
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({});
  
  // Medical history state
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [medicalHistoryLoading, setMedicalHistoryLoading] = useState(false);
  
  // Patient reports state
  const [patientReports, setPatientReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [editingQuickConditions, setEditingQuickConditions] = useState(false);
  const [savingQuickConditions, setSavingQuickConditions] = useState(false);
  const [quickChronicText, setQuickChronicText] = useState('');
  const [quickAllergiesText, setQuickAllergiesText] = useState('');

  const loadPatientProfile = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const data = await getJSON(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/patients/user/${user._id}`, headers);
      setPatientProfile(data);
    } catch (error) {
      console.error('Failed to load patient profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientProfile();
  }, [user?._id]);

  // Refresh patient profile when page becomes visible (in case medications or surgeries were updated by doctor)
  useEffect(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      loadPatientProfile();
      loadPatientReports();
    }
  };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadMedicalHistory = async () => {
    if (!user?._id) return;
    
    setMedicalHistoryLoading(true);
    try {
      const data = await getJSON(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/medical-history/patient/${user._id}`,
        headers
      );
      setMedicalHistory(data.medicalHistory);
    } catch (error) {
      console.error('Failed to load medical history:', error);
    } finally {
      setMedicalHistoryLoading(false);
    }
  };

  const loadPatientReports = async () => {
    setReportsLoading(true);
    try {
      const data = await getJSON(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/patient-reports/my-reports`, headers);
      setPatientReports(data.reports || []);
    } catch (error) {
      console.error('Failed to fetch patient reports:', error);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    loadMedicalHistory();
    loadPatientReports();
  }, [user?._id]);

  const formatDate = (date) => date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not provided';
  const getAge = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  // Prefill quick editor when profile is loaded or entering View more
  useEffect(() => {
    if (patientProfile && showFullProfile) {
      setQuickChronicText((patientProfile.chronicConditions || []).join(', '));
      setQuickAllergiesText((patientProfile.allergies || []).join(', '));
      setEditingQuickConditions(false);
    }
  }, [patientProfile, showFullProfile]);

  // Initialize profile form data when patient profile loads
  useEffect(() => {
    if (patientProfile) {
      setProfileFormData({
        dob: patientProfile.dob ? new Date(patientProfile.dob).toISOString().split('T')[0] : '',
        gender: patientProfile.gender || 'other',
        bloodGroup: patientProfile.bloodGroup || '',
        allergies: patientProfile.allergies || [],
        chronicConditions: patientProfile.chronicConditions || [],
        familyConditions: patientProfile.familyConditions || [],
        heightCm: patientProfile.heightCm || '',
        weightKg: patientProfile.weightKg || '',
        emergencyContact: {
          name: patientProfile.emergencyContact?.name || '',
          phone: patientProfile.emergencyContact?.phone || '',
          relation: patientProfile.emergencyContact?.relation || ''
        },
        insurance: {
          provider: patientProfile.insurance?.provider || '',
          policyNo: patientProfile.insurance?.policyNo || ''
        },
        guardian: {
          name: patientProfile.guardian?.name || '',
          phone: patientProfile.guardian?.phone || '',
          relationship: patientProfile.guardian?.relationship || ''
        },
        consent: patientProfile.consent || false
      });
    }
  }, [patientProfile]);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportContent.trim()) return;

    setSubmittingReport(true);
    try {
      const response = await postJSON(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/patient-reports`,
        headers,
        {
          reportContent: reportContent.trim(),
          priority: reportPriority
        }
      );

      // Reset form
      setReportContent('');
      setReportPriority('medium');
      setShowReportForm(false);
      
      // Show success message (you can replace this with a toast notification)
      alert('Report submitted successfully! Your doctor will review it soon.');
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?._id) return;

    setEditingProfile(true);
    try {
      console.log('Updating profile with user ID:', user._id);
      console.log('Profile data:', profileFormData);
      
      const response = await putJSON(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/patients/${patientProfile._id}`,
        headers,
        profileFormData
      );

      console.log('Update response:', response);

      // Update local state
      setPatientProfile(response.patient);
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      console.error('Error details:', error.message);
      alert(`Failed to update profile: ${error.message || 'Please try again.'}`);
    } finally {
      setEditingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    // Reset form data to original values
    if (patientProfile) {
      setProfileFormData({
        dob: patientProfile.dob ? new Date(patientProfile.dob).toISOString().split('T')[0] : '',
        gender: patientProfile.gender || 'other',
        bloodGroup: patientProfile.bloodGroup || '',
        allergies: patientProfile.allergies || [],
        chronicConditions: patientProfile.chronicConditions || [],
        familyConditions: patientProfile.familyConditions || [],
        heightCm: patientProfile.heightCm || '',
        weightKg: patientProfile.weightKg || '',
        emergencyContact: {
          name: patientProfile.emergencyContact?.name || '',
          phone: patientProfile.emergencyContact?.phone || '',
          relation: patientProfile.emergencyContact?.relation || ''
        },
        insurance: {
          provider: patientProfile.insurance?.provider || '',
          policyNo: patientProfile.insurance?.policyNo || ''
        },
        guardian: {
          name: patientProfile.guardian?.name || '',
          phone: patientProfile.guardian?.phone || '',
          relationship: patientProfile.guardian?.relationship || ''
        },
        consent: patientProfile.consent || false
      });
    }
  };

  const handleFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayFieldChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setProfileFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Background Image - positioned to not cover navbar */}
      <div 
        className="fixed top-16 left-0 right-0 bottom-0 bg-cover bg-center bg-no-repeat opacity-75"
        style={{ backgroundImage: `url(${stethoscopeBg})` }}
        aria-hidden="true"
      />
      {/* Main content */}
      <main className="relative z-10">
      {/* Header */}
      <section className="bg-white/95 backdrop-blur-sm border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-teal-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 text-shadow-sm">Patient Dashboard</h1>
              <p className="text-gray-600">Manage your health records and appointments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Medication Alert Section */}
      {((patientProfile?.medications && patientProfile.medications.length > 0) || 
        (patientProfile?.surgeries && patientProfile.surgeries.length > 0)) && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700">Medical Records Updates</h2>
            <button
              onClick={loadPatientProfile}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
          <MedicationAlert 
            medications={patientProfile.medications}
            surgeries={patientProfile.surgeries}
            lastUpdated={patientProfile.updatedAt}
            updatedBy="Healthcare Provider"
          />
        </section>
      )}

      {/* Report Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Report to Doctor</h2>
              <p className="text-sm text-gray-600">Share concerns with your healthcare provider</p>
            </div>
            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              {showReportForm ? 'Cancel' : 'Report'}
            </button>
          </div>

          {showReportForm && (
            <form onSubmit={handleSubmitReport} className="space-y-4 mt-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={reportPriority}
                  onChange={(e) => setReportPriority(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Moderate concern</option>
                  <option value="high">High - Urgent attention needed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="reportContent" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="reportContent"
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  placeholder="Describe your symptoms or concerns..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportForm(false);
                    setReportContent('');
                    setReportPriority('medium');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reportContent.trim() || submittingReport}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submittingReport ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Patient Profile Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">My Profile</h2>
              <p className="text-sm text-gray-600">View and update your information</p>
            </div>
            {showFullProfile ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFullProfile(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditingProfile ? 'Cancel' : 'Edit'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowFullProfile(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                View more
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-teal-600">Loading profile...</p>
            </div>
          ) : patientProfile ? (
            showFullProfile ? (
              <>
                {/* Quick edit for Chronic Conditions and Allergies */}
                <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Conditions & Allergies</h3>
                    {!editingQuickConditions ? (
                      <button
                        type="button"
                        onClick={() => setEditingQuickConditions(true)}
                        className="text-xs text-teal-700 hover:text-teal-900"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setQuickChronicText((patientProfile.chronicConditions || []).join(', '));
                            setQuickAllergiesText((patientProfile.allergies || []).join(', '));
                            setEditingQuickConditions(false);
                          }}
                          className="text-xs text-gray-700 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={savingQuickConditions}
                          onClick={async () => {
                            if (!patientProfile?._id) return;
                            const chronicArray = quickChronicText.split(',').map(s => s.trim()).filter(Boolean);
                            const allergiesArray = quickAllergiesText.split(',').map(s => s.trim()).filter(Boolean);
                            setSavingQuickConditions(true);
                            try {
                              const response = await putJSON(
                                `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/patients/${patientProfile._id}`,
                                headers,
                                {
                                  chronicConditions: chronicArray,
                                  allergies: allergiesArray,
                                }
                              );
                              setPatientProfile(response.patient);
                              // keep form data in sync if user enters edit mode later
                              setProfileFormData(prev => ({
                                ...prev,
                                chronicConditions: response.patient?.chronicConditions || [],
                                allergies: response.patient?.allergies || [],
                              }));
                              setEditingQuickConditions(false);
                            } catch (err) {
                              console.error('Quick save error:', err);
                              alert('Failed to save. Please try again.');
                            } finally {
                              setSavingQuickConditions(false);
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                        >
                          {savingQuickConditions ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    )}
                  </div>

                  {!editingQuickConditions ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Chronic Conditions</div>
                        <div className="flex flex-wrap gap-2">
                          {(patientProfile.chronicConditions || []).map((c, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full">{c}</span>
                          ))}
                          {(patientProfile.chronicConditions || []).length === 0 && (
                            <span className="text-gray-500">None</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Allergies</div>
                        <div className="flex flex-wrap gap-2">
                          {(patientProfile.allergies || []).map((a, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded-full">{a}</span>
                          ))}
                          {(patientProfile.allergies || []).length === 0 && (
                            <span className="text-gray-500">None</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Chronic Conditions</label>
                        <input
                          type="text"
                          value={quickChronicText}
                          onChange={(e) => setQuickChronicText(e.target.value)}
                          placeholder="e.g., Diabetes, Hypertension"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <div className="text-xs text-gray-500 mt-1">Separate with commas</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Allergies</label>
                        <input
                          type="text"
                          value={quickAllergiesText}
                          onChange={(e) => setQuickAllergiesText(e.target.value)}
                          placeholder="e.g., Penicillin, Peanuts"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <div className="text-xs text-gray-500 mt-1">Separate with commas</div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 border-b pb-2">
                    Personal Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      National Identity Card (NIC)
                    </label>
                    <p className="text-gray-900 py-2 font-mono text-sm bg-gray-50 px-3 rounded border">
                      {patientProfile.nic || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="date"
                        value={profileFormData.dob}
                        onChange={(e) => handleFormChange('dob', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.dob ? new Date(patientProfile.dob).toLocaleDateString() : 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    {isEditingProfile ? (
                      <select
                        value={profileFormData.gender}
                        onChange={(e) => handleFormChange('gender', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-2 capitalize">
                        {patientProfile.gender || 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileFormData.bloodGroup}
                        onChange={(e) => handleFormChange('bloodGroup', e.target.value)}
                        placeholder="e.g., A+, B-, O+, AB-"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.bloodGroup || 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="number"
                        value={profileFormData.heightCm}
                        onChange={(e) => handleFormChange('heightCm', e.target.value)}
                        placeholder="e.g., 170"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.heightCm ? `${patientProfile.heightCm} cm` : 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="number"
                        value={profileFormData.weightKg}
                        onChange={(e) => handleFormChange('weightKg', e.target.value)}
                        placeholder="e.g., 70"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.weightKg ? `${patientProfile.weightKg} kg` : 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 border-b pb-2">
                    Medical Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileFormData.allergies.join(', ')}
                        onChange={(e) => handleArrayFieldChange('allergies', e.target.value)}
                        placeholder="e.g., Penicillin, Shellfish, Pollen"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.allergies && patientProfile.allergies.length > 0 
                          ? patientProfile.allergies.join(', ') 
                          : 'None reported'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chronic Conditions
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileFormData.chronicConditions.join(', ')}
                        onChange={(e) => handleArrayFieldChange('chronicConditions', e.target.value)}
                        placeholder="e.g., Diabetes, Hypertension, Asthma"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.chronicConditions && patientProfile.chronicConditions.length > 0 
                          ? patientProfile.chronicConditions.join(', ') 
                          : 'None reported'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Family Medical Conditions <span className="text-xs text-gray-500">(Optional)</span>
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileFormData.familyConditions.join(', ')}
                        onChange={(e) => handleArrayFieldChange('familyConditions', e.target.value)}
                        placeholder="e.g., Heart disease, Cancer, Diabetes (in family members)"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.familyConditions && patientProfile.familyConditions.length > 0 
                          ? patientProfile.familyConditions.join(', ') 
                          : 'None reported'}
                      </p>
                    )}
                  </div>

                  {/* Medications - Read Only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Medications <span className="text-xs text-gray-500">(Doctor prescribed - Read only)</span>
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      {patientProfile.medications && patientProfile.medications.length > 0 ? (
                        <ul className="space-y-1">
                          {patientProfile.medications.map((medication, index) => (
                            <li key={index} className="text-gray-700 text-sm">
                              • {medication}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No medications prescribed</p>
                      )}
                    </div>
                  </div>

                  {/* Surgeries & Procedures - Read Only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Surgeries & Procedures <span className="text-xs text-gray-500">(Doctor managed - Read only)</span>
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      {patientProfile.surgeries && patientProfile.surgeries.length > 0 ? (
                        <div className="space-y-3">
                          {patientProfile.surgeries.map((surgery, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-gray-900 text-sm">{surgery.name}</h4>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      surgery.type === 'surgery' ? 'bg-red-100 text-red-800' :
                                      surgery.type === 'scan' ? 'bg-blue-100 text-blue-800' :
                                      surgery.type === 'procedure' ? 'bg-green-100 text-green-800' :
                                      'bg-purple-100 text-purple-800'
                                    }`}>
                                      {surgery.type?.charAt(0).toUpperCase() + surgery.type?.slice(1)}
                                    </span>
                                  </div>
                                  {surgery.description && (
                                    <p className="text-gray-600 text-sm mt-1">{surgery.description}</p>
                                  )}
                                  {surgery.results && (
                                    <p className="text-gray-700 text-sm mt-1 font-medium">Results: {surgery.results}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {surgery.date && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        Date: {new Date(surgery.date).toLocaleDateString()}
                                      </span>
                                    )}
                                    {surgery.hospital && (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        Hospital: {surgery.hospital}
                                      </span>
                                    )}
                                    {surgery.surgeon && (
                                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                        {surgery.type === 'scan' ? 'Radiologist' : 'Doctor'}: {surgery.surgeon}
                                      </span>
                                    )}
                                    {surgery.followUpRequired && (
                                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                        Follow-up Required
                                      </span>
                                    )}
                                    {surgery.followUpDate && (
                                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                        Follow-up: {new Date(surgery.followUpDate).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No surgeries or procedures recorded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileFormData.emergencyContact.name}
                        onChange={(e) => handleFormChange('emergencyContact.name', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.emergencyContact?.name || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="tel"
                        value={profileFormData.emergencyContact.phone}
                        onChange={(e) => handleFormChange('emergencyContact.phone', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.emergencyContact?.phone || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileFormData.emergencyContact.relation}
                        onChange={(e) => handleFormChange('emergencyContact.relation', e.target.value)}
                        placeholder="e.g., Spouse, Parent, Sibling"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.emergencyContact?.relation || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Insurance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provider
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileFormData.insurance.provider}
                        onChange={(e) => handleFormChange('insurance.provider', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.insurance?.provider || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Number
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileFormData.insurance.policyNo}
                        onChange={(e) => handleFormChange('insurance.policyNo', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {patientProfile.insurance?.policyNo || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Guardian Information (for under-16 patients) */}
              {patientProfile.dob && new Date().getFullYear() - new Date(patientProfile.dob).getFullYear() < 16 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Guardian Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guardian Name
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileFormData.guardian.name}
                          onChange={(e) => handleFormChange('guardian.name', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          {patientProfile.guardian?.name || 'Not provided'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileFormData.guardian.phone}
                          onChange={(e) => handleFormChange('guardian.phone', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          {patientProfile.guardian?.phone || 'Not provided'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileFormData.guardian.relationship}
                          onChange={(e) => handleFormChange('guardian.relationship', e.target.value)}
                          placeholder="e.g., Parent, Legal Guardian"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          {patientProfile.guardian?.relationship || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {isEditingProfile && (
                <div className="flex justify-end gap-2 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editingProfile}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
                </form>
              </>
            ) : (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  {/* Identity card */}
                  <div className="border rounded-lg p-5 bg-gray-50 h-full">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-teal-600 text-white flex items-center justify-center text-lg font-semibold">
                        {`${(user?.firstName || patientProfile.firstName || 'U')[0]}${(user?.lastName || patientProfile.lastName || 'N')[0]}`}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{`${patientProfile.firstName} ${patientProfile.lastName}`}</div>
                        <div className="text-sm text-gray-600">
                          {getAge(patientProfile.dob) !== null ? `${getAge(patientProfile.dob)} years` : 'Age N/A'} • {patientProfile.gender || 'other'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Date of Birth</div>
                        <div className="text-gray-900">{formatDate(patientProfile.dob)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">NIC</div>
                        <div className="text-gray-900">{patientProfile.nic || 'Not provided'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Blood Group</div>
                        <div className="text-gray-900">{patientProfile.bloodGroup || 'Not specified'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Allergies</div>
                        <div className="text-gray-900">{(patientProfile.allergies || []).length} item(s)</div>
                      </div>
                    </div>
                  </div>

                  {/* Right details card: emergency, insurance and summary combined */}
                  <div className="border rounded-lg p-5 h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Emergency Contact</div>
                        <div className="text-gray-900">{patientProfile.emergencyContact?.name || 'Not provided'}</div>
                        <div className="text-gray-700">{patientProfile.emergencyContact?.relation || '—'}</div>
                        <div className="text-gray-700">{patientProfile.emergencyContact?.phone || '—'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Insurance</div>
                        <div className="text-gray-900">{patientProfile.insurance?.provider || 'Not provided'}</div>
                        <div className="text-gray-700">{patientProfile.insurance?.policyNo || '—'}</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="text-gray-500 mb-1 text-sm">Summary</div>
                      <div className="flex flex-wrap gap-2">
                        {(patientProfile.chronicConditions || []).slice(0, 5).map((c, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full">{c}</span>
                        ))}
                        {(patientProfile.allergies || []).slice(0, 5).map((a, idx) => (
                          <span key={`a-${idx}`} className="px-2 py-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded-full">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Profile not found. Please contact support.</p>
            </div>
          )}
        </div>
      </section>

      {/* Medical History Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Medical History</h2>
            <p className="text-sm text-gray-600">Your medical records and health information</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadMedicalHistory}
              disabled={medicalHistoryLoading}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              {medicalHistoryLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => navigate('/medical-history')}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center gap-2 text-sm"
            >
              View Full History
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <MedicalHistory 
          medicalHistory={medicalHistory}
          loading={medicalHistoryLoading}
        />
      </section>

      {/* Patient Barcode Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">My Patient Barcode</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Show this barcode to hospital staff for quick check-in and identification. The barcode can be scanned by standard barcode scanners used in healthcare facilities. You can also save it to your phone for easy access.
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="bg-white border rounded-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading barcode...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Patient Barcode</h3>
                <p className="text-sm text-gray-600">Your unique identification code</p>
              </div>
              <button
                onClick={async () => {
                  if (patientProfile?.barcode) {
                    try {
                      // Create a temporary canvas for barcode generation
                      const canvas = document.createElement('canvas');
                      const tempDiv = document.createElement('div');
                      tempDiv.style.position = 'absolute';
                      tempDiv.style.left = '-9999px';
                      tempDiv.style.top = '-9999px';
                      document.body.appendChild(tempDiv);
                      tempDiv.appendChild(canvas);
                      
                      // Generate barcode using JsBarcode
                      const JsBarcode = (await import('jsbarcode')).default;
                      JsBarcode(canvas, patientProfile.barcode, {
                        format: "CODE128",
                        width: 2,
                        height: 80,
                        displayText: true,
                        fontSize: 14,
                        margin: 10,
                        background: "#ffffff",
                        lineColor: "#000000",
                        textAlign: "center",
                        textPosition: "bottom",
                        textMargin: 2
                      });
                      
                      // Convert to image and download
                      const link = document.createElement('a');
                      link.download = `patient-barcode-${user?._id || 'unknown'}.png`;
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                      
                      // Clean up
                      document.body.removeChild(tempDiv);
                    } catch (error) {
                      console.error('Barcode download error:', error);
                      // Fallback: download barcode number as text
                      const blob = new Blob([patientProfile.barcode], { type: 'text/plain' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `patient-barcode-${user?._id || 'unknown'}.txt`;
                      link.click();
                      window.URL.revokeObjectURL(url);
                    }
                  }
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center gap-2 text-sm"
              >
                <Download className="h-4 w-4" />
                Download Barcode
              </button>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-sm font-mono text-gray-600 mb-2">Barcode Number</div>
                <div className="text-lg font-semibold text-gray-900 break-all">
                  {patientProfile?.barcode || 'No barcode available'}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/appointments"
            className="group border bg-white/90 backdrop-blur-sm p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="bg-teal-50 p-2 rounded-md">
                <CalendarPlus className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Book Appointment</h3>
                <p className="text-sm text-gray-600">Choose a specialty and time slot</p>
              </div>
            </div>
          </Link>

          <Link
            to="/appointments/my"
            className="group border bg-white/90 backdrop-blur-sm p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="bg-teal-50 p-2 rounded-md">
                <CalendarDays className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">My Appointments</h3>
                <p className="text-sm text-gray-600">View and manage your bookings</p>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Patient Reports Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-md">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">My Reports</h2>
                <p className="text-sm text-gray-600">Status of your submitted reports</p>
              </div>
            </div>
            <button
              onClick={loadPatientReports}
              disabled={reportsLoading}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`h-3 w-3 ${reportsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {reportsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-600">Loading reports...</p>
            </div>
          ) : patientReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reports Submitted</h3>
              <p className="text-sm text-gray-500">
                You haven't submitted any reports yet. Use the "Report" button above to submit a report.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientReports.map((report) => (
                <div
                  key={report._id}
                  className={`border rounded-lg p-4 ${
                    report.status === 'new' ? 'border-red-200 bg-red-50' : 
                    report.status === 'read' ? 'border-yellow-200 bg-yellow-50' : 
                    'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${
                        report.priority === 'high' ? 'bg-red-100 text-red-600' :
                        report.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            report.priority === 'high' ? 'bg-red-100 text-red-700' :
                            report.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {report.priority.toUpperCase()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            report.status === 'new' ? 'bg-red-100 text-red-700' :
                            report.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {report.status === 'new' ? 'NEW' : 
                             report.status === 'read' ? 'READ BY DOCTOR' : 
                             'RESPONDED'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()} at{' '}
                      {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-800 whitespace-pre-wrap">{report.reportContent}</p>
                  </div>

                  {report.doctorResponse && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Doctor's Response:</h4>
                      <p className="text-blue-800 whitespace-pre-wrap">{report.doctorResponse}</p>
                      {report.respondedAt && (
                        <p className="text-xs text-blue-600 mt-2">
                          Responded on {new Date(report.respondedAt).toLocaleDateString()} at{' '}
                          {new Date(report.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      </main>
    </div>
  );
}
