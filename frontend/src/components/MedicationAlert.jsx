import React from 'react';
import { Pill, AlertTriangle, Clock, User, Activity } from 'lucide-react';

const MedicationAlert = ({ medications, surgeries, lastUpdated, updatedBy }) => {
  const hasMedications = medications && medications.length > 0;
  const hasSurgeries = surgeries && surgeries.length > 0;
  
  if (!hasMedications && !hasSurgeries) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'surgery': return 'bg-red-100 text-red-800 border-red-200';
      case 'scan': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'procedure': return 'bg-green-100 text-green-800 border-green-200';
      case 'treatment': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="p-2 bg-amber-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Pill className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800">
              Medical Records Update Alert
            </h3>
          </div>
          
          <p className="text-sm text-amber-700 mb-3">
            Your medical records have been updated by your healthcare provider. Please review the changes below.
          </p>
          
          {hasMedications && (
            <div className="bg-white rounded-lg p-3 border border-amber-200 mb-3">
              <h4 className="text-xs font-medium text-amber-800 mb-2 flex items-center gap-1">
                <Pill className="h-3 w-3" />
                Current Medications:
              </h4>
              <div className="flex flex-wrap gap-2">
                {medications.map((medication, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full border border-amber-200"
                  >
                    {medication}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hasSurgeries && (
            <div className="bg-white rounded-lg p-3 border border-amber-200 mb-3">
              <h4 className="text-xs font-medium text-amber-800 mb-2 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Recent Procedures & Surgeries:
              </h4>
              <div className="space-y-2">
                {surgeries.slice(0, 3).map((surgery, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(surgery.type)}`}>
                      {surgery.type?.charAt(0).toUpperCase() + surgery.type?.slice(1)}
                    </span>
                    <span className="text-xs text-gray-700 font-medium">{surgery.name}</span>
                    {surgery.date && (
                      <span className="text-xs text-gray-500">
                        ({new Date(surgery.date).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                ))}
                {surgeries.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{surgeries.length - 3} more procedures
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4 text-xs text-amber-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Updated: {formatDate(lastUpdated)}</span>
            </div>
            {updatedBy && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>By: {updatedBy}</span>
              </div>
            )}
          </div>
          
          <div className="mt-3 p-2 bg-amber-100 rounded border border-amber-200">
            <p className="text-xs text-amber-700">
              <strong>Important:</strong> Please consult with your healthcare provider if you have any questions about these updates or if you experience any concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationAlert;

