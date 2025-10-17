// pages/dashboards/cashierDashboard.jsx - UPDATED VERSION

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  User,
  DollarSign,
  FileText,
  RefreshCw,
  XCircle,
  Receipt,
  Clock,
  CheckCircle,
  Printer,
  Shield,
  Scissors,
  Activity
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { getJSON, postJSON, useAuthHeaders } from '../../utils/api';
import ReceiptModal from '../../components/Receipt';
import stethoscopeBg from '../../assets/steth.jpg';

export default function CashierDashboard() {
  const { user } = useAuth();
  const headers = useAuthHeaders();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // State management
  const [activeTab, setActiveTab] = useState('search');
  const [nic, setNic] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [billData, setBillData] = useState(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountTendered, setAmountTendered] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [notes, setNotes] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Insurance state
  const [insuranceName, setInsuranceName] = useState('');
  const [insuranceLocation, setInsuranceLocation] = useState('');
  const [insuranceAmount, setInsuranceAmount] = useState('');

  // Receipt options
  const [receiptOptions, setReceiptOptions] = useState({
    print: true,
    sms: false,
    email: false
  });

  // Payment history
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Receipt modal state
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);

  // Search patient by NIC
  const handleSearchPatient = async (e) => {
    e.preventDefault();
    if (!nic.trim()) {
      toast.error('Please enter NIC number');
      return;
    }

    setSearchLoading(true);
    setPatientData(null);
    setBillData(null);

    try {
      const response = await getJSON(
        `${API_BASE}/api/payments/patient/nic/${nic}`,
        headers
      );
      setPatientData(response.patient);
      setBillData(response.bill);
      toast.success(`Patient found: ${response.patient.name}`);
    } catch (error) {
      console.error('Error searching patient:', error);
      toast.error(error.message || 'Patient not found or has no items to bill');
      setPatientData(null);
      setBillData(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // Calculate change
  const calculateChange = () => {
    if (paymentMethod === 'cash' && amountTendered && billData) {
      const change = parseFloat(amountTendered) - billData.totalAmount;
      return change >= 0 ? change.toFixed(2) : 0;
    }
    return 0;
  };

  // Process payment
  const handleProcessPayment = async () => {
    if (!patientData || !billData) {
      toast.error('No patient or bill data available');
      return;
    }

    // Validation for cash
    if (paymentMethod === 'cash') {
      if (!amountTendered || parseFloat(amountTendered) < billData.totalAmount) {
        toast.error('Amount tendered must be greater than or equal to total amount');
        return;
      }
    }

    // Validation for card
    if (paymentMethod === 'card') {
      if (!authCode.trim()) {
        toast.error('Authorization code is required for card payments');
        return;
      }
    }

    // Validation for insurance
    if (paymentMethod === 'insurance') {
      if (!insuranceName.trim()) {
        toast.error('Insurance name is required');
        return;
      }
      if (!insuranceLocation.trim()) {
        toast.error('Insurance location is required');
        return;
      }
      if (!insuranceAmount || parseFloat(insuranceAmount) <= 0) {
        toast.error('Valid insurance amount is required');
        return;
      }
      if (parseFloat(insuranceAmount) > billData.totalAmount) {
        toast.error('Insurance amount cannot exceed total amount');
        return;
      }
    }

    setProcessingPayment(true);

    try {
      const paymentDetails = {};

      if (paymentMethod === 'cash') {
        paymentDetails.amountTendered = parseFloat(amountTendered);
        paymentDetails.change = parseFloat(calculateChange());
      } else if (paymentMethod === 'card') {
        paymentDetails.authorizationCode = authCode;
        paymentDetails.transactionId = `TXN-${Date.now()}`;
        if (cardLast4) {
          paymentDetails.cardLast4 = cardLast4;
        }
      } else if (paymentMethod === 'insurance') {
        paymentDetails.insuranceName = insuranceName;
        paymentDetails.insuranceLocation = insuranceLocation;
        paymentDetails.insuranceAmount = parseFloat(insuranceAmount);
      }

      // Extract medications, surgeries, procedures
      const medications = billData.items.filter(item => item.type === 'medication');
      const surgeries = billData.items.filter(item => item.type === 'surgery');
      const procedures = billData.items.filter(item => item.type === 'procedure');
      const appointmentFeeItem = billData.items.find(item => item.type === 'appointment');

      const response = await postJSON(
        `${API_BASE}/api/payments/process`,
        headers,
        {
          patientId: patientData._id,
          userId: patientData.userId,
          medications: medications,
          surgeries: surgeries,
          procedures: procedures,
          appointmentFee: appointmentFeeItem ? appointmentFeeItem.totalPrice : 0,
          paymentMethod,
          paymentDetails,
          receiptDelivery: receiptOptions,
          notes: notes.trim() || undefined
        }
      );

      toast.success(
        paymentMethod === 'insurance'
          ? `Insurance claim submitted! Claim #: ${response.payment.insuranceClaimNumber}`
          : `Payment processed successfully! Receipt: ${response.payment.receiptNumber}`
      );

      // Set receipt data and show modal
      setCurrentReceipt({
        receiptNumber: response.payment.receiptNumber,
        visitId: response.payment.visitId,
        createdAt: response.payment.createdAt,
        patient: {
          name: patientData.name,
          nic: patientData.nic,
          barcode: patientData.barcode,
          phone: patientData.phone
        },
        medications: response.payment.medications || [],
        surgeries: response.payment.surgeries || [],
        procedures: response.payment.procedures || [],
        appointmentFee: response.payment.appointmentFee || 0,
        subtotal: billData.subtotal,
        tax: billData.tax,
        discount: billData.discount,
        totalAmount: response.payment.totalAmount,
        paymentMethod: response.payment.paymentMethod,
        paymentStatus: response.payment.paymentStatus,
        paymentDetails: paymentDetails,
        insuranceClaimNumber: response.payment.insuranceClaimNumber,
        cashier: {
          firstName: user?.firstName,
          lastName: user?.lastName
        },
        hospital: {
          name: user?.hospitalName || 'SmartCare Hospital',
          address: user?.hospitalAddress || 'Hospital Address',
          phone: user?.hospitalPhone || 'N/A'
        }
      });

      setShowReceipt(true);

      // Reset form
      resetForm();

      // Reload payment history
      loadPaymentHistory();

    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setNic('');
    setPatientData(null);
    setBillData(null);
    setAmountTendered('');
    setCardLast4('');
    setAuthCode('');
    setInsuranceName('');
    setInsuranceLocation('');
    setInsuranceAmount('');
    setNotes('');
    setPaymentMethod('cash');
    setReceiptOptions({ print: true, sms: false, email: false });
  };

  // Load payment history
  const loadPaymentHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await getJSON(
        `${API_BASE}/api/payments/history?limit=10`,
        headers
      );
      setPaymentHistory(response.payments || []);
    } catch (error) {
      console.error('Error loading payment history:', error);
      toast.error('Failed to load payment history');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load payment history on mount
  useEffect(() => {
    if (activeTab === 'history') {
      loadPaymentHistory();
    }
  }, [activeTab]);

  // Get icon for item type
  const getItemIcon = (type) => {
    switch(type) {
      case 'medication': return <Receipt className="h-4 w-4 text-blue-600" />;
      case 'surgery': return <Scissors className="h-4 w-4 text-red-600" />;
      case 'procedure': return <Activity className="h-4 w-4 text-green-600" />;
      case 'appointment': return <User className="h-4 w-4 text-purple-600" />;
      default: return <Receipt className="h-4 w-4 text-gray-600" />;
    }
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
      {/* Receipt Modal */}
      {showReceipt && currentReceipt && (
        <ReceiptModal
          receiptData={currentReceipt}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {/* Header */}
      <section className="bg-white border-b border-teal-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-600 p-3">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-teal-900">
                  Cashier Dashboard
                </h1>
                <p className="text-sm text-teal-900/70">
                  Welcome, {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search className="h-4 w-4" />
            Process Payment
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="h-4 w-4" />
            Payment History
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
        {/* Process Payment Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Patient */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                Search Patient by NIC
              </h2>
              <form onSubmit={handleSearchPatient} className="flex gap-2">
                <input
                  type="text"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  placeholder="Enter NIC (e.g., 123456789V or 200012345678)"
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {searchLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Search
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Patient Information */}
            {patientData && billData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{patientData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NIC:</span>
                      <span className="font-medium text-gray-900">{patientData.nic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Barcode:</span>
                      <span className="font-mono text-sm text-gray-900">{patientData.barcode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Group:</span>
                      <span className="font-medium text-gray-900">{patientData.bloodGroup || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium text-gray-900">{patientData.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-teal-600" />
                    Bill Summary
                  </h3>

                  {/* All Items List */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {billData.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            {getItemIcon(item.type)}
                            <div>
                              <span className="text-sm font-medium text-gray-900 capitalize">{item.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({item.type}) {item.quantity > 1 && `x${item.quantity}`}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            Rs. {item.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 pt-3 border-t-2 border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-900">Rs. {billData.subtotal.toFixed(2)}</span>
                    </div>
                    {billData.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium text-gray-900">Rs. {billData.tax.toFixed(2)}</span>
                      </div>
                    )}
                    {billData.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-green-600">-Rs. {billData.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total Amount:</span>
                      <span className="text-teal-600">Rs. {billData.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Processing */}
            {patientData && billData && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-teal-600" />
                  Process Payment
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Payment Method */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setPaymentMethod('cash')}
                          className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
                            paymentMethod === 'cash'
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Cash
                        </button>
                        <button
                          onClick={() => setPaymentMethod('card')}
                          className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
                            paymentMethod === 'card'
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Card
                        </button>
                        <button
                          onClick={() => setPaymentMethod('insurance')}
                          className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
                            paymentMethod === 'insurance'
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Insurance
                        </button>
                      </div>
                    </div>

                    {/* Cash Payment Fields */}
                    {paymentMethod === 'cash' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount Tendered (Rs.)
                          </label>
                          <input
                            type="number"
                            value={amountTendered}
                            onChange={(e) => setAmountTendered(e.target.value)}
                            placeholder="Enter amount received"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            step="0.01"
                            min={billData.totalAmount}
                          />
                        </div>
                        {amountTendered && parseFloat(amountTendered) >= billData.totalAmount && (
                          <div className="bg-green-50 border border-green-200 rounded-md p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-green-900">Change:</span>
                              <span className="text-lg font-bold text-green-600">Rs. {calculateChange()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Payment Fields */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Authorization Code *
                          </label>
                          <input
                            type="text"
                            value={authCode}
                            onChange={(e) => setAuthCode(e.target.value)}
                            placeholder="Enter authorization code"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Last 4 Digits (Optional)
                          </label>
                          <input
                            type="text"
                            value={cardLast4}
                            onChange={(e) => setCardLast4(e.target.value)}
                            placeholder="Last 4 digits"
                            maxLength={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Insurance Payment Fields */}
                    {paymentMethod === 'insurance' && (
                      <div className="space-y-3">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                          <p className="text-xs text-yellow-800">
                            <strong>Note:</strong> Insurance claims will be marked as pending and require verification.
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Insurance Company Name *
                          </label>
                          <input
                            type="text"
                            value={insuranceName}
                            onChange={(e) => setInsuranceName(e.target.value)}
                            placeholder="e.g., National Insurance Company"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Insurance Office Location *
                          </label>
                          <input
                            type="text"
                            value={insuranceLocation}
                            onChange={(e) => setInsuranceLocation(e.target.value)}
                            placeholder="e.g., Colombo Branch"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (Rs.) *
                          </label>
                          <input
                            type="number"
                            value={insuranceAmount}
                            onChange={(e) => setInsuranceAmount(e.target.value)}
                            placeholder="Enter covered amount"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            step="0.01"
                            min="0"
                            max={billData.totalAmount}
                          />
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any notes..."
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Right Column - Receipt Options & Submit */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Receipt Delivery
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={receiptOptions.print}
                            onChange={(e) => setReceiptOptions({...receiptOptions, print: e.target.checked})}
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <Printer className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-700">Print Receipt</span>
                        </label>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium text-gray-900">Rs. {billData.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-medium text-gray-900 capitalize">{paymentMethod}</span>
                        </div>

                        {paymentMethod === 'cash' && amountTendered && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tendered:</span>
                              <span className="font-medium text-gray-900">Rs. {parseFloat(amountTendered).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Change:</span>
                              <span className="font-medium text-green-600">Rs. {calculateChange()}</span>
                            </div>
                          </>
                        )}

                        {paymentMethod === 'insurance' && insuranceAmount && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Insurance Covers:</span>
                              <span className="font-medium text-blue-600">Rs. {parseFloat(insuranceAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Patient Pays:</span>
                              <span className="font-medium text-orange-600">
                                Rs. {(billData.totalAmount - parseFloat(insuranceAmount)).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-300">
                              <span className="text-gray-600 font-semibold">Status:</span>
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                                Pending Verification
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={handleProcessPayment}
                        disabled={processingPayment}
                        className="w-full px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                      >
                        {processingPayment ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            {paymentMethod === 'insurance' ? 'Submit Insurance Claim' : 'Process Payment'}
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetForm}
                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <XCircle className="h-5 w-5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                  Payment History
                </h2>
                <button
                  onClick={loadPaymentHistory}
                  disabled={historyLoading}
                  className="px-4 py-2 text-sm text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-md transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${historyLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {historyLoading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-2" />
                  <p className="text-gray-600">Loading payment history...</p>
                </div>
              ) : paymentHistory.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No payment records found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receipt #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-900">{payment.receiptNumber}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {payment.userId?.firstName} {payment.userId?.lastName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            Rs. {payment.totalAmount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 capitalize flex items-center gap-1">
                            {payment.paymentMethod === 'insurance' }
                            {payment.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                            payment.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            payment.paymentStatus === 'refunded' ? 'bg-blue-100 text-blue-800' :
                            payment.paymentStatus === 'void' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payment.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </section>
      </main>
    </div>
  );
}