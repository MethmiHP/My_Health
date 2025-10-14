// // ============================================
// // 2. MEDICATION PRICES (utils/medicationPrices.js)
// // ============================================
// // Hardcoded medication prices (in Rs.)
// const MEDICATION_PRICES = {
//   'paracetamol': 50,
//   'amoxicillin': 150,
//   'ibuprofen': 80,
//   'metformin': 200,
//   'omeprazole': 120,
//   'aspirin': 40,
//   'cetirizine': 90,
//   'azithromycin': 250,
//   'amlodipine': 180,
//   'losartan': 220,
//   'atorvastatin': 300,
//   'levothyroxine': 160,
//   'albuterol': 350,
//   'prednisone': 140,
//   'clopidogrel': 280,
//   'lisinopril': 190,
//   'gabapentin': 270,
//   'pantoprazole': 130,
//   'furosemide': 110,
//   'ciprofloxacin': 200
// };

// // Function to get medication price
// const getMedicationPrice = (medicationName) => {
//   const normalized = medicationName.toLowerCase().trim();
//   return MEDICATION_PRICES[normalized] || 100; // Default price if not found
// };

// // Function to calculate bill
// const calculateMedicationBill = (medications) => {
//   if (!Array.isArray(medications) || medications.length === 0) {
//     return { items: [], subtotal: 0, total: 0 };
//   }

//   const items = medications.map(med => {
//     const medName = typeof med === 'string' ? med : med.name;
//     const quantity = (typeof med === 'object' && med.quantity) ? med.quantity : 1;
//     const unitPrice = getMedicationPrice(medName);
//     const totalPrice = unitPrice * quantity;

//     return {
//       name: medName,
//       quantity,
//       unitPrice,
//       totalPrice
//     };
//   });

//   const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
//   return {
//     items,
//     subtotal,
//     tax: 0, // Can add tax calculation if needed
//     discount: 0,
//     total: subtotal
//   };
// };

// module.exports = {
//   MEDICATION_PRICES,
//   getMedicationPrice,
//   calculateMedicationBill
// };


// backend/utils/medicationPrices.js - UPDATED VERSION

// Hardcoded medication prices (in Rs.)
const MEDICATION_PRICES = {
  'paracetamol': 50,
  'amoxicillin': 150,
  'ibuprofen': 80,
  'metformin': 200,
  'omeprazole': 120,
  'aspirin': 40,
  'cetirizine': 90,
  'azithromycin': 250,
  'amlodipine': 180,
  'losartan': 220,
  'atorvastatin': 300,
  'levothyroxine': 160,
  'albuterol': 350,
  'prednisone': 140,
  'clopidogrel': 280,
  'lisinopril': 190,
  'gabapentin': 270,
  'pantoprazole': 130,
  'furosemide': 110,
  'ciprofloxacin': 200
};

// Hardcoded surgery prices (in Rs.)
const SURGERY_PRICES = {
  'appendectomy': 150000,
  'cholecystectomy': 200000,
  'hernia repair': 120000,
  'cesarean section': 180000,
  'knee replacement': 500000,
  'hip replacement': 550000,
  'cataract surgery': 80000,
  'tonsillectomy': 75000,
  'hemorrhoidectomy': 100000,
  'thyroidectomy': 250000,
  'mastectomy': 300000,
  'hysterectomy': 220000,
  'coronary bypass': 800000,
  'angioplasty': 450000,
  'spinal fusion': 600000,
  'cardiac surgery': 750000,
  'general surgery': 100000
};

// Hardcoded procedure/scan prices (in Rs.)
const PROCEDURE_PRICES = {
  // Scans
  'x-ray': 2500,
  'ct scan': 15000,
  'mri scan': 25000,
  'ultrasound': 3500,
  'ecg': 1500,
  'echocardiogram': 8000,
  'mammogram': 5000,
  'pet scan': 35000,
  'bone density scan': 4000,
  'doppler ultrasound': 6000,
  
  // Procedures
  'endoscopy': 12000,
  'colonoscopy': 18000,
  'biopsy': 10000,
  'blood test': 1000,
  'urine test': 500,
  'dialysis': 8000,
  'chemotherapy session': 50000,
  'radiation therapy': 40000,
  'physical therapy': 3000,
  'wound dressing': 1500,
  'injection': 800,
  'iv therapy': 5000,
  'nebulization': 1200,
  'catheterization': 7000,
  'minor procedure': 5000,
  'consultation': 2000
};

// Function to get medication price
const getMedicationPrice = (medicationName) => {
  const normalized = medicationName.toLowerCase().trim();
  return MEDICATION_PRICES[normalized] || 100; // Default price if not found
};

// Function to get surgery price
const getSurgeryPrice = (surgeryName) => {
  const normalized = surgeryName.toLowerCase().trim();
  return SURGERY_PRICES[normalized] || 50000; // Default surgery price
};

// Function to get procedure price
const getProcedurePrice = (procedureName) => {
  const normalized = procedureName.toLowerCase().trim();
  return PROCEDURE_PRICES[normalized] || 5000; // Default procedure price
};

// Function to calculate bill including medications, surgeries, procedures, and appointment fee
const calculateMedicationBill = (medications, surgeries = [], procedures = [], appointmentFee = 0) => {
  const items = [];
  
  // Add medications
  if (Array.isArray(medications) && medications.length > 0) {
    medications.forEach(med => {
      const medName = typeof med === 'string' ? med : med.name;
      const quantity = (typeof med === 'object' && med.quantity) ? med.quantity : 1;
      const unitPrice = getMedicationPrice(medName);
      const totalPrice = unitPrice * quantity;

      items.push({
        type: 'medication',
        name: medName,
        quantity,
        unitPrice,
        totalPrice
      });
    });
  }

  // Add surgeries
  if (Array.isArray(surgeries) && surgeries.length > 0) {
    surgeries.forEach(surgery => {
      const surgeryName = typeof surgery === 'string' ? surgery : surgery.name;
      const unitPrice = getSurgeryPrice(surgeryName);

      items.push({
        type: 'surgery',
        name: surgeryName,
        quantity: 1,
        unitPrice,
        totalPrice: unitPrice
      });
    });
  }

  // Add procedures (scans, treatments, etc.)
  if (Array.isArray(procedures) && procedures.length > 0) {
    procedures.forEach(procedure => {
      const procedureName = typeof procedure === 'string' ? procedure : procedure.name;
      const quantity = (typeof procedure === 'object' && procedure.quantity) ? procedure.quantity : 1;
      const unitPrice = getProcedurePrice(procedureName);
      const totalPrice = unitPrice * quantity;

      items.push({
        type: 'procedure',
        name: procedureName,
        quantity,
        unitPrice,
        totalPrice
      });
    });
  }

  // Add appointment fee if provided
  if (appointmentFee && appointmentFee > 0) {
    items.push({
      type: 'appointment',
      name: 'Doctor Consultation Fee',
      quantity: 1,
      unitPrice: appointmentFee,
      totalPrice: appointmentFee
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    items,
    subtotal,
    tax: 0, // Can add tax calculation if needed
    discount: 0,
    total: subtotal
  };
};

module.exports = {
  MEDICATION_PRICES,
  SURGERY_PRICES,
  PROCEDURE_PRICES,
  getMedicationPrice,
  getSurgeryPrice,
  getProcedurePrice,
  calculateMedicationBill
};