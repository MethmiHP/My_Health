import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RotateCcw, AlertCircle, CheckCircle, Type } from 'lucide-react';
import { toast } from 'react-toastify';
import JsBarcode from 'jsbarcode';

// Dynamic import for ZXing to avoid Vite issues
let BrowserMultiFormatReader = null;
let BarcodeFormat = null;

const BarcodeScanner = ({ onScan, onError, isActive = true }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const streamRef = useRef(null);

  // Helper function to check if error is a NotFoundException
  const isNotFoundException = (error) => {
    return (
      error.name === 'NotFoundException' || 
      error.name === 'NotFoundException2' ||
      error.message?.includes('No MultiFormat Readers were able to detect') ||
      error.message?.includes('NotFoundException')
    );
  };

  // Initialize the barcode reader
  useEffect(() => {
    const initReader = async () => {
      try {
        const { BrowserMultiFormatReader: Reader, BarcodeFormat: Format } = await import('@zxing/library');
        BrowserMultiFormatReader = Reader;
        BarcodeFormat = Format;
        readerRef.current = new BrowserMultiFormatReader();
        
        // Get cameras after reader is initialized
        setTimeout(async () => {
          await getCameras();
        }, 100);
      } catch (error) {
        console.error('Failed to load ZXing library:', error);
        toast.error('Failed to initialize barcode scanner');
      }
    };
    
    initReader();
    
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
      stopCamera();
    };
  }, []);

  // Get available cameras
  const getCameras = async () => {
    if (!readerRef.current) {
      console.error('Barcode reader not initialized');
      return;
    }
    
    try {
      const videoInputDevices = await readerRef.current.listVideoInputDevices();
      console.log('Available cameras:', videoInputDevices);
      setDevices(videoInputDevices);
      
      // Prefer back camera if available (usually better for scanning)
      const backCamera = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      );
      
      if (backCamera) {
        setSelectedDevice(backCamera.deviceId);
        console.log('Selected back camera:', backCamera.deviceId);
      } else if (videoInputDevices.length > 0) {
        setSelectedDevice(videoInputDevices[0].deviceId);
        console.log('Selected first camera:', videoInputDevices[0].deviceId);
      } else {
        console.error('No cameras found');
        toast.error('No cameras found on this device');
      }
    } catch (error) {
      console.error('Error getting cameras:', error);
      toast.error('Failed to access camera devices');
    }
  };

  // Start camera and scanning
  const startScanning = async () => {
    if (!isActive || !readerRef.current || !BarcodeFormat) return;
    
    try {
      setIsScanning(true);
      setIsScanningActive(true);
      
      // Get cameras if not already loaded
      if (devices.length === 0) {
        await getCameras();
      }

      // Wait a bit for device selection to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!selectedDevice) {
        // Try to get cameras again and select the first one
        await getCameras();
        if (!selectedDevice && devices.length > 0) {
          setSelectedDevice(devices[0].deviceId);
        }
        
        if (!selectedDevice) {
          throw new Error('No camera device available');
        }
      }

       // Configure hints for better barcode detection
       const hints = new Map();
       
       // Only look for the formats we actually generate
       if (BarcodeFormat) {
         hints.set(BarcodeFormat.CODE_39, []);
         hints.set(BarcodeFormat.CODE_128, []);
       }
       
       // Format names for debugging
       const formatNames = {
         1: 'AZTEC',
         2: 'CODABAR', 
         3: 'CODE_39',
         4: 'CODE_93',
         5: 'CODE_128',
         6: 'DATA_MATRIX',
         7: 'EAN_8',
         8: 'EAN_13',
         9: 'ITF',
         10: 'MAXICODE',
         11: 'PDF_417',
         12: 'QR_CODE',
         13: 'RSS_14',
         14: 'RSS_EXPANDED',
         15: 'UPC_A',
         16: 'UPC_E',
         17: 'UPC_EAN_EXTENSION'
       };
       
       // Start camera with improved configuration
       const stream = await readerRef.current.decodeFromVideoDevice(
         selectedDevice,
         videoRef.current,
         (result, error) => {
           if (result) {
             const code = result.getText();
             console.log('🔍 Raw barcode result:', result);
             console.log('📝 Extracted text:', code);
             console.log('📊 Barcode format:', result.getBarcodeFormat());
             console.log('📊 Barcode format name:', formatNames[result.getBarcodeFormat()] || 'UNKNOWN');
             
             // Validate barcode format - should match PT-{HOSPITAL_CODE}-{PATIENT_ID}
             const barcodePattern = /^PT-[A-Z0-9]+-\d{6}$/;
             const isValidFormat = barcodePattern.test(code);
             
             console.log('✅ Barcode format validation:', isValidFormat);
             
             if (!isValidFormat) {
               console.warn('⚠️ Invalid barcode format detected:', code);
               console.log('⚠️ Barcode format:', formatNames[result.getBarcodeFormat()] || 'UNKNOWN');
               // Don't show toast for invalid formats, just log and ignore
               return; // Don't process invalid barcodes
             }
             
             // Prevent duplicate scans of the same code
             if (code !== lastScannedCode) {
               setLastScannedCode(code);
               setScanCount(prev => prev + 1);
               
               // Add visual feedback
               toast.success(`Barcode scanned: ${code}`, {
                 icon: <CheckCircle className="h-5 w-5 text-green-600" />
               });
               
               if (onScan) {
                 onScan(code);
               }
             }
           }
          
          // Completely ignore NotFoundException errors - they are normal when no barcode is detected
          if (error && !isNotFoundException(error) && isScanningActive) {
            console.error('Scanning error:', error);
            if (onError) {
              onError(error);
            }
           }
         },
         {
           hints: hints
         }
       );

      streamRef.current = stream;
      setHasPermission(true);
      
    } catch (error) {
      console.error('Error starting camera:', error);
      setIsScanning(false);
      setIsScanningActive(false);
      setHasPermission(false);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Camera permission denied. Please allow camera access.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera found. Please connect a camera device.');
      } else {
        toast.error('Failed to start camera: ' + error.message);
      }
      
      if (onError) {
        onError(error);
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (readerRef.current) {
      readerRef.current.reset();
    }
    
    setIsScanning(false);
    setIsScanningActive(false);
  };

  // Toggle scanning
  const toggleScanning = () => {
    if (isScanning) {
      stopCamera();
    } else {
      startScanning();
    }
  };

  // Switch camera
  const switchCamera = async () => {
    if (isScanning) {
      stopCamera();
      // Switch to next camera
      const currentIndex = devices.findIndex(device => device.deviceId === selectedDevice);
      const nextIndex = (currentIndex + 1) % devices.length;
      setSelectedDevice(devices[nextIndex].deviceId);
      
      // Restart scanning with new camera
      setTimeout(() => {
        startScanning();
      }, 500);
    }
  };

  // Request camera permission
  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      await getCameras();
      // Auto-start scanning after permission is granted
      setTimeout(() => {
        if (devices.length > 0) {
          startScanning();
        }
      }, 500);
    } catch (error) {
      setHasPermission(false);
      toast.error('Camera permission denied');
    }
  };

  // Handle manual barcode input
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      if (onScan) {
        onScan(manualInput.trim());
        setManualInput('');
        setShowManualInput(false);
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
           <button
             onClick={() => setShowManualInput(!showManualInput)}
             className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
             title="Manual Input"
           >
             <Type className="h-5 w-5" />
           </button>
           
           <button
             onClick={() => {
               // Test the patient lookup with the expected barcode
               console.log('🧪 Testing patient lookup with: PT-CGH-000032');
               if (onScan) {
                 onScan('PT-CGH-000032');
               }
             }}
             className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
             title="Test Patient Lookup"
           >
             🧪
           </button>
          
          {devices.length > 1 && (
            <button
              onClick={switchCamera}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Switch Camera"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          )}
          
          <button
            onClick={toggleScanning}
            disabled={!isActive}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isScanning
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            } ${!isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isScanning ? (
              <>
                <CameraOff className="h-4 w-4" />
                Stop Scanning
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                Start Scanning
              </>
            )}
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative bg-black rounded-lg overflow-hidden">
         <video
           ref={videoRef}
           className="w-full h-64 object-cover scale-x-[-1]"
           playsInline
           muted
         />
        
        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Scanning frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-32 border-2 border-teal-400 rounded-lg relative">
                {/* Corner indicators */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-teal-400"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-teal-400"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-teal-400"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-teal-400"></div>
                
                {/* Scanning line animation */}
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-teal-400 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                {isScanningActive ? 'Scanning for barcodes...' : 'Position the barcode within the frame'}
              </p>
            </div>
          </div>
        )}
        
        {/* Permission Request */}
        {hasPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="text-center text-white p-6">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
              <p className="text-sm mb-4">Please allow camera access to scan barcodes</p>
              <button
                onClick={requestPermission}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Allow Camera Access
              </button>
            </div>
          </div>
        )}
        
        {/* Inactive State */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="text-center text-white p-6">
              <CameraOff className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Scanner Inactive</h3>
              <p className="text-sm">Scanner is currently disabled</p>
            </div>
          </div>
        )}
      </div>

      {/* Manual Input */}
      {showManualInput && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Manual Barcode Input</h4>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter barcode manually (e.g., PT-CGH-000031)"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Camera Selection */}
      {devices.length > 1 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Camera:
          </label>
          <select
            value={selectedDevice || ''}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            disabled={isScanning}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </div>
      )}


       {/* Instructions */}
       <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
         <h4 className="text-sm font-medium text-blue-800 mb-2">Scanning Instructions:</h4>
         <ul className="text-xs text-blue-700 space-y-1">
           <li>• Position the patient's barcode within the scanning frame</li>
           <li>• Ensure good lighting and steady hands</li>
           <li>• The barcode should be clearly visible and not blurry</li>
           <li>• Patient details will appear automatically after successful scan</li>
         </ul>
       </div>
    </div>
  );
};

export default BarcodeScanner;
