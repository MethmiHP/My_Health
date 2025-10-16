import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Stethoscope, 
  Pill, 
  FileText, 
  Calendar, 
  User, 
  AlertTriangle,
  TrendingUp,
  Shield,
  Users,
  ChevronDown,
  ChevronRight,
  Receipt,
  Clock
} from 'lucide-react';

export default function MedicalHistory({ medicalHistory, loading }) {
  const [expandedSections, setExpandedSections] = useState({
    prescriptions: true,
    medications: true,
    diagnoses: false,
    labResults: false,
    procedures: true,
    immunizations: false,
    familyHistory: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'abnormal': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'chronic': return 'text-orange-600 bg-orange-100';
      case 'discontinued': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      // Prescription statuses
      case 'prescribed': return 'text-blue-600 bg-blue-100';
      case 'filled': return 'text-green-600 bg-green-100';
      case 'refilled': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-600">Loading medical history...</p>
        </div>
      </div>
    );
  }

  if (!medicalHistory) {
    return (
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-sm">
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Medical History</h3>
          <p className="text-sm text-gray-500">
            Your medical history will appear here once records are added by your healthcare provider.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-sm">

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-900">{medicalHistory.bloodType || 'N/A'}</div>
          <div className="text-sm text-gray-600">Blood Type</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-900">{medicalHistory.allergies?.length || 0}</div>
          <div className="text-sm text-gray-600">Allergies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-900">{medicalHistory.chronicConditions?.length || 0}</div>
          <div className="text-sm text-gray-600">Chronic Conditions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-900">{medicalHistory.familyConditions?.length || 0}</div>
          <div className="text-sm text-gray-600">Family Conditions</div>
        </div>
      </div>

      {/* Allergies */}
      {medicalHistory.allergies && medicalHistory.allergies.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Allergies
          </h3>
          <div className="flex flex-wrap gap-2">
            {medicalHistory.allergies.map((allergy, index) => (
              <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chronic Conditions */}
      {medicalHistory.chronicConditions && medicalHistory.chronicConditions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-900 mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Chronic Conditions
          </h3>
          <div className="flex flex-wrap gap-2">
            {medicalHistory.chronicConditions.map((condition, index) => (
              <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Family Conditions */}
      {medicalHistory.familyConditions && medicalHistory.familyConditions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-900 mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Medical Conditions
          </h3>
          <div className="flex flex-wrap gap-2">
            {medicalHistory.familyConditions.map((condition, index) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Medications */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('medications')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-lg font-semibold text-teal-900 flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Current Medications ({medicalHistory.medications?.length || 0})
          </h3>
          {expandedSections.medications ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.medications && (
          <div className="space-y-3">
            {medicalHistory.medications && medicalHistory.medications.length > 0 ? (
              medicalHistory.medications.map((medication, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{medication.name}</h4>
                      <p className="text-sm text-gray-600">{medication.dosage}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(medication.status)}`}>
                      {medication.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Started: {formatDate(medication.startDate)}</p>
                    {medication.prescribedBy && <p>Prescribed by: {medication.prescribedBy}</p>}
                    {medication.reason && <p>Reason: {medication.reason}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No medications recorded</p>
            )}
          </div>
        )}
      </div>


      {/* Procedures (surgeries, scans, procedures) */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('procedures')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-lg font-semibold text-teal-900 flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Procedures ({medicalHistory.procedures?.length || 0})
          </h3>
          {expandedSections.procedures ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSections.procedures && (
          <div className="space-y-3">
            {medicalHistory.procedures && medicalHistory.procedures.length > 0 ? (
              medicalHistory.procedures.map((proc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{proc.procedureName}</h4>
                      {proc.type && (
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ml-2 ${
                          proc.type === 'surgery' ? 'bg-red-100 text-red-700' :
                          proc.type === 'scan' ? 'bg-blue-100 text-blue-700' :
                          proc.type === 'treatment' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {proc.type.charAt(0).toUpperCase() + proc.type.slice(1)}
                        </span>
                      )}
                      {proc.location && <p className="text-sm text-gray-600">Location: {proc.location}</p>}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {proc.procedureDate && <p>Date: {formatDate(proc.procedureDate)}</p>}
                    {proc.performedBy && <p>Performed by: {proc.performedBy}</p>}
                    {proc.notes && <p>Notes: {proc.notes}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No procedures recorded</p>
            )}
          </div>
        )}
      </div>

      {/* Prescriptions */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('prescriptions')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-lg font-semibold text-teal-900 flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Prescriptions ({medicalHistory.prescriptions?.length || 0})
          </h3>
          {expandedSections.prescriptions ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.prescriptions && (
          <div className="space-y-3">
            {medicalHistory.prescriptions && medicalHistory.prescriptions.length > 0 ? (
              medicalHistory.prescriptions.map((prescription, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{prescription.medicationName}</h4>
                      <p className="text-sm text-gray-600">{prescription.dosage}</p>
                      {prescription.prescriptionId && (
                        <p className="text-xs text-gray-500">Prescription ID: {prescription.prescriptionId}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                      {prescription.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Prescribed by:</strong> {prescription.prescribedBy}</p>
                      <p><strong>Prescribed:</strong> {formatDate(prescription.prescribedDate)}</p>
                      <p><strong>Start Date:</strong> {formatDate(prescription.startDate)}</p>
                      {prescription.endDate && (
                        <p><strong>End Date:</strong> {formatDate(prescription.endDate)}</p>
                      )}
                    </div>
                    <div>
                      {prescription.quantity && (
                        <p><strong>Quantity:</strong> {prescription.quantity}</p>
                      )}
                      {prescription.refills > 0 && (
                        <p><strong>Refills:</strong> {prescription.refillsUsed}/{prescription.refills}</p>
                      )}
                      {prescription.pharmacy && (
                        <p><strong>Pharmacy:</strong> {prescription.pharmacy}</p>
                      )}
                      {prescription.cost && (
                        <p><strong>Cost:</strong> ${prescription.cost}</p>
                      )}
                    </div>
                  </div>
                  
                  {prescription.instructions && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800"><strong>Instructions:</strong> {prescription.instructions}</p>
                    </div>
                  )}
                  
                  {prescription.reason && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600"><strong>Reason:</strong> {prescription.reason}</p>
                    </div>
                  )}
                  
                  {prescription.sideEffects && prescription.sideEffects.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600"><strong>Side Effects:</strong></p>
                      <ul className="text-sm text-gray-600 ml-4">
                        {prescription.sideEffects.map((effect, idx) => (
                          <li key={idx} className="list-disc">• {effect}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {prescription.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600"><strong>Notes:</strong> {prescription.notes}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No prescriptions recorded</p>
            )}
          </div>
        )}
      </div>

    

      {/* Last Updated */}
      {medicalHistory.lastUpdatedAt && (
        <div className="text-sm text-gray-500 text-center pt-4 border-t border-gray-200">
          Last updated: {formatDate(medicalHistory.lastUpdatedAt)}
          {medicalHistory.lastUpdatedBy && (
            <span> by {medicalHistory.lastUpdatedBy.firstName} {medicalHistory.lastUpdatedBy.lastName}</span>
          )}
        </div>
      )}
    </div>
  );
}
