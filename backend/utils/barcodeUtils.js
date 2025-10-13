// barcodeUtils.js - Utility functions for barcode generation and validation

/**
 * Generate a scannable patient barcode following healthcare standards
 * @param {string} hospitalCode - Hospital identifier code
 * @param {number} patientId - Unique patient ID
 * @returns {string} Formatted barcode string
 */
function generatePatientBarcode(hospitalCode, patientId) {
  // Ensure hospital code is uppercase and alphanumeric
  const cleanHospitalCode = hospitalCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Pad patient ID to 6 digits
  const paddedPatientId = String(patientId).padStart(6, '0');
  
  // Format: PT-{HOSPITAL_CODE}-{PATIENT_ID}
  // This format is compatible with Code128 barcode standard
  const barcode = `PT-${cleanHospitalCode}-${paddedPatientId}`;
  
  return barcode;
}

/**
 * Validate barcode format
 * @param {string} barcode - Barcode string to validate
 * @returns {boolean} True if valid format
 */
function validateBarcodeFormat(barcode) {
  // Check if barcode matches expected format: PT-{CODE}-{ID}
  const barcodePattern = /^PT-[A-Z0-9]+-\d{6}$/;
  return barcodePattern.test(barcode);
}

/**
 * Extract patient ID from barcode
 * @param {string} barcode - Barcode string
 * @returns {number|null} Patient ID or null if invalid
 */
function extractPatientIdFromBarcode(barcode) {
  if (!validateBarcodeFormat(barcode)) {
    return null;
  }
  
  const parts = barcode.split('-');
  if (parts.length === 3 && parts[0] === 'PT') {
    return parseInt(parts[2], 10);
  }
  
  return null;
}

/**
 * Extract hospital code from barcode
 * @param {string} barcode - Barcode string
 * @returns {string|null} Hospital code or null if invalid
 */
function extractHospitalCodeFromBarcode(barcode) {
  if (!validateBarcodeFormat(barcode)) {
    return null;
  }
  
  const parts = barcode.split('-');
  if (parts.length === 3 && parts[0] === 'PT') {
    return parts[1];
  }
  
  return null;
}

module.exports = {
  generatePatientBarcode,
  validateBarcodeFormat,
  extractPatientIdFromBarcode,
  extractHospitalCodeFromBarcode
};
