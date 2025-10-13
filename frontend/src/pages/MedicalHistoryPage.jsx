import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, FileText, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getJSON, useAuthHeaders } from '../utils/api';
import MedicalHistory from '../components/MedicalHistory';

export default function MedicalHistoryPage() {
  const { user } = useAuth();
  const headers = useAuthHeaders();
  const navigate = useNavigate();
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMedicalHistory = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const data = await getJSON(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/medical-history/patient/${user._id}`,
        headers
      );
      setMedicalHistory(data.medicalHistory);
    } catch (error) {
      console.error('Failed to load medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicalHistory();
  }, [user?._id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text version of the medical history for download
    if (!medicalHistory) return;

    let content = `Medical History Report\n`;
    content += `Patient: ${user?.firstName} ${user?.lastName}\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n\n`;

    if (medicalHistory.bloodType) {
      content += `Blood Type: ${medicalHistory.bloodType}\n`;
    }

    if (medicalHistory.allergies && medicalHistory.allergies.length > 0) {
      content += `\nAllergies:\n`;
      medicalHistory.allergies.forEach(allergy => {
        content += `- ${allergy}\n`;
      });
    }

    if (medicalHistory.chronicConditions && medicalHistory.chronicConditions.length > 0) {
      content += `\nChronic Conditions:\n`;
      medicalHistory.chronicConditions.forEach(condition => {
        content += `- ${condition}\n`;
      });
    }

    if (medicalHistory.medications && medicalHistory.medications.length > 0) {
      content += `\nCurrent Medications:\n`;
      medicalHistory.medications.forEach(med => {
        content += `- ${med.name}: ${med.dosage} (${med.status})\n`;
      });
    }

    if (medicalHistory.diagnoses && medicalHistory.diagnoses.length > 0) {
      content += `\nDiagnoses:\n`;
      medicalHistory.diagnoses.forEach(diagnosis => {
        content += `- ${diagnosis.condition} (${diagnosis.status})\n`;
      });
    }

    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-history-${user?.firstName}-${user?.lastName}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-teal-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
                  <p className="text-gray-600">Complete medical records and health information</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadMedicalHistory}
                disabled={loading}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button
                onClick={handleDownload}
                disabled={loading || !medicalHistory}
                className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={handlePrint}
                disabled={loading || !medicalHistory}
                className="px-3 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Medical History Content */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <MedicalHistory 
          medicalHistory={medicalHistory}
          loading={loading}
        />
      </section>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            background: white !important;
          }
          
          .bg-gray-50 {
            background: white !important;
          }
          
          .bg-white {
            background: white !important;
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
          
          .text-gray-600 {
            color: #374151 !important;
          }
          
          .text-gray-900 {
            color: #111827 !important;
          }
        }
      `}</style>
    </main>
  );
}

