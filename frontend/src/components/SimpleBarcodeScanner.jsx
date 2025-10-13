import React, { useState } from 'react';
import { Type, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const SimpleBarcodeScanner = ({ onScan, onError, isActive = true }) => {
  const [manualInput, setManualInput] = useState('');
  const [scanCount, setScanCount] = useState(0);

  // Handle manual barcode input
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      // Validate barcode format (PT-{HOSPITAL_CODE}-{PATIENT_ID})
      const barcodePattern = /^PT-[A-Z0-9]+-\d{6}$/;
      if (barcodePattern.test(manualInput.trim())) {
        setScanCount(prev => prev + 1);
        toast.success(`Barcode entered: ${manualInput.trim()}`, {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />
        });
        
        if (onScan) {
          onScan(manualInput.trim());
        }
        setManualInput('');
      } else {
        toast.error('Invalid barcode format. Expected: PT-{HOSPITAL_CODE}-{PATIENT_ID}', {
          icon: <AlertCircle className="h-5 w-5 text-red-600" />
        });
        if (onError) {
          onError(new Error('Invalid barcode format'));
        }
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Scanner Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Barcode Scanner</h3>
          {scanCount > 0 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {scanCount} scan{scanCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Type className="h-5 w-5 text-teal-600" />
          </div>
          <span className="text-sm text-teal-600 font-medium">Manual Input Mode</span>
        </div>
      </div>

      {/* Manual Input */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
            <Type className="h-16 w-16 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Manual Barcode Entry</h4>
          <p className="text-sm text-gray-600">
            Enter the patient's barcode manually
          </p>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Barcode
            </label>
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter barcode (e.g., PT-CGH-000031)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-center font-mono"
              disabled={!isActive}
            />
          </div>
          
          <button
            type="submit"
            disabled={!manualInput.trim() || !isActive}
            className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Look Up Patient
          </button>
        </form>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Instructions:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Enter the patient's barcode in the format: PT-{'{HOSPITAL_CODE}'}-{'{PATIENT_ID}'}</li>
          <li>• Example: PT-CGH-000031</li>
          <li>• The barcode can be found on the patient's dashboard or ID card</li>
          <li>• Patient details will appear automatically after successful entry</li>
        </ul>
      </div>

      {/* Camera Notice */}
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <h4 className="text-sm font-medium text-yellow-800">Camera Scanner Unavailable</h4>
        </div>
        <p className="text-xs text-yellow-700">
          Camera-based scanning is currently unavailable. Please use manual input to enter patient barcodes.
        </p>
      </div>
    </div>
  );
};

export default SimpleBarcodeScanner;
