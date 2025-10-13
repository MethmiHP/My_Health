import React, { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { Download, BarChart3, Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';

const BarcodeCard = ({ barcode, patientName, patientId }) => {
  const [copied, setCopied] = useState(false);
  const barcodeRef = useRef(null);

  // Generate barcode when component mounts or barcode changes
  useEffect(() => {
    if (barcode && barcodeRef.current) {
      try {
        // Clear previous barcode
        barcodeRef.current.innerHTML = '';
        
        // Create canvas element for barcode
        const canvas = document.createElement('canvas');
        barcodeRef.current.appendChild(canvas);
        
        // Generate barcode using Code128 format (most common for healthcare)
        console.log('🏷️ Generating barcode for:', barcode);
        console.log('🏷️ Barcode type:', typeof barcode);
        console.log('🏷️ Barcode length:', barcode.length);
        
        JsBarcode(canvas, barcode, {
          format: "CODE128",
          width: 2,
          height: 100,
          displayText: true,
          fontSize: 16,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000",
          textAlign: "center",
          textPosition: "bottom",
          textMargin: 2,
          valid: function(valid) {
            console.log('🔍 Barcode validation result:', valid);
          }
        });
        console.log('✅ Barcode generated successfully');
      } catch (error) {
        console.error('Barcode generation error:', error);
        toast.error('Failed to generate barcode');
      }
    }
  }, [barcode]);

  const handleCopyBarcode = async () => {
    try {
      await navigator.clipboard.writeText(barcode);
      setCopied(true);
      toast.success('Barcode copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy barcode');
    }
  };

  const handleDownloadBarcode = async () => {
    try {
      if (!barcodeRef.current) return;

      const canvas = await html2canvas(barcodeRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `patient-barcode-${patientId || 'unknown'}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('Barcode downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download barcode');
    }
  };

  if (!barcode) {
    return (
      <div className="rounded-2xl border border-teal-100 bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="rounded-full bg-gray-100 p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Barcode Available</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your patient barcode will be generated after registration with the hospital.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-2">
              <strong>How to get your barcode:</strong>
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Contact your hospital administrator</li>
              <li>• Complete your patient registration</li>
              <li>• Your unique barcode will be generated automatically</li>
              <li>• The barcode will appear here once created</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-teal-900">Your Patient Barcode</h3>
          <p className="text-sm text-teal-600">Keep this handy for hospital visits</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopyBarcode}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors border border-teal-200"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownloadBarcode}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Barcode
          </button>
        </div>
      </div>

      <div className="text-center">
        <div 
          ref={barcodeRef}
          className="inline-block p-6 bg-white border-2 border-teal-100 rounded-xl shadow-sm"
        >
          {/* Barcode will be generated here by JsBarcode */}
        </div>
        
        <div className="mt-6">
          <div className="bg-teal-50 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium text-teal-800 mb-1">Patient Name</p>
            <p className="text-lg font-semibold text-teal-900">{patientName}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2 font-medium">Barcode Number</p>
            <p className="font-mono text-sm font-semibold text-gray-800 break-all bg-white p-2 rounded border">
              {barcode}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium text-blue-800">How to use your barcode</p>
          </div>
          <p className="text-xs text-blue-700">
            Show this barcode to hospital staff for quick check-in and identification. 
            The barcode can be scanned by standard barcode scanners used in healthcare facilities.
            You can also save it to your phone for easy access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeCard;
