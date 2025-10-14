// // components/Receipt.jsx
// import React from 'react';
// import { Download, Printer, X, CheckCircle } from 'lucide-react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// export default function Receipt({ receiptData, onClose }) {
//   if (!receiptData) return null;

//   const {
//     receiptNumber,
//     visitId,
//     createdAt,
//     patient,
//     medications,
//     subtotal,
//     tax,
//     discount,
//     totalAmount,
//     paymentMethod,
//     paymentDetails,
//     cashier,
//     hospital
//   } = receiptData;

//   // Format date
//   const formatDate = (date) => {
//     return new Date(date).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Generate PDF
//   const generatePDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     let yPos = 20;

//     // Hospital Header
//     doc.setFontSize(20);
//     doc.setFont('helvetica', 'bold');
//     doc.text(hospital?.name || 'SmartCare Hospital', pageWidth / 2, yPos, { align: 'center' });
    
//     yPos += 8;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.text(hospital?.address || 'Hospital Address', pageWidth / 2, yPos, { align: 'center' });
    
//     yPos += 5;
//     doc.text(`Phone: ${hospital?.phone || 'N/A'}`, pageWidth / 2, yPos, { align: 'center' });
    
//     // Line separator
//     yPos += 10;
//     doc.setLineWidth(0.5);
//     doc.line(20, yPos, pageWidth - 20, yPos);
    
//     // Receipt Title
//     yPos += 10;
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.text('PAYMENT RECEIPT', pageWidth / 2, yPos, { align: 'center' });
    
//     // Receipt Details
//     yPos += 10;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
    
//     const leftCol = 20;
//     const rightCol = pageWidth / 2 + 10;
    
//     // Left column
//     doc.setFont('helvetica', 'bold');
//     doc.text('Receipt No:', leftCol, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(receiptNumber, leftCol + 30, yPos);
    
//     // Right column
//     doc.setFont('helvetica', 'bold');
//     doc.text('Date:', rightCol, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(formatDate(createdAt), rightCol + 15, yPos);
    
//     yPos += 7;
//     doc.setFont('helvetica', 'bold');
//     doc.text('Visit ID:', leftCol, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(visitId, leftCol + 30, yPos);
    
//     // Patient Information Section
//     yPos += 15;
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Patient Information', leftCol, yPos);
    
//     yPos += 7;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`Name: ${patient?.name || 'N/A'}`, leftCol, yPos);
    
//     yPos += 6;
//     doc.text(`NIC: ${patient?.nic || 'N/A'}`, leftCol, yPos);
    
//     yPos += 6;
//     doc.text(`Barcode: ${patient?.barcode || 'N/A'}`, leftCol, yPos);
    
//     yPos += 6;
//     doc.text(`Phone: ${patient?.phone || 'N/A'}`, leftCol, yPos);
    
//     // Medications Table
//     yPos += 15;
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Medications', leftCol, yPos);
    
//     yPos += 5;
    
//     const tableData = medications.map(med => [
//       med.name,
//       med.quantity.toString(),
//       `Rs. ${med.unitPrice.toFixed(2)}`,
//       `Rs. ${med.totalPrice.toFixed(2)}`
//     ]);
    
//     doc.autoTable({
//       startY: yPos,
//       head: [['Medication', 'Qty', 'Unit Price', 'Total']],
//       body: tableData,
//       theme: 'grid',
//       headStyles: { fillColor: [13, 148, 136], textColor: 255, fontStyle: 'bold' },
//       styles: { fontSize: 9, cellPadding: 3 },
//       columnStyles: {
//         0: { cellWidth: 70 },
//         1: { cellWidth: 30, halign: 'center' },
//         2: { cellWidth: 40, halign: 'right' },
//         3: { cellWidth: 40, halign: 'right' }
//       }
//     });
    
//     yPos = doc.lastAutoTable.finalY + 10;
    
//     // Totals Section
//     const totalsX = pageWidth - 80;
//     doc.setFontSize(10);
    
//     doc.setFont('helvetica', 'normal');
//     doc.text('Subtotal:', totalsX, yPos);
//     doc.text(`Rs. ${subtotal.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' });
    
//     if (tax > 0) {
//       yPos += 6;
//       doc.text('Tax:', totalsX, yPos);
//       doc.text(`Rs. ${tax.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' });
//     }
    
//     if (discount > 0) {
//       yPos += 6;
//       doc.text('Discount:', totalsX, yPos);
//       doc.text(`-Rs. ${discount.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' });
//     }
    
//     yPos += 8;
//     doc.setLineWidth(0.3);
//     doc.line(totalsX, yPos, totalsX + 40, yPos);
    
//     yPos += 6;
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(12);
//     doc.text('Total Amount:', totalsX, yPos);
//     doc.text(`Rs. ${totalAmount.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' });
    
//     // Payment Information
//     yPos += 15;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Payment Information', leftCol, yPos);
    
//     yPos += 7;
//     doc.setFont('helvetica', 'normal');
//     doc.text(`Method: ${paymentMethod.toUpperCase()}`, leftCol, yPos);
    
//     if (paymentMethod === 'cash' && paymentDetails?.amountTendered) {
//       yPos += 6;
//       doc.text(`Amount Tendered: Rs. ${paymentDetails.amountTendered.toFixed(2)}`, leftCol, yPos);
//       yPos += 6;
//       doc.text(`Change: Rs. ${paymentDetails.change.toFixed(2)}`, leftCol, yPos);
//     }
    
//     if ((paymentMethod === 'card' || paymentMethod === 'mobile') && paymentDetails?.authorizationCode) {
//       yPos += 6;
//       doc.text(`Authorization Code: ${paymentDetails.authorizationCode}`, leftCol, yPos);
      
//       if (paymentDetails?.transactionId) {
//         yPos += 6;
//         doc.text(`Transaction ID: ${paymentDetails.transactionId}`, leftCol, yPos);
//       }
//     }
    
//     // Cashier Information
//     yPos += 10;
//     doc.text(`Served by: ${cashier?.firstName || ''} ${cashier?.lastName || ''}`, leftCol, yPos);
    
//     // Footer
//     yPos = doc.internal.pageSize.getHeight() - 30;
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'italic');
//     doc.text('Thank you for choosing SmartCare!', pageWidth / 2, yPos, { align: 'center' });
    
//     yPos += 5;
//     doc.text('Please keep this receipt for your records.', pageWidth / 2, yPos, { align: 'center' });
    
//     // Save PDF
//     doc.save(`Receipt_${receiptNumber}.pdf`);
//   };

//   // Print Receipt
//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="rounded-full bg-green-100 p-2">
//               <CheckCircle className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">Payment Successful</h2>
//               <p className="text-sm text-gray-600">Receipt #{receiptNumber}</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Receipt Content */}
//         <div className="p-6" id="receipt-content">
//           {/* Hospital Info */}
//           <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
//             <h3 className="text-2xl font-bold text-teal-900">
//               {hospital?.name || 'SmartCare Hospital'}
//             </h3>
//             <p className="text-sm text-gray-600 mt-1">
//               {hospital?.address || 'Hospital Address'}
//             </p>
//             <p className="text-sm text-gray-600">
//               Phone: {hospital?.phone || 'N/A'}
//             </p>
//           </div>

//           {/* Receipt Details */}
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <div>
//               <p className="text-sm text-gray-600">Receipt Number</p>
//               <p className="font-semibold text-gray-900">{receiptNumber}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Date & Time</p>
//               <p className="font-semibold text-gray-900">{formatDate(createdAt)}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Visit ID</p>
//               <p className="font-mono text-sm text-gray-900">{visitId}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Payment Status</p>
//               <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
//                 Completed
//               </span>
//             </div>
//           </div>

//           {/* Patient Information */}
//           <div className="mb-6 bg-gray-50 rounded-lg p-4">
//             <h4 className="text-sm font-bold text-gray-900 mb-3">Patient Information</h4>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <span className="text-gray-600">Name:</span>
//                 <span className="ml-2 font-medium text-gray-900">{patient?.name}</span>
//               </div>
//               <div>
//                 <span className="text-gray-600">NIC:</span>
//                 <span className="ml-2 font-medium text-gray-900">{patient?.nic}</span>
//               </div>
//               <div>
//                 <span className="text-gray-600">Barcode:</span>
//                 <span className="ml-2 font-mono text-xs text-gray-900">{patient?.barcode}</span>
//               </div>
//               <div>
//                 <span className="text-gray-600">Phone:</span>
//                 <span className="ml-2 font-medium text-gray-900">{patient?.phone || 'N/A'}</span>
//               </div>
//             </div>
//           </div>

//           {/* Medications Table */}
//           <div className="mb-6">
//             <h4 className="text-sm font-bold text-gray-900 mb-3">Medications</h4>
//             <div className="border border-gray-200 rounded-lg overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-teal-600 text-white">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-xs font-semibold">Medication</th>
//                     <th className="px-4 py-2 text-center text-xs font-semibold">Qty</th>
//                     <th className="px-4 py-2 text-right text-xs font-semibold">Unit Price</th>
//                     <th className="px-4 py-2 text-right text-xs font-semibold">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {medications.map((med, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 text-sm text-gray-900 capitalize">{med.name}</td>
//                       <td className="px-4 py-3 text-sm text-gray-900 text-center">{med.quantity}</td>
//                       <td className="px-4 py-3 text-sm text-gray-900 text-right">
//                         Rs. {med.unitPrice.toFixed(2)}
//                       </td>
//                       <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
//                         Rs. {med.totalPrice.toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Payment Summary */}
//           <div className="mb-6 bg-gray-50 rounded-lg p-4">
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Subtotal:</span>
//                 <span className="font-medium text-gray-900">Rs. {subtotal.toFixed(2)}</span>
//               </div>
//               {tax > 0 && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Tax:</span>
//                   <span className="font-medium text-gray-900">Rs. {tax.toFixed(2)}</span>
//                 </div>
//               )}
//               {discount > 0 && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Discount:</span>
//                   <span className="font-medium text-green-600">-Rs. {discount.toFixed(2)}</span>
//                 </div>
//               )}
//               <div className="pt-2 border-t-2 border-gray-300 flex justify-between">
//                 <span className="text-base font-bold text-gray-900">Total Amount:</span>
//                 <span className="text-lg font-bold text-teal-600">
//                   Rs. {totalAmount.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div className="mb-6 bg-gray-50 rounded-lg p-4">
//             <h4 className="text-sm font-bold text-gray-900 mb-3">Payment Details</h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Payment Method:</span>
//                 <span className="font-medium text-gray-900 uppercase">{paymentMethod}</span>
//               </div>
//               {paymentMethod === 'cash' && paymentDetails?.amountTendered && (
//                 <>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Amount Tendered:</span>
//                     <span className="font-medium text-gray-900">
//                       Rs. {paymentDetails.amountTendered.toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Change Given:</span>
//                     <span className="font-medium text-green-600">
//                       Rs. {paymentDetails.change.toFixed(2)}
//                     </span>
//                   </div>
//                 </>
//               )}
//               {(paymentMethod === 'card' || paymentMethod === 'mobile') && paymentDetails?.authorizationCode && (
//                 <>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Authorization Code:</span>
//                     <span className="font-mono text-xs text-gray-900">
//                       {paymentDetails.authorizationCode}
//                     </span>
//                   </div>
//                   {paymentDetails?.transactionId && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Transaction ID:</span>
//                       <span className="font-mono text-xs text-gray-900">
//                         {paymentDetails.transactionId}
//                       </span>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Footer Info */}
//           <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-4">
//             <p>Served by: {cashier?.firstName} {cashier?.lastName}</p>
//             <p className="mt-2 font-semibold">Thank you for choosing SmartCare!</p>
//             <p className="text-xs mt-1">Please keep this receipt for your records.</p>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
//           {/* <button
//             onClick={generatePDF}
//             className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 font-medium"
//           >
//             <Download className="h-5 w-5" />
//             Download PDF
//           </button> */}
//           <button
//             onClick={handlePrint}
//             className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium"
//           >
//             <Printer className="h-5 w-5" />
//             Print Receipt
//           </button>
//           <button
//             onClick={onClose}
//             className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// // components/Receipt.jsx - Complete Updated Version with Insurance Support
// import React from 'react';
// import { Download, Printer, X, CheckCircle, Shield, AlertCircle } from 'lucide-react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// export default function Receipt({ receiptData, onClose }) {
//   if (!receiptData) return null;

//   const {
//     receiptNumber,
//     visitId,
//     createdAt,
//     patient,
//     medications,
//     subtotal,
//     tax,
//     discount,
//     totalAmount,
//     paymentMethod,
//     paymentStatus,
//     paymentDetails,
//     insuranceClaimNumber,
//     cashier,
//     hospital
//   } = receiptData;

//   const isInsurance = paymentMethod === 'insurance';
//   const isPending = paymentStatus === 'pending';

//   // Format date
//   const formatDate = (date) => {
//     return new Date(date).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Generate PDF
//   const generatePDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     let yPos = 20;

//     // Hospital Header
//     doc.setFontSize(20);
//     doc.setFont('helvetica', 'bold');
//     doc.text(hospital?.name || 'SmartCare Hospital', pageWidth / 2, yPos, { align: 'center' });
    
//     yPos += 8;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.text(hospital?.address || 'Hospital Address', pageWidth / 2, yPos, { align: 'center' });
    
//     yPos += 5;
//     doc.text(`Phone: ${hospital?.phone || 'N/A'}`, pageWidth / 2, yPos, { align: 'center' });
    
//     // Line separator
//     yPos += 10;
//     doc.setLineWidth(0.5);
//     doc.line(20, yPos, pageWidth - 20, yPos);
    
//     // Receipt Title
//     yPos += 10;
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.text('PAYMENT RECEIPT', pageWidth / 2, yPos, { align: 'center' });
    
//     // Pending Status Warning (if insurance)
//     if (isPending) {
//       yPos += 10;
//       doc.setFontSize(12);
//       doc.setTextColor(180, 83, 9); // Orange color
//       doc.text('*** PAYMENT PENDING VERIFICATION ***', pageWidth / 2, yPos, { align: 'center' });
//       doc.setTextColor(0, 0, 0); // Reset to black
//     }
    
//     // Receipt Details
//     yPos += 10;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
    
//     const leftCol = 20;
//     const rightCol = pageWidth / 2 + 10;
    
//     // Left column
//     doc.setFont('helvetica', 'bold');
//     doc.text('Receipt No:', leftCol, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(receiptNumber, leftCol + 30, yPos);
    
//     // Right column
//     doc.setFont('helvetica', 'bold');
//     doc.text('Date:', rightCol, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(formatDate(createdAt), rightCol + 15, yPos);
    
//     yPos += 7;
//     doc.setFont('helvetica', 'bold');
//     doc.text('Visit ID:', leftCol, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(visitId, leftCol + 30, yPos);
    
//     doc.setFont('helvetica', 'bold');
//     doc.text('Status:', rightCol, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(paymentStatus.toUpperCase(), rightCol + 15, yPos);
    
//     // Insurance Claim Number (if applicable)
//     if (isInsurance && insuranceClaimNumber) {
//       yPos += 7;
//       doc.setFont('helvetica', 'bold');
//       doc.text('Claim No:', leftCol, yPos);
//       doc.setFont('helvetica', 'normal');
//       doc.text(insuranceClaimNumber, leftCol + 30, yPos);
//     }
    
//     // Patient Information Section
//     yPos += 15;
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Patient Information', leftCol, yPos);
    
//     yPos += 7;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`Name: ${patient?.name || 'N/A'}`, leftCol, yPos);
    
//     yPos += 6;
//     doc.text(`NIC: ${patient?.nic || 'N/A'}`, leftCol, yPos);
    
//     yPos += 6;
//     doc.text(`Barcode: ${patient?.barcode || 'N/A'}`, leftCol, yPos);
    
//     yPos += 6;
//     doc.text(`Phone: ${patient?.phone || 'N/A'}`, leftCol, yPos);
    
//     // Medications Table
//     yPos += 15;
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Medications', leftCol, yPos);
    
//     yPos += 5;
    
//     const tableData = medications.map(med => [
//       med.name,
//       med.quantity.toString(),
//       `Rs. ${med.unitPrice.toFixed(2)}`,
//       `Rs. ${med.totalPrice.toFixed(2)}`
//     ]);
    
//     doc.autoTable({
//       startY: yPos,
//       head: [['Medication', 'Qty', 'Unit Price', 'Total']],
//       body: tableData,
//       theme: 'grid',
//       headStyles: { fillColor: [13, 148, 136], textColor: 255, fontStyle: 'bold' },
//       styles: { fontSize: 9, cellPadding: 3 },
//       columnStyles: {
//         0: { cellWidth: 70 },
//         1: { cellWidth: 30, halign: 'center' },
//         2: { cellWidth: 40, halign: 'right' },
//         3: { cellWidth: 40, halign: 'right' }
//       }
//     });
    
//     yPos = doc.lastAutoTable.finalY + 10;
    
//     // Totals Section
//     const totalsX = pageWidth - 80;
//     doc.setFontSize(10);
    
//     doc.setFont('helvetica', 'normal');
//     doc.text('Subtotal:', totalsX, yPos);
//     doc.text(`Rs. ${subtotal.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' });
    
//     if (tax > 0) {
//       yPos += 6;
//       doc.text('Tax:', totalsX, yPos);
//       doc.text(`Rs. ${tax.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' });
//     }
    
//     if (discount > 0) {
//       yPos += 6;
//       doc.text('Discount:', totalsX, yPos);
//       doc.text(`-Rs. ${discount.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' });
//     }
    
//     yPos += 8;
//     doc.setLineWidth(0.3);
//     doc.line(totalsX, yPos, totalsX + 40, yPos);
    
//     yPos += 6;
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(12);
//     doc.text('Total Amount:', totalsX, yPos);
//     doc.text(`Rs. ${totalAmount.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' });
    
//     // Payment Information
//     yPos += 15;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Payment Information', leftCol, yPos);
    
//     yPos += 7;
//     doc.setFont('helvetica', 'normal');
//     doc.text(`Method: ${paymentMethod.toUpperCase()}`, leftCol, yPos);
    
//     // Cash payment details
//     if (paymentMethod === 'cash' && paymentDetails?.amountTendered) {
//       yPos += 6;
//       doc.text(`Amount Tendered: Rs. ${paymentDetails.amountTendered.toFixed(2)}`, leftCol, yPos);
//       yPos += 6;
//       doc.text(`Change: Rs. ${paymentDetails.change.toFixed(2)}`, leftCol, yPos);
//     }
    
//     // Card payment details
//     if (paymentMethod === 'card' && paymentDetails?.authorizationCode) {
//       yPos += 6;
//       doc.text(`Authorization Code: ${paymentDetails.authorizationCode}`, leftCol, yPos);
      
//       if (paymentDetails?.transactionId) {
//         yPos += 6;
//         doc.text(`Transaction ID: ${paymentDetails.transactionId}`, leftCol, yPos);
//       }
      
//       if (paymentDetails?.cardLast4) {
//         yPos += 6;
//         doc.text(`Card: **** **** **** ${paymentDetails.cardLast4}`, leftCol, yPos);
//       }
//     }
    
//     // Insurance payment details
//     if (isInsurance && paymentDetails) {
//       yPos += 8;
//       doc.setFont('helvetica', 'bold');
//       doc.text('Insurance Details:', leftCol, yPos);
      
//       yPos += 6;
//       doc.setFont('helvetica', 'normal');
//       doc.text(`Company: ${paymentDetails.insuranceName}`, leftCol, yPos);
      
//       yPos += 6;
//       doc.text(`Location: ${paymentDetails.insuranceLocation}`, leftCol, yPos);
      
//       yPos += 6;
//       doc.text(`Coverage: Rs. ${paymentDetails.insuranceAmount.toFixed(2)}`, leftCol, yPos);
      
//       yPos += 6;
//       doc.setFont('helvetica', 'bold');
//       doc.text(`Patient Responsibility: Rs. ${(totalAmount - paymentDetails.insuranceAmount).toFixed(2)}`, leftCol, yPos);
//     }
    
//     // Cashier Information
//     yPos += 10;
//     doc.setFont('helvetica', 'normal');
//     doc.text(`Served by: ${cashier?.firstName || ''} ${cashier?.lastName || ''}`, leftCol, yPos);
    
//     // Footer
//     yPos = doc.internal.pageSize.getHeight() - 30;
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'italic');
//     doc.text('Thank you for choosing SmartCare!', pageWidth / 2, yPos, { align: 'center' });
    
//     yPos += 5;
//     doc.text('Please keep this receipt for your records.', pageWidth / 2, yPos, { align: 'center' });
    
//     if (isInsurance) {
//       yPos += 5;
//       doc.text('* Insurance claims are subject to verification and approval.', pageWidth / 2, yPos, { align: 'center' });
//     }
    
//     // Save PDF
//     doc.save(`Receipt_${receiptNumber}.pdf`);
//   };

//   // Print Receipt
//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className={`rounded-full p-2 ${isPending ? 'bg-yellow-100' : 'bg-green-100'}`}>
//               {isPending ? (
//                 <AlertCircle className="h-6 w-6 text-yellow-600" />
//               ) : (
//                 <CheckCircle className="h-6 w-6 text-green-600" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 {isPending ? 'Payment Pending' : 'Payment Successful'}
//               </h2>
//               <p className="text-sm text-gray-600">Receipt #{receiptNumber}</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Receipt Content */}
//         <div className="p-6" id="receipt-content">
//           {/* Pending Status Banner */}
//           {isPending && (
//             <div className="mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 flex items-start gap-3">
//               <Shield className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
//               <div>
//                 <h3 className="font-bold text-yellow-900 text-base mb-1">Payment Pending Verification</h3>
//                 <p className="text-sm text-yellow-800">
//                   {isInsurance 
//                     ? 'This payment is pending insurance claim verification and approval by the insurance provider.' 
//                     : 'This payment is pending verification.'}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Hospital Info */}
//           <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
//             <h3 className="text-2xl font-bold text-teal-900">
//               {hospital?.name || 'SmartCare Hospital'}
//             </h3>
//             <p className="text-sm text-gray-600 mt-1">
//               {hospital?.address || 'Hospital Address'}
//             </p>
//             <p className="text-sm text-gray-600">
//               Phone: {hospital?.phone || 'N/A'}
//             </p>
//           </div>

//           {/* Receipt Details */}
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <div>
//               <p className="text-sm text-gray-600">Receipt Number</p>
//               <p className="font-semibold text-gray-900">{receiptNumber}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Date & Time</p>
//               <p className="font-semibold text-gray-900">{formatDate(createdAt)}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Visit ID</p>
//               <p className="font-mono text-sm text-gray-900">{visitId}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Payment Status</p>
//               <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                 paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
//                 paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                 'bg-gray-100 text-gray-800'
//               }`}>
//                 {paymentStatus.toUpperCase()}
//               </span>
//             </div>
//             {isInsurance && insuranceClaimNumber && (
//               <div className="col-span-2">
//                 <p className="text-sm text-gray-600">Insurance Claim Number</p>
//                 <p className="font-mono font-bold text-blue-900">{insuranceClaimNumber}</p>
//               </div>
//             )}
//           </div>

//           {/* Patient Information */}
//           <div className="mb-6 bg-gray-50 rounded-lg p-4">
//             <h4 className="text-sm font-bold text-gray-900 mb-3">Patient Information</h4>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <span className="text-gray-600">Name:</span>
//                 <span className="ml-2 font-medium text-gray-900">{patient?.name}</span>
//               </div>
//               <div>
//                 <span className="text-gray-600">NIC:</span>
//                 <span className="ml-2 font-medium text-gray-900">{patient?.nic}</span>
//               </div>
//               <div>
//                 <span className="text-gray-600">Barcode:</span>
//                 <span className="ml-2 font-mono text-xs text-gray-900">{patient?.barcode}</span>
//               </div>
//               <div>
//                 <span className="text-gray-600">Phone:</span>
//                 <span className="ml-2 font-medium text-gray-900">{patient?.phone || 'N/A'}</span>
//               </div>
//             </div>
//           </div>

//           {/* Medications Table */}
//           <div className="mb-6">
//             <h4 className="text-sm font-bold text-gray-900 mb-3">Medications</h4>
//             <div className="border border-gray-200 rounded-lg overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-teal-600 text-white">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-xs font-semibold">Medication</th>
//                     <th className="px-4 py-2 text-center text-xs font-semibold">Qty</th>
//                     <th className="px-4 py-2 text-right text-xs font-semibold">Unit Price</th>
//                     <th className="px-4 py-2 text-right text-xs font-semibold">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {medications.map((med, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 text-sm text-gray-900 capitalize">{med.name}</td>
//                       <td className="px-4 py-3 text-sm text-gray-900 text-center">{med.quantity}</td>
//                       <td className="px-4 py-3 text-sm text-gray-900 text-right">
//                         Rs. {med.unitPrice.toFixed(2)}
//                       </td>
//                       <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
//                         Rs. {med.totalPrice.toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Payment Summary */}
//           <div className="mb-6 bg-gray-50 rounded-lg p-4">
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Subtotal:</span>
//                 <span className="font-medium text-gray-900">Rs. {subtotal.toFixed(2)}</span>
//               </div>
//               {tax > 0 && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Tax:</span>
//                   <span className="font-medium text-gray-900">Rs. {tax.toFixed(2)}</span>
//                 </div>
//               )}
//               {discount > 0 && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Discount:</span>
//                   <span className="font-medium text-green-600">-Rs. {discount.toFixed(2)}</span>
//                 </div>
//               )}
//               <div className="pt-2 border-t-2 border-gray-300 flex justify-between">
//                 <span className="text-base font-bold text-gray-900">Total Amount:</span>
//                 <span className="text-lg font-bold text-teal-600">
//                   Rs. {totalAmount.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Payment Method Details */}
//           <div className="mb-6 bg-gray-50 rounded-lg p-4">
//             <h4 className="text-sm font-bold text-gray-900 mb-3">Payment Details</h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Payment Method:</span>
//                 <span className="font-medium text-gray-900 uppercase flex items-center gap-2">
//                   {isInsurance && <Shield className="h-4 w-4 text-blue-600" />}
//                   {paymentMethod}
//                 </span>
//               </div>

//               {/* Cash Payment Details */}
//               {paymentMethod === 'cash' && paymentDetails?.amountTendered && (
//                 <>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Amount Tendered:</span>
//                     <span className="font-medium text-gray-900">
//                       Rs. {paymentDetails.amountTendered.toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Change Given:</span>
//                     <span className="font-medium text-green-600">
//                       Rs. {paymentDetails.change.toFixed(2)}
//                     </span>
//                   </div>
//                 </>
//               )}

//               {/* Card Payment Details */}
//               {paymentMethod === 'card' && paymentDetails?.authorizationCode && (
//                 <>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Authorization Code:</span>
//                     <span className="font-mono text-xs text-gray-900">
//                       {paymentDetails.authorizationCode}
//                     </span>
//                   </div>
//                   {paymentDetails?.transactionId && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Transaction ID:</span>
//                       <span className="font-mono text-xs text-gray-900">
//                         {paymentDetails.transactionId}
//                       </span>
//                     </div>
//                   )}
//                   {paymentDetails?.cardLast4 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Card Number:</span>
//                       <span className="font-mono text-xs text-gray-900">
//                         **** **** **** {paymentDetails.cardLast4}
//                       </span>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Insurance Payment Details - Highlighted Section */}
//             {isInsurance && paymentDetails && (
//               <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <h5 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
//                   <Shield className="h-4 w-4" />
//                   Insurance Claim Details
//                 </h5>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-blue-700">Insurance Company:</span>
//                     <span className="font-medium text-blue-900">{paymentDetails.insuranceName}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-blue-700">Office Location:</span>
//                     <span className="font-medium text-blue-900">{paymentDetails.insuranceLocation}</span>
//                   </div>
//                   <div className="flex justify-between pt-2 border-t border-blue-300">
//                     <span className="text-blue-700 font-semibold">Insurance Coverage:</span>
//                     <span className="font-bold text-blue-900">Rs. {paymentDetails.insuranceAmount.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-blue-700 font-semibold">Patient Responsibility:</span>
//                     <span className="font-bold text-orange-600">
//                       Rs. {(totalAmount - paymentDetails.insuranceAmount).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer Info */}
//           <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-4">
//             <p>Served by: {cashier?.firstName} {cashier?.lastName}</p>
//             <p className="mt-2 font-semibold">Thank you for choosing {hospital?.name || 'SmartCare'}!</p>
//             <p className="text-xs mt-1">Please keep this receipt for your records.</p>
//             {isInsurance && (
//               <p className="text-xs mt-2 text-yellow-700 font-medium">
//                 * Insurance claims are subject to verification and approval by the insurance provider.
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
//           {/* <button
//             onClick={generatePDF}
//             className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 font-medium"
//           >
//             <Download className="h-5 w-5" />
//             Download PDF
//           </button> */}
//           <button
//             onClick={handlePrint}
//             className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium"
//           >
//             <Printer className="h-5 w-5" />
//             Print Receipt
//           </button>
//           <button
//             onClick={onClose}
//             className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// components/Receipt.jsx - UPDATED VERSION

import React from 'react';
import { Download, Printer, X, CheckCircle, Shield, AlertCircle, Receipt as ReceiptIcon, Scissors, Activity, User } from 'lucide-react';

export default function Receipt({ receiptData, onClose }) {
  if (!receiptData) return null;

  const {
    receiptNumber,
    visitId,
    createdAt,
    patient,
    medications = [],
    surgeries = [],
    procedures = [],
    appointmentFee = 0,
    subtotal,
    tax,
    discount,
    totalAmount,
    paymentMethod,
    paymentStatus,
    paymentDetails,
    insuranceClaimNumber,
    cashier,
    hospital
  } = receiptData;

  const isInsurance = paymentMethod === 'insurance';
  const isPending = paymentStatus === 'pending';

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Combine all items for display
  const allItems = [
    ...medications.map(m => ({ ...m, type: m.type || 'medication' })),
    ...surgeries.map(s => ({ ...s, type: s.type || 'surgery' })),
    ...procedures.map(p => ({ ...p, type: p.type || 'procedure' }))
  ];

  // Add appointment fee if exists
  if (appointmentFee > 0) {
    allItems.push({
      type: 'appointment',
      name: 'Doctor Consultation Fee',
      quantity: 1,
      unitPrice: appointmentFee,
      totalPrice: appointmentFee
    });
  }

  // Get icon for item type
  const getItemIcon = (type) => {
    switch(type) {
      case 'medication': return <ReceiptIcon className="h-3 w-3 text-blue-600" />;
      case 'surgery': return <Scissors className="h-3 w-3 text-red-600" />;
      case 'procedure': return <Activity className="h-3 w-3 text-green-600" />;
      case 'appointment': return <User className="h-3 w-3 text-purple-600" />;
      default: return <ReceiptIcon className="h-3 w-3 text-gray-600" />;
    }
  };

  // Get badge color for item type
  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'medication': return 'bg-blue-100 text-blue-700';
      case 'surgery': return 'bg-red-100 text-red-700';
      case 'procedure': return 'bg-green-100 text-green-700';
      case 'appointment': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Print Receipt
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${isPending ? 'bg-yellow-100' : 'bg-green-100'}`}>
              {isPending ? (
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isPending ? 'Payment Pending' : 'Payment Successful'}
              </h2>
              <p className="text-sm text-gray-600">Receipt #{receiptNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6" id="receipt-content">
          {/* Pending Status Banner */}
          {isPending && (
            <div className="mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 flex items-start gap-3">
              <Shield className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 text-base mb-1">Payment Pending Verification</h3>
                <p className="text-sm text-yellow-800">
                  {isInsurance
                    ? 'This payment is pending insurance claim verification and approval by the insurance provider.'
                    : 'This payment is pending verification.'}
                </p>
              </div>
            </div>
          )}

          {/* Hospital Info */}
          <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
            <h3 className="text-2xl font-bold text-teal-900">
              {hospital?.name || 'SmartCare Hospital'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {hospital?.address || 'Hospital Address'}
            </p>
            <p className="text-sm text-gray-600">
              Phone: {hospital?.phone || 'N/A'}
            </p>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Receipt Number</p>
              <p className="font-semibold text-gray-900">{receiptNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-semibold text-gray-900">{formatDate(createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Visit ID</p>
              <p className="font-mono text-sm text-gray-900">{visitId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {paymentStatus.toUpperCase()}
              </span>
            </div>
            {isInsurance && insuranceClaimNumber && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Insurance Claim Number</p>
                <p className="font-mono font-bold text-blue-900">{insuranceClaimNumber}</p>
              </div>
            )}
          </div>

          {/* Patient Information */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Patient Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium text-gray-900">{patient?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">NIC:</span>
                <span className="ml-2 font-medium text-gray-900">{patient?.nic}</span>
              </div>
              <div>
                <span className="text-gray-600">Barcode:</span>
                <span className="ml-2 font-mono text-xs text-gray-900">{patient?.barcode}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2 font-medium text-gray-900">{patient?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* All Items Table */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Bill Items</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold">Item</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold">Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold">Unit Price</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {getItemIcon(item.type)}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeBadgeColor(item.type)}`}>
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 capitalize">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        Rs. {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        Rs. {item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">Rs. {subtotal.toFixed(2)}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">Rs. {tax.toFixed(2)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">-Rs. {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t-2 border-gray-300 flex justify-between">
                <span className="text-base font-bold text-gray-900">Total Amount:</span>
                <span className="text-lg font-bold text-teal-600">
                  Rs. {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Payment Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900 uppercase flex items-center gap-2">
                  {isInsurance && <Shield className="h-4 w-4 text-blue-600" />}
                  {paymentMethod}
                </span>
              </div>

              {/* Cash Payment Details */}
              {paymentMethod === 'cash' && paymentDetails?.amountTendered && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Tendered:</span>
                    <span className="font-medium text-gray-900">
                      Rs. {paymentDetails.amountTendered.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Change Given:</span>
                    <span className="font-medium text-green-600">
                      Rs. {paymentDetails.change.toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              {/* Card Payment Details */}
              {paymentMethod === 'card' && paymentDetails?.authorizationCode && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Authorization Code:</span>
                    <span className="font-mono text-xs text-gray-900">
                      {paymentDetails.authorizationCode}
                    </span>
                  </div>
                  {paymentDetails?.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-xs text-gray-900">
                        {paymentDetails.transactionId}
                      </span>
                    </div>
                  )}
                  {paymentDetails?.cardLast4 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Number:</span>
                      <span className="font-mono text-xs text-gray-900">
                        **** **** **** {paymentDetails.cardLast4}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Insurance Payment Details - Highlighted Section */}
            {isInsurance && paymentDetails && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Insurance Claim Details
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Insurance Company:</span>
                    <span className="font-medium text-blue-900">{paymentDetails.insuranceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Office Location:</span>
                    <span className="font-medium text-blue-900">{paymentDetails.insuranceLocation}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-300">
                    <span className="text-blue-700 font-semibold">Insurance Coverage:</span>
                    <span className="font-bold text-blue-900">Rs. {paymentDetails.insuranceAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 font-semibold">Patient Responsibility:</span>
                    <span className="font-bold text-orange-600">
                      Rs. {(totalAmount - paymentDetails.insuranceAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-4">
            <p>Served by: {cashier?.firstName} {cashier?.lastName}</p>
            <p className="mt-2 font-semibold">Thank you for choosing {hospital?.name || 'SmartCare'}!</p>
            <p className="text-xs mt-1">Please keep this receipt for your records.</p>
            {isInsurance && (
              <p className="text-xs mt-2 text-yellow-700 font-medium">
                * Insurance claims are subject to verification and approval by the insurance provider.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Printer className="h-5 w-5" />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}